import app from '../server/app.js';

export default function handler(req, res) {
  if (!req.url || req.url === '/' || req.url === '') {
    req.url = '/api/submissions';
  } else if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
