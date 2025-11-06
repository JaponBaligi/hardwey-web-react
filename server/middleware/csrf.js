const express = require('express');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

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

function requireCsrf(req, res, next) {
  return csrfProtection(req, res, next);
}

module.exports = router;
module.exports.requireCsrf = requireCsrf;
