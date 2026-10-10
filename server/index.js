import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Parsing Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware for malformed JSON payloads (400 Bad Request)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      errorType: 'MalformedJSONError',
      message: 'Malformed JSON payload provided in request body.',
      details: err.message,
    });
  }
  next(err);
});

// Mount API routes under /api
app.use('/api', apiRoutes);

// Serve client production static files if client/dist exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to client/dist/index.html for SPA routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In development if client/dist is not built yet
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Express Server-Side Validation</title></head>
          <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
            <h2>Express Validation Server Active</h2>
            <p>API endpoints running on <code>http://localhost:${PORT}/api</code></p>
            <p>Run <code>npm run build</code> or <code>npm run dev</code> to serve the Shadcn UI frontend.</p>
          </body>
        </html>
      `);
    }
  });
});

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Global internal server error handler (500)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    errorType: 'InternalServerError',
    message: 'An unexpected internal server error occurred.',
  });
});

// Start Express Server only when not in test mode
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`[Express Server] Server running on http://localhost:${PORT}`);
    console.log(`[Express Server] Ready to validate incoming requests with express-validator`);
  });
}

export default app;
