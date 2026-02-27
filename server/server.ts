import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middlewares/error.middleware';

// Import routes (will be created later)
// import authRoutes from './routes/auth.routes';
// import transactionRoutes from './routes/transaction.routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev/preview compatibility
    crossOriginEmbedderPolicy: false
  }));
  app.use(morgan('dev'));
  
  // CORS configuration
  app.use(cors({
    origin: true, // Allow all origins for preview
    credentials: true
  }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Error Handler (must be last)
  app.use(errorHandler);

  // Vite Middleware (for serving frontend in dev mode)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving (if we were building)
    app.use(express.static(path.join(__dirname, '../dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
