import { Router } from 'express';
import {
  registerValidationRules,
  loginValidationRules,
  feedbackValidationRules,
  handleValidationErrors,
} from '../middleware/validationRules.js';
import {
  registerUser,
  loginUser,
  submitFeedback,
  getSubmissions,
  clearSubmissions,
  recordFailedSubmission,
} from '../controllers/validationController.js';

const router = Router();

// Apply failure tracker middleware to all routes in this router
router.use(recordFailedSubmission);

// Route: User Registration with Server-Side Validation
router.post('/register', registerValidationRules, handleValidationErrors, registerUser);

// Route: User Login with Server-Side Validation
router.post('/login', loginValidationRules, handleValidationErrors, loginUser);

// Route: Feedback & Ticket with Server-Side Validation
router.post('/feedback', feedbackValidationRules, handleValidationErrors, submitFeedback);

// Route: Query audit history of submissions
router.get('/submissions', getSubmissions);

// Route: Clear audit history
router.post('/clear-submissions', clearSubmissions);

// Route: Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    framework: 'ExpressJS',
    serverSideValidation: 'Active (express-validator v7)',
    timestamp: new Date().toISOString(),
  });
});

// Route: API Index / Info
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    framework: 'ExpressJS',
    description: 'Server-side validation service with express-validator',
    endpoints: {
      health: 'GET /api/health',
      register: 'POST /api/register',
      login: 'POST /api/login',
      feedback: 'POST /api/feedback',
      submissions: 'GET /api/submissions',
    },
  });
});

export default router;
