import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

let server;
let baseUrl;

test.before(async () => {
  return new Promise((resolve) => {
    // Start temporary test listener on free port
    const testServer = app.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://localhost:${port}`;
      server = testServer;
      resolve();
    });
  });
});

test.after(() => {
  if (server) {
    server.close();
  }
});

test('POST /api/register - Success: Valid Registration Payload', async () => {
  const payload = {
    fullName: 'Jane Doe',
    email: `jane.${Date.now()}@example.com`,
    username: `janedoe_${Date.now().toString().slice(-4)}`,
    password: 'SecurePassword123!@',
    confirmPassword: 'SecurePassword123!@',
    phone: '9876543210',
    dob: '1998-05-15',
    role: 'Fullstack Developer',
    terms: true,
  };

  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 201);
  assert.equal(data.success, true);
  assert.equal(data.user.fullName, 'Jane Doe');
  assert.equal(data.user.role, 'Fullstack Developer');
});

test('POST /api/register - Failure: Missing Required Fields', async () => {
  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  const data = await res.json();
  assert.equal(res.status, 422);
  assert.equal(data.success, false);
  assert.ok(data.errorCount >= 6, 'Should detect multiple missing field errors');
});

test('POST /api/register - Failure: Invalid Email and Password Mismatch', async () => {
  const payload = {
    fullName: 'Test User',
    email: 'invalid-email-format',
    username: 'validuser99',
    password: 'Password123!',
    confirmPassword: 'DifferentPassword123!',
    phone: '9876543210',
    dob: '2000-01-01',
    role: 'Frontend Engineer',
    terms: true,
  };

  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 422);
  assert.equal(data.success, false);

  const fieldsWithErrors = data.errors.map((e) => e.field);
  assert.ok(fieldsWithErrors.includes('email'), 'Should flag email error');
  assert.ok(fieldsWithErrors.includes('confirmPassword'), 'Should flag confirmPassword mismatch');
});

test('POST /api/register - Failure: Underage User (Under 18 Years)', async () => {
  const payload = {
    fullName: 'Young Student',
    email: 'young@student.org',
    username: 'youngster',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    phone: '9876543210',
    dob: '2020-01-01', // 6 years old
    role: 'Frontend Engineer',
    terms: true,
  };

  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 422);
  const dobError = data.errors.find((e) => e.field === 'dob');
  assert.ok(dobError, 'Should reject date of birth');
  assert.match(dobError.message, /Age requirement not met/);
});

test('POST /api/login - Success: Valid Login Credentials', async () => {
  const payload = {
    identifier: 'admin@portal.dev',
    password: 'SuperSecretPassword123!',
    rememberMe: true,
  };

  const res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.auth.token);
});

test('POST /api/login - Failure: Missing Password', async () => {
  const payload = {
    identifier: 'admin@portal.dev',
    password: '',
  };

  const res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 422);
  assert.equal(data.success, false);
});

test('POST /api/feedback - Success: Valid Support Ticket', async () => {
  const payload = {
    title: 'Input validation error on mobile safari',
    email: 'dev@test.org',
    category: 'Bug Report',
    priority: 'High',
    rating: 4,
    websiteUrl: 'https://example.com/docs',
    comments: 'When submitting the form on iOS 17, the keyboard occasionally covers the submit button.',
  };

  const res = await fetch(`${baseUrl}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 201);
  assert.equal(data.success, true);
  assert.ok(data.ticket.ticketId.startsWith('TCK-'));
});

test('POST /api/feedback - Failure: Invalid Rating and Comments Too Short', async () => {
  const payload = {
    title: 'Bug',
    email: 'test@example.com',
    category: 'Bug Report',
    priority: 'High',
    rating: 10, // Max is 5
    comments: 'Too short', // Min is 20
  };

  const res = await fetch(`${baseUrl}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  assert.equal(res.status, 422);
  const fields = data.errors.map((e) => e.field);
  assert.ok(fields.includes('rating'));
  assert.ok(fields.includes('comments'));
});

test('POST /api/register - Failure: Malformed JSON Payload (400)', async () => {
  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ invalid_json_syntax: true, ',
  });

  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.errorType, 'MalformedJSONError');
});
