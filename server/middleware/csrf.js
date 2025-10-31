import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const isProd = process.env.NODE_ENV === 'production';

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
  },
  value: (req) => req.headers['x-csrf-token']
});

const router = express.Router();
router.use(cookieParser());

router.get('/', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export function requireCsrf(req, res, next) {
  return csrfProtection(req, res, next);
}

export default router;


