# Practical 2: Design, develop and deploy a web application to demonstrate server-side validation using ExpressJS.

**Name:** Nupoor Deshpande  
**PRN:** 202401100026  
**Div:** A **Batch:** A2  

**Deployed Link:** [express-assignment-virid.vercel.app](https://express-assignment-virid.vercel.app/)  
**Github Repository for code:** [https://github.com/debugonaut/express_assignment](https://github.com/debugonaut/express_assignment)  

---

## Aim
To design, develop, and deploy a modern, responsive Single Page Application (SPA) utilizing ExpressJS, express-validator middleware, RESTful API architecture, and the Shadcn UI design system to demonstrate comprehensive server-side input validation, sanitization, defensive error handling, and real-time request-response diagnostics.

---

## Objectives
- To implement server-side validation logic using ExpressJS and express-validator to ensure all incoming data conforms to strict structural, typing, and semantic constraints before processing.
- To design and configure structured RESTful routes (`/api/register`, `/api/login`, `/api/feedback`, `/api/submissions`, `/api/health`) for modular request and response lifecycle management.
- To implement comprehensive defense-in-depth sanitization routines (normalizing emails, trimming whitespace, and escaping HTML entities) to prevent Cross-Site Scripting (XSS) and injection vectors.
- To construct an accessible, interactive user interface utilizing the Shadcn UI design system (Cards, Forms, Inputs, Badges, Tabs, Alerts, Toasts, Separators) with real-time feedback.
- To provide precise HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `422 Unprocessable Entity`, `500 Internal Error`) and structured error arrays mapped directly to form fields via `aria-invalid` and `data-invalid`.
- To systematically test the application across an exhaustive validation test matrix comprising valid datasets, boundary conditions, malformed JSON, and edge-case inputs.

---

## Theory

### 1. Server-Side Validation Architecture & Defense-in-Depth
In client-server architectures, client-side validation serves primarily as a user-experience (UX) convenience by providing instantaneous feedback. However, client-side controls can be easily bypassed using automated API clients (e.g., Postman, cURL) or by disabling browser JavaScript. Consequently, **server-side validation is mandatory as the authoritative security boundary** in web engineering. Under the OWASP defense-in-depth framework, every payload crossing the network threshold must be strictly validated before processing or persisting.

### 2. ExpressJS Middleware Pipeline & Request Handling Lifecycle
ExpressJS executes an interceptor pipeline of middleware functions that process requests in sequential order. Incoming payloads are first parsed using `express.json()` and `express.urlencoded()` to populate `req.body`. Subsequent validation middleware chains inspect each field declaratively before forwarding control to controller handlers:
- **Sequential Middleware Execution:** Validation chains function as route-level middleware executed prior to controller business logic.
- **Error Extraction with `validationResult(req)`:** Gathers all errors from preceding validator chains. If non-empty, the pipeline terminates immediately with HTTP 422.
- **Decoupled Error Formatter:** Returns standardized JSON structures containing field names, invalid input values, and specific diagnostic remediation messages.

### 3. Input Sanitization, Cross-Field Validation & HTTP Status Codes
- **Sanitization & Defensive Transformation:** Sanitization modifies untrusted input into a safe format. `trim()` strips malicious leading/trailing whitespace; `normalizeEmail()` standardizes domain and alias variations; and `escape()` converts characters like `<`, `>`, `&`, `"`, `'` into HTML entities, neutralizing XSS attacks.
- **Custom Cross-Field & Asynchronous Logic:** Complex business rules such as verifying that `password === confirmPassword`, calculating chronological age from Date of Birth (requiring age ≥ 18), and detecting database uniqueness collisions are implemented via `.custom()` validator functions.
- **RESTful Status Semantics:** The server responds with **HTTP 201 Created** upon valid entity generation, **HTTP 422 Unprocessable Entity** when semantic validation fails, and **HTTP 400 Bad Request** when payload JSON syntax is malformed.

---

## Express Features & Shadcn UI Components Used

| Express / Shadcn Component | Purpose & Implementation in Server Validation Portal |
| :--- | :--- |
| **Express Router** (`Router()`, `app.use('/api')`) | Modular route separation for user registration, authentication, support tickets, audit logs, and health endpoints. |
| **Validator Chains** (`body('field').isLength().isEmail()`) | Declarative validation rules applied as sequential middleware on request body parameters. |
| **Error Collector** (`validationResult(req)`) | Intercepts validation failures, formats diagnostic error objects, and emits HTTP 422 Unprocessable Entity responses. |
| **Sanitization Middleware** (`trim()`, `escape()`, `normalizeEmail()`) | Transforms untrusted inputs, strips whitespace, and escapes dangerous HTML characters to prevent XSS. |
| **Shadcn Field Primitives** (`FieldGroup`, `Field`, `FieldError`) | Accessible form layout engine managing `data-invalid` states and field-level error messages. |
| **Input & Control Wrapper** (`Input`, `Select`, `Textarea`) | Semantic form controls with accessible `aria-invalid` bindings and dynamic focus styling. |
| **Alert Callouts** (`Alert`, `AlertTitle`, `AlertDescription`) | Prominent status callouts displaying server feedback: green HTTP 201 on success and red HTTP 422 on validation errors. |
| **Tabs Navigation** (`Tabs`, `TabsList`, `TabsTrigger`) | Seamless switching between Registration, Authentication, Service Ticket, and Raw JSON Sandbox views. |
| **HTTP Diagnostic Console** (`Terminal`, `pre`, `code`) | Live inspector displaying raw HTTP method, status codes, latency, client request body, and server response JSON. |

---

## Procedure / Implementation Steps

1. **Project Initialization & Dependency Configuration:**
   - Initialize dual-tier architecture containing Express.js server and Vite React frontend.
   - Install core backend dependencies: `express`, `express-validator`, `cors`, and `morgan`.
   - Configure Tailwind CSS, Lucide icons, and Shadcn UI component primitives in the client.

2. **Building Express Server & Middleware Pipeline:**
   - Create the main Express server (`server/index.js`) configured with JSON body parsing and CORS headers.
   - Implement global error middleware intercepting malformed JSON payloads and responding with HTTP 400 Bad Request.
   - Mount static asset routing to serve production frontend builds directly from Express.

3. **Defining Server-Side Validation Chains & Sanitizers:**
   - Construct modular validation middleware in `server/middleware/validationRules.js` using `express-validator`.
   - Define constraints for Full Name (alpha & spaces, 3-50 chars), Username (alphanumeric, no leading digits), and RFC Email format.
   - Enforce password complexity rules (min 8 chars, uppercase, lowercase, digit, and special symbol).
   - Build custom validators for password matching (`confirmPassword === password`) and chronological age verification (`age ≥ 18` from DOB).

4. **Implementing Controller Logic & Real-time Audit Logger:**
   - Develop route controllers in `validationController.js` returning structured JSON entities upon validation success.
   - Engineer an in-memory ring-buffer audit logger capturing every request timestamp, route, HTTP status code, and validation summary.

5. **Designing the UI using Shadcn Component Primitives:**
   - Construct form layouts adhering to Shadcn rules: `FieldGroup`, `Field`, `FieldLabel`, and `FieldError`.
   - Bind server-side validation error indicators directly to form inputs using `aria-invalid` and `data-invalid` tokens.
   - Incorporate quick-fill preset buttons enabling instantaneous loading of valid, weak-password, underage, and duplicate-email test fixtures.

6. **Connecting Asynchronous Client-Server Lifecycle & Diagnostics:**
   - Dispatch asynchronous Fetch API POST requests with JSON payloads to the Express API endpoints.
   - Build the Live HTTP Inspector displaying real-time target route, request payload, response status code, latency, and returned validation array.

7. **Automated Testing & Edge-Case Verification:**
   - Develop automated test suite (`server/tests/validation.test.js`) using Node's native test runner to assert all 9 test scenarios.

---

## Validation Test Matrix & Verification Results

| Test # | Endpoint | Test Input Scenario | Expected Outcome / Rule | HTTP Status | Actual Server Response & Behavior |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **TC-01** | `POST /api/register` | All fields correctly filled, age ≥ 18, strong password | Full validation pass, user created | **201 Created** | Server validated all 8 constraints; returned sanitized user entity and active status. |
| **TC-02** | `POST /api/register` | Empty payload: `{}` | Reject all required fields | **422 Unprocessable** | Rejected; returned structured array with 6+ field diagnostics; highlighted inputs red. |
| **TC-03** | `POST /api/register` | Email: `not-an-email`, Password mismatch | Flag email & confirmPassword | **422 Unprocessable** | Rejected; flagged invalid email format and *"Passwords do not match"* error. |
| **TC-04** | `POST /api/register` | DOB: `2021-08-10` (Calculated age: 5 years) | Reject underage applicant | **422 Unprocessable** | Rejected; *"Age requirement not met: You must be at least 18 years old"*. |
| **TC-05** | `POST /api/register` | Email: `admin@portal.dev` (Existing) | Duplicate email collision | **422 Unprocessable** | Rejected; simulated database uniqueness check detected collision. |
| **TC-06** | `POST /api/login` | Valid identifier and 8+ char password | Authenticate credentials | **200 OK** | Success; verified credentials and generated signed session token. |
| **TC-07** | `POST /api/login` | Missing password parameter | Reject empty password | **422 Unprocessable** | Rejected; *"Password cannot be empty (min 6 characters)"* error emitted. |
| **TC-08** | `POST /api/feedback` | Rating: 10 (exceeds max 5), Comments < 20 chars | Range & length boundary check | **422 Unprocessable** | Rejected; bounds validation caught rating and minimum length violation. |
| **TC-09** | `POST /api/register` | Malformed JSON: `{ "syntax": err, ` | Reject invalid JSON syntax | **400 Bad Request** | Caught by Express error middleware; returned JSON *"Malformed JSON payload"*. |

---

## Output Screenshots
- **Figure 1:** Express Server-Side Validation Portal Interface (Initial State & Shadcn Design System)
- **Figure 2:** Server-Side Validation Failure (HTTP 422 Unprocessable Entity with Field-Level Diagnostics)
- **Figure 3:** Server-Side Validation Success (HTTP 201 Created with Sanitized Entity & Real-Time Audit Log)
- **Figure 4:** Service Ticket & Feedback Schema (Enforcing XSS HTML Escaping, URL Validation & Rating Bounds)

*(Full screenshots formatted and embedded directly in [202401100026_WT_practical2.pdf](file:///Users/aadeshkhande/Documents/Professional/College/WEB%20Tech/Nupoor/202401100026_WT_practical2.pdf))*.
