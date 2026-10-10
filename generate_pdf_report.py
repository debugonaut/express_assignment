import os
import weasyprint
import pypdf

current_dir = os.path.dirname(os.path.abspath(__file__))

img1 = os.path.join(current_dir, "screenshot_1_overview.png")
img2 = os.path.join(current_dir, "screenshot_2_invalid.png")
img3 = os.path.join(current_dir, "screenshot_3_valid.png")
img4 = os.path.join(current_dir, "screenshot_4_feedback.png")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Practical 2: Server-Side Validation using ExpressJS</title>
  <style>
    @page {{
      size: letter;
      margin: 0.65in 0.75in 0.65in 0.75in;
    }}

    body {{
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #0f172a;
      margin: 0;
      padding: 0;
    }}

    .header-meta {{
      margin-bottom: 14pt;
      font-size: 10.5pt;
      line-height: 1.35;
    }}

    .practical-title {{
      font-size: 12.5pt;
      font-weight: bold;
      text-decoration: underline;
      margin-top: 6pt;
      margin-bottom: 12pt;
      line-height: 1.35;
    }}

    .links {{
      margin-bottom: 12pt;
      font-size: 10pt;
    }}

    .links a {{
      color: #2563eb;
      text-decoration: underline;
    }}

    .section-title {{
      font-weight: bold;
      font-size: 11pt;
      margin-top: 10pt;
      margin-bottom: 5pt;
    }}

    .aim {{
      margin-bottom: 10pt;
      text-align: justify;
    }}

    ul {{
      margin-top: 3pt;
      margin-bottom: 8pt;
      padding-left: 18pt;
    }}

    li {{
      margin-bottom: 4pt;
      text-align: justify;
    }}

    .sub-theory {{
      margin-top: 8pt;
      margin-bottom: 6pt;
    }}

    .sub-theory-title {{
      font-weight: bold;
      margin-bottom: 3pt;
    }}

    .page-break {{
      page-break-before: always;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 8pt;
      margin-bottom: 10pt;
      font-size: 8.5pt;
      background-color: #ffffff;
    }}

    th {{
      background-color: #1e293b;
      color: #f8fafc;
      font-weight: bold;
      text-align: left;
      padding: 5pt 7pt;
      border: 1px solid #334155;
    }}

    td {{
      padding: 4.5pt 7pt;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      line-height: 1.3;
    }}

    tr:nth-child(even) td {{
      background-color: #f8fafc;
    }}

    .badge-code {{
      font-family: "Courier New", Courier, monospace;
      font-size: 7.5pt;
      background: #e2e8f0;
      padding: 1pt 3pt;
      border-radius: 2pt;
      color: #0f172a;
    }}

    .screenshot-card {{
      margin-bottom: 14pt;
      text-align: center;
    }}

    .screenshot-caption {{
      font-size: 8.5pt;
      font-weight: bold;
      color: #334155;
      margin-top: 4pt;
    }}

    .screenshot-img {{
      width: 100%;
      height: 250pt;
      object-fit: contain;
      border: 1px solid #cbd5e1;
      border-radius: 4pt;
      background-color: #090d16;
    }}

    .steps-list {{
      padding-left: 16pt;
      margin-top: 4pt;
      margin-bottom: 6pt;
    }}

    .steps-list > li {{
      font-weight: bold;
      margin-top: 6pt;
      margin-bottom: 3pt;
    }}

    .steps-list > li > ul {{
      font-weight: normal;
      margin-top: 2pt;
      margin-bottom: 4pt;
    }}
  </style>
</head>
<body>

  <!-- PAGE 1 -->
  <div class="header-meta">
    Name: Nupoor Deshpande<br>
    PRN: 202401100026<br>
    Div: A Batch A2
  </div>

  <div class="practical-title">
    Practical 2: Design, develop and deploy a web application to demonstrate server-side validation using ExpressJS.
  </div>

  <div class="links">
    Deployed Link: <a href="https://express-assignment-virid.vercel.app/">express-assignment</a><br>
    Github Repository for code: <a href="https://github.com/debugonaut/express_assignment">Codes</a>
  </div>

  <div class="aim">
    <strong>Aim:</strong> To design, develop, and deploy a modern Single Page Application (SPA) utilizing ExpressJS, 
    express-validator middleware, and the Shadcn UI design system to demonstrate comprehensive server-side input validation, 
    defensive error handling, data sanitization, and real-time request-response diagnostics.
  </div>

  <div class="section-title">Objectives:</div>
  <ul>
    <li>To implement server-side validation logic using ExpressJS and express-validator to ensure all incoming data conforms to strict structural, typing, and semantic constraints.</li>
    <li>To apply defensive sanitization principles including trimming whitespace, normalizing emails, and escaping HTML entities to neutralize Cross-Site Scripting (XSS).</li>
    <li>To utilize Shadcn UI component primitives (Cards, Forms, Inputs, Badges, Tabs, Alerts, and Toasts) with accessible aria-invalid error bindings for responsive design.</li>
    <li>To configure modular RESTful routes with precise HTTP status code semantics (200 OK, 201 Created, 400 Bad Request, 422 Unprocessable Entity).</li>
    <li>To build a real-time HTTP diagnostic console and audit log displaying live client-server execution details.</li>
    <li>To test the application thoroughly using valid, invalid, boundary, and malicious input scenarios.</li>
  </ul>

  <div class="section-title">Theory</div>
  
  <div class="sub-theory">
    <div class="sub-theory-title">1. Server-Side Validation Architecture & Defense-in-Depth:</div>
    <p style="margin: 0; text-align: justify;">
      Client-side validation provides immediate user feedback and improves ergonomics, but it runs on an untrusted environment that can be bypassed using tools like cURL, Postman, or disabled browser scripts. 
      Consequently, <strong>server-side validation serves as the authoritative security boundary</strong>. Under OWASP guidelines, 
      every payload crossing the network must undergo validation and sanitization prior to database persistence.
    </p>
  </div>

  <!-- PAGE 2 -->
  <div class="page-break"></div>

  <div class="sub-theory">
    <div class="sub-theory-title">2. ExpressJS Middleware Pipeline & Request Handling Lifecycle:</div>
    <p style="margin: 0 0 4pt 0; text-align: justify;">
      ExpressJS handles requests through an ordered pipeline of middleware functions. Payloads are parsed via 
      <code>express.json()</code> into <code>req.body</code>, after which declarative validation chains evaluate each field sequentially:
    </p>
    <ul>
      <li><strong>Sequential Middleware Execution:</strong> Validation chains run as route-level middleware prior to controller handlers.</li>
      <li><strong>Error Interception via <code>validationResult(req)</code>:</strong> Aggregates validation failures into a unified diagnostics set, terminating early with HTTP 422 Unprocessable Entity if errors exist.</li>
      <li><strong>Standardized Diagnostics:</strong> Returns clean JSON structures containing field names, values, and targeted correction advice.</li>
    </ul>
  </div>

  <div class="sub-theory">
    <div class="sub-theory-title">3. Input Sanitization, Cross-Field Rules & Status Codes:</div>
    <ul>
      <li><strong>Sanitization:</strong> <code>trim()</code> eliminates boundary whitespace, <code>normalizeEmail()</code> standardizes email formats, and <code>escape()</code> converts characters (<code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, <code>&quot;</code>) into HTML entities to mitigate XSS attacks.</li>
      <li><strong>Cross-Field & Semantic Logic:</strong> Custom validation checks match password confirmation against password, verify that calculated age from Date of Birth is ≥ 18, and query database uniqueness for registered users.</li>
      <li><strong>HTTP Status Semantics:</strong> Emits HTTP 201 on created entities, HTTP 422 on validation failures, and HTTP 400 on malformed JSON bodies.</li>
    </ul>
  </div>

  <div class="section-title">Express Features & Shadcn UI Components Used:</div>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Express / Shadcn Component</th>
        <th>Purpose & Implementation in Server Validation Portal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Express Router</strong><br><span class="badge-code">express.Router()</span></td>
        <td>Modular routing for registration, login, service tickets, and audit history endpoints.</td>
      </tr>
      <tr>
        <td><strong>Validation Chains</strong><br><span class="badge-code">body().isLength().isEmail()</span></td>
        <td>Declarative validation rules applied as sequential middleware on request parameters.</td>
      </tr>
      <tr>
        <td><strong>Error Collector</strong><br><span class="badge-code">validationResult(req)</span></td>
        <td>Extracts validation failures and returns formatted HTTP 422 diagnostic JSON payloads.</td>
      </tr>
      <tr>
        <td><strong>Sanitization Primitives</strong><br><span class="badge-code">trim(), escape(), normalizeEmail()</span></td>
        <td>Strips whitespace, normalizes casing, and escapes HTML characters to neutralize XSS vectors.</td>
      </tr>
      <tr>
        <td><strong>Shadcn Field Primitives</strong><br><span class="badge-code">FieldGroup, Field, FieldError</span></td>
        <td>Accessible form layout engine managing <span class="badge-code">data-invalid</span> and field-level error messages.</td>
      </tr>
      <tr>
        <td><strong>Semantic Form Controls</strong><br><span class="badge-code">Input, Select, Textarea</span></td>
        <td>Styled form inputs with accessible <span class="badge-code">aria-invalid</span> bindings and focus states.</td>
      </tr>
      <tr>
        <td><strong>Alert Callouts</strong><br><span class="badge-code">Alert, AlertTitle, AlertDescription</span></td>
        <td>Contextual alerts displaying server responses: green HTTP 201 on success and red HTTP 422 on validation errors.</td>
      </tr>
      <tr>
        <td><strong>Tabs Navigation</strong><br><span class="badge-code">Tabs, TabsList, TabsTrigger</span></td>
        <td>Segmented switching between Registration, Authentication, Ticket, and JSON Sandbox views.</td>
      </tr>
      <tr>
        <td><strong>HTTP Diagnostic Console</strong><br><span class="badge-code">Terminal, pre, code</span></td>
        <td>Live inspector displaying request payload, response status code, latency, and returned server JSON.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 3 -->
  <div class="page-break"></div>

  <div class="section-title">Procedure / Implementation Steps:</div>
  <ol class="steps-list">
    <li><strong>Project Setup & Dependency Configuration:</strong>
      <ul>
        <li>Create the modular fullstack project structure: <code>server/</code> for Express backend and <code>client/</code> for Vite React frontend.</li>
        <li>Configure dependencies: <code>express</code>, <code>express-validator</code>, <code>cors</code>, <code>morgan</code>, Tailwind CSS, Lucide icons, and Shadcn UI primitives.</li>
      </ul>
    </li>
    <li><strong>Configuring Express Server & Middleware Pipeline:</strong>
      <ul>
        <li>Implement <code>server/index.js</code> with <code>express.json()</code>, <code>express.urlencoded()</code>, CORS, and static client serving.</li>
        <li>Add global error middleware catching malformed JSON payloads and returning clean HTTP 400 Bad Request responses.</li>
      </ul>
    </li>
    <li><strong>Defining Server-Side Validation Chains & Sanitizers:</strong>
      <ul>
        <li>Create validation middleware in <code>server/middleware/validationRules.js</code> using express-validator.</li>
        <li>Implement constraints for Full Name (alpha & spaces, 3-50 chars), Username (alphanumeric, no leading digits), and RFC Email format.</li>
        <li>Enforce password complexity (min 8 chars, uppercase, lowercase, digit, special character).</li>
        <li>Implement custom validators for password matching (<code>confirmPassword === password</code>) and chronological age verification (<code>age ≥ 18</code> from DOB).</li>
      </ul>
    </li>
    <li><strong>Building Controller Handlers & Audit Trail:</strong>
      <ul>
        <li>Develop route controllers in <code>validationController.js</code> returning structured JSON entities upon validation success.</li>
        <li>Implement an in-memory ring-buffer audit logger capturing every request timestamp, route, HTTP status code, and validation summary.</li>
      </ul>
    </li>
    <li><strong>Designing Accessible UI with Shadcn Component Primitives:</strong>
      <ul>
        <li>Build form components using Shadcn patterns: <code>FieldGroup</code>, <code>Field</code>, <code>FieldLabel</code>, <code>Input</code>, <code>Select</code>, <code>Textarea</code>, <code>Alert</code>, and <code>Badge</code>.</li>
        <li>Bind server-side validation error indicators directly to form inputs using <code>aria-invalid</code> and <code>data-invalid</code> tokens.</li>
        <li>Incorporate quick-fill preset buttons enabling instantaneous loading of valid, weak-password, underage, and duplicate-email test fixtures.</li>
      </ul>
    </li>
  </ol>

  <!-- PAGE 4 -->
  <div class="page-break"></div>

  <ol class="steps-list" start="6">
    <li><strong>Connecting Asynchronous Client-Server Lifecycle & Diagnostics:</strong>
      <ul>
        <li>Dispatch asynchronous Fetch API POST requests with JSON payloads to the Express API endpoints.</li>
        <li>Build the Live HTTP Inspector displaying real-time target route, request payload, response status code, latency, and returned validation array.</li>
      </ul>
    </li>
    <li><strong>Automated Testing & Verification Suite:</strong>
      <ul>
        <li>Develop automated test suite (<code>server/tests/validation.test.js</code>) using Node's native test runner to assert all 9 test scenarios.</li>
      </ul>
    </li>
  </ol>

  <div class="section-title">Validation Test Matrix & Verification Results:</div>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">Test #</th>
        <th style="width: 20%;">Endpoint</th>
        <th style="width: 28%;">Test Input Scenario</th>
        <th style="width: 14%;">HTTP Status</th>
        <th>Actual Server Response & Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TC-01</strong></td>
        <td><code>POST /api/register</code></td>
        <td>All fields correctly filled, age ≥ 18, strong password</td>
        <td><strong style="color: #16a34a;">201 Created</strong></td>
        <td>Server validated all 8 constraints; returned sanitized user entity and active status.</td>
      </tr>
      <tr>
        <td><strong>TC-02</strong></td>
        <td><code>POST /api/register</code></td>
        <td>Empty payload: <code>{{}}</code></td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; returned structured array with 6+ field diagnostics; highlighted inputs red.</td>
      </tr>
      <tr>
        <td><strong>TC-03</strong></td>
        <td><code>POST /api/register</code></td>
        <td>Email: <code>not-an-email</code>, Password mismatch</td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; flagged invalid email format and <em>"Passwords do not match"</em> error.</td>
      </tr>
      <tr>
        <td><strong>TC-04</strong></td>
        <td><code>POST /api/register</code></td>
        <td>DOB: <code>2021-08-10</code> (Calculated age: 5 years)</td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; <em>"Age requirement not met: You must be at least 18 years old"</em>.</td>
      </tr>
      <tr>
        <td><strong>TC-05</strong></td>
        <td><code>POST /api/register</code></td>
        <td>Email: <code>admin@portal.dev</code> (Existing)</td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; simulated database uniqueness check detected collision.</td>
      </tr>
      <tr>
        <td><strong>TC-06</strong></td>
        <td><code>POST /api/login</code></td>
        <td>Valid identifier and 8+ char password</td>
        <td><strong style="color: #16a34a;">200 OK</strong></td>
        <td>Success; verified credentials and generated signed session token.</td>
      </tr>
      <tr>
        <td><strong>TC-07</strong></td>
        <td><code>POST /api/login</code></td>
        <td>Missing password parameter</td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; <em>"Password cannot be empty (min 6 characters)"</em> error emitted.</td>
      </tr>
      <tr>
        <td><strong>TC-08</strong></td>
        <td><code>POST /api/feedback</code></td>
        <td>Rating: 10 (exceeds max 5), Comments &lt; 20 chars</td>
        <td><strong style="color: #d97706;">422 Unprocessable</strong></td>
        <td>Rejected; bounds validation caught rating and minimum length violation.</td>
      </tr>
      <tr>
        <td><strong>TC-09</strong></td>
        <td><code>POST /api/register</code></td>
        <td>Malformed JSON: <code>{{ "syntax": err, </code></td>
        <td><strong style="color: #dc2626;">400 Bad Request</strong></td>
        <td>Caught by Express error middleware; returned JSON <em>"Malformed JSON payload"</em>.</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title" style="margin-top: 14pt;">Output Screenshot:</div>

  <!-- PAGE 5 -->
  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="{img1}" class="screenshot-img" alt="Overview Initial State">
    <div class="screenshot-caption">Figure 1: Express Server-Side Validation Portal Interface (Initial State & Shadcn Design System)</div>
  </div>

  <div class="screenshot-card">
    <img src="{img2}" class="screenshot-img" alt="Validation Errors State">
    <div class="screenshot-caption">Figure 2: Server-Side Validation Failure (HTTP 422 Unprocessable Entity with Field-Level Diagnostics)</div>
  </div>

  <!-- PAGE 6 -->
  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="{img3}" class="screenshot-img" alt="Registration Success State">
    <div class="screenshot-caption">Figure 3: Server-Side Validation Success (HTTP 201 Created with Sanitized Entity & Real-Time Audit Log)</div>
  </div>

  <div class="screenshot-card">
    <img src="{img4}" class="screenshot-img" alt="Service Ticket State">
    <div class="screenshot-caption">Figure 4: Service Ticket & Feedback Schema (Enforcing XSS HTML Escaping, URL Validation & Rating Bounds)</div>
  </div>

</body>
</html>
"""

output_pdf = os.path.join(current_dir, "202401100026_WT_practical2.pdf")
print("Compiling PDF with WeasyPrint...")
weasyprint.HTML(string=html_content).write_pdf(output_pdf)

reader = pypdf.PdfReader(output_pdf)
print(f"Successfully generated: {output_pdf} (Total Pages: {len(reader.pages)})")
