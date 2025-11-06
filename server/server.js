import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import csrfRouter from './middleware/csrf.js';
import { ensureUploadsDir } from './util/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://hardweyllc.com';
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.GLOBAL_RATE_PER_MIN || '300', 10)
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
app.use('/', contentRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

// Enable trust proxy for Passenger/reverse proxy setups
app.enable('trust proxy');

// HTTPS enforcement when behind proxy
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
    }
    next();
  });
}

// For Passenger: export the app (Passenger will handle listening)
// For standalone: listen on PORT
const PORT = process.env.PORT || 3001;
if (typeof process.env.PASSENGER_APP_ENV === 'undefined') {
  // Standalone mode (development/testing)
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
} else {
  // Passenger mode - Passenger will handle listening
  console.log('Running in Passenger mode');
}

export default app;


