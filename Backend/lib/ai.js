const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze code for security vulnerabilities using Google Gemini AI
 * @param {string} code - The code to analyze
 * @param {string} filename - The filename (optional)
 * @returns {Promise<Object>} Analysis results with vulnerabilities and fixes
 */
async function analyzeCode(code, filename = 'code.js') {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an expert application security auditor and code reviewer.
Analyze the following code from a security perspective. Focus on:
- Business logic flaws
- API vulnerabilities
- Broken authentication / authorization
- Injection or input validation issues
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Insecure direct object references
- Security misconfiguration
- Sensitive data exposure

Respond ONLY with valid JSON (no surrounding text, no markdown code blocks) with the shape:
{
  "vulnerabilities": [
    {
      "title": "Short descriptive title",
      "description": "Detailed explanation of the issue and where it is in the code (line/context).",
      "severity": "Critical|High|Medium|Low",
      "line": "line number or range",
      "startingLine:"line number",
      "endingLine:"line number"
    }
  ],
  "fixes": [
    {
      "line": "line number or range",
      "suggestion": "Detailed fix suggestion with code examples and explanation of why this fix works."
    }
  ]
}

Here is the file: 
\`\`\`javascript
${code}
\`\`\`

Make results concise and focused. Only include real security issues, not style or best practice suggestions.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up the response - remove markdown code blocks if present
        if (text.includes('```json')) {
            text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }
        if (text.includes('```')) {
            text = text.replace(/```\n?/g, '');
        }

        // Parse the JSON response
        const analysis = JSON.parse(text);

        // Validate the response structure
        if (!analysis.vulnerabilities || !Array.isArray(analysis.vulnerabilities)) {
            throw new Error('Invalid AI response: missing vulnerabilities array');
        }

        if (!analysis.fixes || !Array.isArray(analysis.fixes)) {
            analysis.fixes = [];
        }

        return analysis;

    } catch (error) {
        console.error('AI analysis error:', error);
        
        // If it's a JSON parsing error, return a structured error
        if (error.message.includes('JSON')) {
            throw new Error(`AI response parsing failed: ${error.message}`);
        }
        
        // For other errors, re-throw with context
        throw new Error(`AI analysis failed: ${error.message}`);
    }
}

module.exports = {
    analyzeCode
};

