require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/database');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);


/**
 * Prompt template generator
 * Keep prompt explicit so AI returns reliable JSON.
 */
function makePrompt(code, filename = "code.js") {
  return `
You are an expert application security auditor and code reviewer.
Analyze the following code from a security perspective. Focus on:
- Business logic flaws
- API vulnerabilities
- Broken authentication / authorization
- Injection or input validation issues

Respond ONLY with valid JSON (no surrounding text) with the shape:
{
  "vulnerabilities": [
    {
      "title": "Short title",
      "description": "Explain the issue and where it is in the code (line/context).",
      "severity": "High|Medium|Low",
      "location": { "filename": "${filename}", "snippet": "..." }
    }
  ],
  "fixes": [
    {
      "original_code": "...",
      "patched_code": "...",
      "explanation": "Why this fix works and risk tradeoffs."
    }
  ]
}

Here is the file: 
\`\`\`javascript
${code}
\`\`\`

Make results concise and focused.
`;
}

/**
 * /scan endpoint
 * Body: { code: string, filename?: string }
 */

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Corgea-lite backend listening on ${port}`));
