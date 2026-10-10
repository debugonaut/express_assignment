import app from './app.js';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`[Express Server] Server running on http://localhost:${PORT}`);
  console.log(`[Express Server] Ready to validate incoming requests with express-validator`);
});

export default app;
export { server };
