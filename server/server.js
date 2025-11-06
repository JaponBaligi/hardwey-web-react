require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Error handling for module loading
let authRoutes, contentRoutes, csrfRouter, ensureUploadsDir;
try {
  authRoutes = require('./routes/auth.js');
  contentRoutes = require('./routes/content.js');
  csrfRouter = require('./middleware/csrf.js');
  const fsUtil = require('./util/fs.js');
  ensureUploadsDir = fsUtil.ensureUploadsDir;
} catch (error) {
  console.error('Error loading modules:', error);
  process.exit(1);
}

const app = express();

// Log startup info
console.log('Starting Hardwey API server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Passenger env:', process.env.PASSENGER_APP_ENV || process.env.PASSENGER || 'not set');

// Enable trust proxy for Passenger/reverse proxy setups
// Only trust the first proxy (more secure than trusting all)
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://hardweyllc.com';
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.GLOBAL_RATE_PER_MIN || '300', 10),
  // Skip trust proxy validation since we've configured it properly
  validate: { trustProxy: false }
});
app.use(globalLimiter);

const uploadsDir = path.join(__dirname, 'public', 'uploads');
ensureUploadsDir(uploadsDir);
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

app.use('/csrf', csrfRouter);
app.use('/auth', authRoutes);
app.get('/health', (_req, res) => {
  console.log('Health check requested');
  res.json({ ok: true });
});
app.get('/', (_req, res) => {
  console.log('Root route requested');
  res.json({ message: 'Hardwey API', version: '1.0.0' });
});
app.use('/', contentRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Not found', 
    path: req.originalUrl,
    method: req.method 
  });
});

console.log('Routes registered successfully');

// Note: HTTPS redirect is handled by .htaccess, so we don't need it here

// For LiteSpeed: export the app (LiteSpeed will handle listening)
// Check for LiteSpeed environment variables
const isLiteSpeed = typeof process.env.PASSENGER_APP_ENV !== 'undefined' || 
                    typeof process.env.PASSENGER !== 'undefined' ||
                    typeof process.env.LSWS !== 'undefined' ||
                    process.env.NODE_ENV === 'production';

if (!isLiteSpeed) {
  // Standalone mode (development/testing)
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
} else {
  // Passenger/LiteSpeed mode - Passenger will handle listening
  console.log('Running in Passenger/LiteSpeed mode');
  console.log('App ready and exported');
}

module.exports = app;
