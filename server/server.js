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

// Log requests in production (optional - comment out if too verbose)
if (process.env.LOG_REQUESTS === 'true') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

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
// Serve static uploads - handle both /api and / prefixes
app.use('/api/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// Routes - handle both /api and / (Passenger doesn't strip prefix on CloudLinux)
app.get('/api', (_req, res) => {
  res.json({ message: 'Hardwey API', version: '1.0.0' });
});
app.get('/', (_req, res) => {
  res.json({ message: 'Hardwey API', version: '1.0.0' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/csrf', csrfRouter);
app.use('/csrf', csrfRouter);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Mount content routes - handle both /api and / prefixes
app.use('/api', contentRoutes);
app.use('/', contentRoutes);

console.log('Routes registered successfully');

// Note: HTTPS redirect is handled by .htaccess, so we don't need it here

// For LiteSpeed/Passenger: Always export the app
// Passenger will handle listening, so we should always export
// Only listen if explicitly NOT in Passenger (development/testing)
const isPassenger = typeof process.env.PASSENGER_APP_ENV !== 'undefined' || 
                    typeof process.env.PASSENGER !== 'undefined' ||
                    typeof process.env.PASSENGER_SPAWN_WORK_DIR !== 'undefined' ||
                    typeof process.env.PASSENGER_INSTANCE_REGISTRY_DIR !== 'undefined';


// Always export for Passenger compatibility
// Only try to listen if we're definitely NOT in Passenger mode
if (!isPassenger && process.env.RUN_STANDALONE === 'true') {
  // Standalone mode (for testing only)
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
