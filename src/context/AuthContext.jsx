import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zx_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired
          localStorage.removeItem('zx_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }
    localStorage.setItem('zx_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account');
    }
    localStorage.setItem('zx_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const discordLogin = async () => {
    const res = await fetch('/api/auth/discord-sso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Discord sign-in failed');
    }
    localStorage.setItem('zx_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('zx_token');
    setToken(null);
    setUser(null);
  };

  const updatePanelPassword = async (newPassword) => {
    const res = await fetch('/api/auth/panel-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ new_password: newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update panel password');
    }
    setUser((prev) => ({ ...prev, panel_password: newPassword }));
    return data;
  };

  const isSuperAdmin = user && user.role === 'super_admin';
  const isFounder = user && (user.role === 'founder' || user.role === 'super_admin');
  const isAdmin = user && ['super_admin', 'founder', 'admin'].includes(user.role);
  const isStaff = user && ['super_admin', 'founder', 'admin', 'moderator', 'ticket_staff'].includes(user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isSuperAdmin,
        isFounder,
        isStaff,
        login,
        register,
        discordLogin,
        logout,
        updatePanelPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

