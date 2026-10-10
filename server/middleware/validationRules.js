import { body, validationResult } from 'express-validator';

// Formatter to return standard JSON structure for validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      value: err.value,
      message: err.msg,
      location: err.location || 'body',
    }));

    return res.status(422).json({
      success: false,
      statusCode: 422,
      errorType: 'ValidationError',
      message: `Validation failed: ${formattedErrors.length} error(s) detected in user input.`,
      errorCount: formattedErrors.length,
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// Simulated in-memory database of registered users for uniqueness validation
const existingUsers = new Set(['admin@portal.dev', 'nupoor@college.edu', 'test@example.com']);
const existingUsernames = new Set(['admin', 'root', 'superuser', 'nupoord']);

// User Registration Validation Rules
export const registerValidationRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full Name is required.')
    .isLength({ min: 3, max: 50 }).withMessage('Full Name must be between 3 and 50 characters.')
    .matches(/^[A-Za-z\s]+$/).withMessage('Full Name can only contain alphabetic characters and spaces.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid email address (e.g. user@example.com).')
    .normalizeEmail()
    .custom((value) => {
      if (existingUsers.has(value.toLowerCase())) {
        throw new Error('This email address is already registered in our system.');
      }
      return true;
    }),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.')
    .custom((value) => {
      if (/^[0-9]/.test(value)) {
        throw new Error('Username cannot start with a numeric digit.');
      }
      if (existingUsernames.has(value.toLowerCase())) {
        throw new Error('This username is already taken. Please choose another.');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter (A-Z).')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter (a-z).')
    .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit (0-9).')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-]/).withMessage('Password must contain at least one special character (!@#$%^&*...).'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^(\+91[\-\s]?)?[6-9]\d{9}$/).withMessage('Enter a valid 10-digit phone number starting with 6-9 (optionally with +91).'),

  body('dob')
    .notEmpty().withMessage('Date of birth is required.')
    .isISO8601().withMessage('Date of birth must be a valid date in YYYY-MM-DD format.')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error(`Age requirement not met: You must be at least 18 years old (Calculated age: ${age}).`);
      }
      if (age > 120) {
        throw new Error('Please enter a realistic date of birth.');
      }
      return true;
    }),

  body('role')
    .notEmpty().withMessage('Please select a designation/role.')
    .isIn([
      'Fullstack Developer',
      'Frontend Engineer',
      'Backend Specialist',
      'DevOps Engineer',
      'UI/UX Designer',
      'QA & Automation Engineer',
    ]).withMessage('Selected role is not within the recognized catalog.'),

  body('terms')
    .custom((value) => {
      if (value !== true && value !== 'true') {
        throw new Error('You must accept the terms of service and privacy policy to continue.');
      }
      return true;
    }),
];

// User Login Validation Rules
export const loginValidationRules = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Username or Email is required.')
    .isLength({ min: 3 }).withMessage('Identifier must be at least 3 characters long.'),

  body('password')
    .notEmpty().withMessage('Password cannot be empty.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

// Feedback & Support Ticket Validation Rules
export const feedbackValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Ticket subject/title is required.')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Contact email is required.')
    .isEmail().withMessage('Please provide a valid email format.')
    .normalizeEmail(),

  body('category')
    .notEmpty().withMessage('Please select a feedback category.')
    .isIn([
      'Bug Report',
      'Feature Request',
      'API Documentation',
      'Security Concern',
      'Performance Issue',
      'General Inquiry',
    ]).withMessage('Category must be selected from the predefined list.'),

  body('priority')
    .notEmpty().withMessage('Priority level is required.')
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority selected.'),

  body('rating')
    .notEmpty().withMessage('Experience rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),

  body('websiteUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Website URL must start with http:// or https:// and be a valid domain.'),

  body('comments')
    .trim()
    .notEmpty().withMessage('Detailed comments are required.')
    .isLength({ min: 20, max: 500 }).withMessage('Comments must be between 20 and 500 characters long.')
    .escape(),
];
