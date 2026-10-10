import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Mount API routes under /api and root
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Serve client production static files from dist, client/dist, or public
const rootDistPath = path.resolve(__dirname, '../dist');
const clientDistPath = path.resolve(__dirname, '../client/dist');
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(rootDistPath));
app.use(express.static(clientDistPath));
app.use(express.static(publicPath));

// Fallback to client/dist/index.html or public/index.html for SPA routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(publicPath, 'index.html'), (err2) => {
        if (err2) {
          res.status(200).send(`
            <!DOCTYPE html>
            <html>
              <head><title>Express Server-Side Validation</title></head>
              <body style="font-family: sans-serif; background: #09090b; color: #f4f4f5; padding: 40px; text-align: center;">
                <h2>Express Validation Server Active</h2>
                <p>API endpoints running on <code>/api</code></p>
              </body>
            </html>
          `);
        }
      });
    }
  });
});

// Global 404 handler for unmatched API routes
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

export default app;
