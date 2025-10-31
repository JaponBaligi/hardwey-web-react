import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.sub, username: decoded.username, tokenVersion: decoded.tv };
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


