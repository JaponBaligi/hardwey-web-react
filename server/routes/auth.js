import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import { rateLimit } from 'express-rate-limit';
import { requireCsrf } from '../middleware/csrf.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.LOGIN_RATE_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.LOGIN_RATE_MAX || '5', 10),
  standardHeaders: true,
  legacyHeaders: false
});

function cookieBase() {
  const isProd = process.env.NODE_ENV === 'production';
  return { httpOnly: true, secure: isProd, sameSite: 'strict' };
}
function accessCookieOptions() { return { ...cookieBase(), path: '/' }; }
function refreshCookieOptions() { return { ...cookieBase(), path: '/api/auth' }; }

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' });
}

router.post('/login', loginLimiter, requireCsrf, express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid credentials' });
  const user = db.prepare('SELECT id, username, password_hash, token_version FROM admin_users WHERE username = ?').get(username.trim());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const accessToken = signAccessToken({ sub: user.id, username: user.username, tv: user.token_version });
  const refreshToken = signRefreshToken({ sub: user.id, tv: user.token_version });
  res.cookie('accessToken', accessToken, accessCookieOptions());
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());
  return res.json({ ok: true });
});

router.post('/refresh', requireCsrf, (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, username, token_version FROM admin_users WHERE id = ?').get(decoded.sub);
    if (!user || user.token_version !== decoded.tv) return res.status(401).json({ error: 'Invalid token' });
    const newAccess = signAccessToken({ sub: user.id, username: user.username, tv: user.token_version });
    res.cookie('accessToken', newAccess, accessCookieOptions());
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', requireCsrf, (req, res) => {
  res.clearCookie('accessToken', accessCookieOptions());
  res.clearCookie('refreshToken', refreshCookieOptions());
  return res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ authenticated: true, user: { id: decoded.sub, username: decoded.username } });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
});

export default router;


