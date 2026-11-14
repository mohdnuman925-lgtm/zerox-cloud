import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, saveDB, logAudit } from '../db.js';
import { PterodactylAdapter } from '../providers/pterodactylAdapter.js';

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

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDB();
    const existing = db.profiles.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      email: email.trim().toLowerCase(),
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDB();
    const user = db.profiles.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    logAudit(user.name, user.role, 'LOGIN', user.id, 'User logged in');

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

// Discord SSO Simulation
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

