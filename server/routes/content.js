import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { requireAuth } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/csrf.js';
import db from '../db/db.js';

const router = express.Router();

router.get('/content', (_req, res) => {
  const rows = db.prepare('SELECT section, data FROM content ORDER BY section').all();
  const result = {};
  for (const r of rows) {
    try { result[r.section] = JSON.parse(r.data); } catch { result[r.section] = r.data; }
  }
  res.json({ content: result });
});

router.get('/content/:section', (req, res) => {
  const section = sanitizeKey(req.params.section);
  const row = db.prepare('SELECT section, data FROM content WHERE section = ?').get(section);
  if (!row) return res.status(404).json({ error: 'Not found' });
  try { return res.json({ section: row.section, data: JSON.parse(row.data) }); }
  catch { return res.json({ section: row.section, data: row.data }); }
});

router.put('/content/:section', requireAuth, requireCsrf, express.json({ limit: '1mb' }), (req, res) => {
  const section = sanitizeKey(req.params.section);
  const payload = req.body;
  if (!isValidContentPayload(payload)) return res.status(400).json({ error: 'Invalid content payload' });
  const data = JSON.stringify(sanitizeContent(payload));
  db.prepare('INSERT INTO content (section, data) VALUES (?, ?) ON CONFLICT(section) DO UPDATE SET data=excluded.data')
    .run(section, data);
  return res.json({ ok: true });
});

router.delete('/content/:section', requireAuth, requireCsrf, (req, res) => {
  const section = sanitizeKey(req.params.section);
  const info = db.prepare('DELETE FROM content WHERE section = ?').run(section);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  return res.json({ ok: true });
});

const maxBytes = parseInt(process.env.UPLOAD_MAX_BYTES || (5 * 1024 * 1024), 10);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'server', 'public', 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  }
});
const allowedMimes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
function fileFilter(_req, file, cb) {
  if (allowedMimes.has(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'));
}
const upload = multer({ storage, limits: { fileSize: maxBytes }, fileFilter });

router.post('/uploads', requireAuth, requireCsrf, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.message === 'Invalid file type') return res.status(400).json({ error: 'Invalid file type' });
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large' });
      return next(err);
    }
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    const publicUrl = `/uploads/${file.filename}`;
    return res.json({ ok: true, url: publicUrl });
  });
});

function sanitizeKey(key) {
  return String(key || '').trim().replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 100);
}
function sanitizeString(s) {
  return String(s || '').replace(/<script/gi, '&lt;script').trim();
}
function sanitizeUrl(u) {
  const s = String(u || '').trim();
  if (!/^https?:\/\//i.test(s) && !s.startsWith('/uploads/')) return '';
  return s;
}
function sanitizeContent(obj) {
  if (obj == null) return null;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeContent(item));
  }
  if (typeof obj === 'object') {
    const out = {};
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      // Special handling for known URL/image fields
      if ((key === 'url' || key === 'imageUrl' || key === 'backgroundImage' || key === 'photo') && typeof value === 'string') {
        out[key] = sanitizeUrl(value);
      } else if (key === 'images' && Array.isArray(value)) {
        out[key] = value.map(x => sanitizeUrl(x)).filter(Boolean);
      } else if (key === 'links' && Array.isArray(value)) {
        out[key] = value.map(l => {
          if (typeof l === 'object' && l != null) {
            return {
              label: sanitizeString(l?.label ?? ''),
              url: sanitizeUrl(l?.url ?? '')
            };
          }
          return null;
        }).filter(l => l && l.url && l.label);
      } else {
        // Recursively sanitize nested objects and arrays
        out[key] = sanitizeContent(value);
      }
    }
    return out;
  }
  return obj;
}
function isValidContentPayload(obj) {
  if (obj == null) return true; // Allow null values
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return true;
  if (Array.isArray(obj)) {
    // Recursively validate array items
    return obj.every(item => isValidContentPayload(item));
  }
  if (typeof obj === 'object') {
    // Recursively validate object properties
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      if (!isValidContentPayload(obj[key])) return false;
    }
    return true;
  }
  return false;
}

export default router;


