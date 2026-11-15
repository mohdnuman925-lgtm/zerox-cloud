import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, saveDB, logAudit } from '../db.js';
import { PterodactylAdapter } from '../providers/pterodactylAdapter.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { sanitizeString, isValidEmail, isStrongPassword } from '../middleware/sanitize.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zerox_cloud_jwt_secret_secure_key_2026';

// Middleware to authenticate JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const db = getDB();
    const user = db.profiles.find((u) => u.id === decoded.userId);
    if (!user || user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended or not found' });
    }
    req.user = user;
    next();
  });
};

// Register (Rate-limited, email & password validated, sanitized)
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = sanitizeString(name, 60);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const db = getDB();
    const existing = db.profiles.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(12);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      email: cleanEmail,
      password_hash,
      role: 'customer',
      panel_password: password,
      status: 'active',
      created_at: new Date().toISOString()
    };

    db.profiles.push(newUser);
    saveDB(db);

    logAudit(newUser.name, 'customer', 'REGISTER', newUser.id, 'User registered account');

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        panel_password: newUser.panel_password,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login (Rate-limited, brute-force audited)
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDB();
    const user = db.profiles.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      logAudit(cleanEmail, 'visitor', 'LOGIN_FAILED', 'auth', 'Failed login attempt - user not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      logAudit(user.name, user.role, 'LOGIN_FAILED', user.id, 'Failed login attempt - wrong password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    logAudit(user.name, user.role, 'LOGIN', user.id, 'User logged in successfully');

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        panel_password: user.panel_password,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Discord OAuth2 URL Generator
router.get('/discord/url', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID || '';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${protocol}://${host}/api/auth/discord/callback`;

  if (!clientId) {
    return res.json({
      configured: false,
      redirectUri,
      message: 'DISCORD_CLIENT_ID not configured in .env'
    });
  }

  const targetRedirect = req.query.redirect || '/client/overview';
  const stateObj = { redirect: targetRedirect, nonce: Date.now() };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=identify%20email&state=${encodeURIComponent(state)}`;

  res.json({
    configured: true,
    url: authUrl,
    redirectUri
  });
});

// Discord OAuth2 Callback Handler
router.get('/discord/callback', async (req, res) => {
  try {
    const { code, state, error: discordError } = req.query;

    if (discordError) {
      return res.redirect(`/login?error=${encodeURIComponent('Discord authorization denied')}`);
    }

    if (!code) {
      return res.redirect('/login?error=Missing+authorization+code');
    }

    let redirectPath = '/client/overview';
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        if (parsed.redirect) redirectPath = parsed.redirect;
      } catch (e) {}
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${protocol}://${host}/api/auth/discord/callback`;

    if (!clientId || !clientSecret) {
      return res.redirect('/login?error=Discord+OAuth+keys+missing+on+server');
    }

    // Exchange code for Discord Access Token
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: String(code),
      redirect_uri: redirectUri
    });

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Discord Token Exchange Error:', tokenData);
      return res.redirect(`/login?error=${encodeURIComponent(tokenData.error_description || 'Discord authentication failed')}`);
    }

    // Fetch User Profile from Discord API
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const discordUser = await userRes.json();

    if (!userRes.ok || !discordUser.id) {
      return res.redirect('/login?error=Failed+to+fetch+Discord+profile');
    }

    const db = getDB();
    const email = (discordUser.email || `${discordUser.username}@discord.zeroxcloud.com`).toLowerCase();
    const displayName = discordUser.global_name || discordUser.username;
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null;

    let user = db.profiles.find((u) => u.discord_id === discordUser.id || u.email.toLowerCase() === email);

    if (!user) {
      const salt = bcrypt.genSaltSync(12);
      const autoPass = 'Discord_' + Math.random().toString(36).substring(2, 8) + '!';

      user = {
        id: 'usr-dc-' + discordUser.id,
        discord_id: discordUser.id,
        name: displayName,
        email,
        avatar: avatarUrl,
        password_hash: bcrypt.hashSync(autoPass, salt),
        role: 'customer',
        panel_password: autoPass,
        status: 'active',
        created_at: new Date().toISOString()
      };
      db.profiles.push(user);
    } else {
      user.discord_id = discordUser.id;
      if (avatarUrl) user.avatar = avatarUrl;
    }

    saveDB(db);

    logAudit(user.name, user.role, 'LOGIN_DISCORD_OAUTH', user.id, `Discord OAuth verified for @${discordUser.username}`);

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`/login?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}&discord=success`);
  } catch (error) {
    console.error('Discord Callback Exception:', error);
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// Discord SSO Simulation & Fallback
router.post('/discord-sso', async (req, res) => {
  try {
    const db = getDB();
    let user = db.profiles.find((u) => u.email === 'discord.gamer@zeroxcloud.com');

    if (!user) {
      const salt = bcrypt.genSaltSync(10);
      user = {
        id: 'usr-discord-' + Date.now(),
        name: 'Discord Gamer',
        email: 'discord.gamer@zeroxcloud.com',
        password_hash: bcrypt.hashSync('DiscordPass123!', salt),
        role: 'customer',
        panel_password: 'DiscordPtero123!',
        status: 'active',
        created_at: new Date().toISOString()
      };
      db.profiles.push(user);
      saveDB(db);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    logAudit(user.name, user.role, 'LOGIN_DISCORD', user.id, 'Authenticated via Discord SSO');

    res.json({
      message: 'Signed in with Discord',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        panel_password: user.panel_password,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      panel_password: req.user.panel_password,
      created_at: req.user.created_at
    }
  });
});

// Panel Password Update
router.post('/panel-password', authenticateToken, async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = getDB();
    const userIndex = db.profiles.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.profiles[userIndex].panel_password = new_password;
    saveDB(db);

    const adapterResult = await PterodactylAdapter.syncPassword(req.user.email, new_password);

    logAudit(req.user.name, req.user.role, 'UPDATE_PANEL_PASSWORD', req.user.id, 'Pterodactyl panel password updated');

    res.json({
      message: 'Panel password updated successfully',
      mode: adapterResult.mode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

