import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible media/worker loading for Tesseract and audio
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));

// Body Parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logging
app.use(requestLogger);

// API Routes
app.use('/api/v1', apiRoutes);

// Serve static frontend build if present
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In development mode when client is served by Vite separately
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>International Translation API</title></head>
        <body style="font-family:sans-serif;padding:2rem;">
          <h2>International Translation Platform Backend API</h2>
          <p>Status: Active. Frontend is running on Vite dev port or build is pending.</p>
          <p>Health endpoint: <a href="/api/v1/health">/api/v1/health</a></p>
          <p>Languages endpoint: <a href="/api/v1/languages">/api/v1/languages</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Centralized Error Handling
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[Production Server] Translation API is listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

export default app;
