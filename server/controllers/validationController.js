// In-memory logs of submissions for audit and demonstration
const submissionHistory = [];
const MAX_LOGS = 30;

function logSubmission(entry) {
  submissionHistory.unshift({
    id: 'req_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toLocaleTimeString(),
    fullTimestamp: new Date().toISOString(),
    ...entry,
  });
  if (submissionHistory.length > MAX_LOGS) {
    submissionHistory.pop();
  }
}

export const registerUser = (req, res) => {
  const { fullName, email, username, phone, dob, role } = req.body;

  const responsePayload = {
    success: true,
    statusCode: 201,
    message: 'User registration validated and created successfully!',
    user: {
      fullName,
      email,
      username,
      phone,
      dob,
      role,
      status: 'Active',
      registeredAt: new Date().toISOString(),
    },
    meta: {
      serverValidation: 'Passed all 8 validation constraints',
      sanitizationApplied: ['email normalized', 'fullName trimmed & escaped', 'username sanitized'],
    },
  };

  logSubmission({
    endpoint: '/api/register',
    method: 'POST',
    status: 201,
    statusText: 'Created',
    summary: `Registered user: ${username} (${email})`,
    clientPayload: { fullName, email, username, role },
  });

  return res.status(201).json(responsePayload);
};

export const loginUser = (req, res) => {
  const { identifier, rememberMe } = req.body;

  const responsePayload = {
    success: true,
    statusCode: 200,
    message: 'Authentication credentials validated successfully.',
    auth: {
      identifier,
      rememberMe: Boolean(rememberMe),
      token: 'jwt_sim_' + Buffer.from(identifier + Date.now()).toString('base64'),
      expiresIn: rememberMe ? '30d' : '24h',
    },
  };

  logSubmission({
    endpoint: '/api/login',
    method: 'POST',
    status: 200,
    statusText: 'OK',
    summary: `Login verified for: ${identifier}`,
    clientPayload: { identifier, rememberMe },
  });

  return res.status(200).json(responsePayload);
};

export const submitFeedback = (req, res) => {
  const { title, email, category, priority, rating, websiteUrl, comments } = req.body;

  const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);

  const responsePayload = {
    success: true,
    statusCode: 201,
    message: `Support ticket #${ticketId} submitted and validated successfully.`,
    ticket: {
      ticketId,
      title,
      email,
      category,
      priority,
      rating: Number(rating),
      websiteUrl: websiteUrl || null,
      comments,
      createdAt: new Date().toISOString(),
    },
    sanitizationNotice: 'Comments string was HTML-entity escaped to prevent Cross-Site Scripting (XSS).',
  };

  logSubmission({
    endpoint: '/api/feedback',
    method: 'POST',
    status: 201,
    statusText: 'Created',
    summary: `Ticket #${ticketId} (${category} - ${priority})`,
    clientPayload: { title, email, category, priority, rating },
  });

  return res.status(201).json(responsePayload);
};

export const getSubmissions = (req, res) => {
  return res.status(200).json({
    success: true,
    count: submissionHistory.length,
    submissions: submissionHistory,
  });
};

export const clearSubmissions = (req, res) => {
  submissionHistory.length = 0;
  return res.status(200).json({
    success: true,
    message: 'Submission log cleared successfully.',
  });
};

// Logging middleware for invalid attempts
export const recordFailedSubmission = (req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    if (res.statusCode >= 400) {
      logSubmission({
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        statusText: res.statusCode === 422 ? 'Unprocessable Entity' : 'Bad Request',
        summary: data.message || 'Validation Failed',
        errors: data.errors || [],
        clientPayload: req.body,
      });
    }
    return oldJson.apply(res, arguments);
  };
  next();
};
