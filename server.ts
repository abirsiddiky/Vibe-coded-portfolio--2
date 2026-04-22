import express from 'express';
import next from 'next';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './backend/lib/db';
import { errorHandler } from './backend/middleware/error';
import { sanitizeInput } from './backend/middleware/sanitization';

// Route Imports
import authRoutes from './backend/routes/authRoutes';
import settingsRoutes from './backend/routes/settingsRoutes';
import projectRoutes from './backend/routes/projectRoutes';
import blogRoutes from './backend/routes/blogRoutes';
import messageRoutes from './backend/routes/messageRoutes';
import serviceRoutes from './backend/routes/serviceRoutes';
import skillRoutes from './backend/routes/skillRoutes';

// Models for initial check (optional)
import User from './backend/models/User';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Connect to DB and run initial setup asynchronously
  connectDB().then(async () => {
    // Initial Admin User Setup (if configured in env)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      try {
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
          await User.create({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
          });
          console.log('Default admin user created');
        }
      } catch (err) {
        console.error('Initial admin setup failed:', err);
      }
    }
  });

  // Basic Security
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.smartsuppchat.com", "https://kit.fontawesome.com"],
        "connect-src": ["'self'", "https://www.smartsuppchat.com", "https://ka-f.fontawesome.com"],
        "img-src": ["'self'", "data:", "https://picsum.photos", "https://*.fontawesome.com"],
        "font-src": ["'self'", "https://ka-f.fontawesome.com", "https://*.fontawesome.com"]
      },
    }
  }));

  server.use(cors({
    origin: process.env.APP_URL || true, // Allow all for now or specific URL
    credentials: true
  }));

  server.use(cookieParser());
  server.use(morgan(dev ? 'dev' : 'combined'));
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));
  server.use(sanitizeInput);

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  server.use('/api', limiter);

  // API Routes
  server.use('/api/auth', authRoutes);
  server.use('/api/settings', settingsRoutes);
  server.use('/api/projects', projectRoutes);
  server.use('/api/blogs', blogRoutes);
  server.use('/api/messages', messageRoutes);
  server.use('/api/services', serviceRoutes);
  server.use('/api/skills', skillRoutes);

  // Global Error Handler for API
  server.use('/api', errorHandler);

  // Next.js Handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('[CRITICAL] Startup failed:', err);
  process.exit(1);
});
