# 🤝 Contributing to Corgea

Thank you for your interest in contributing to Corgea! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- Git
- A Google Gemini API key

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/corgea.git
   cd corgea
   ```

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup
Create the necessary environment files:

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corgea_auth
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
PORT=4000
```

**Frontend (.env.local):**
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database Setup
```bash
cd Backend
npm run init-db
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📝 Contributing Guidelines

### Types of Contributions
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🧪 Test additions
- 🎨 UI/UX improvements
- 🔧 Performance optimizations

### Code Style Guidelines

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use async/await instead of Promises when possible

#### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use TypeScript interfaces for props
- Implement proper error boundaries

#### Database
- Use parameterized queries to prevent SQL injection
- Add proper indexes for performance
- Include migration scripts for schema changes

### Commit Message Format
Use conventional commits format:
```
type(scope): description

feat(auth): add password reset functionality
fix(api): resolve database connection timeout
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🔄 Pull Request Process

### Before Submitting
1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Add tests** for new functionality

4. **Update documentation** if needed

5. **Test thoroughly**:
   ```bash
   # Backend tests
   cd Backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Submitting the PR
1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Wait for review** and address feedback

### PR Requirements
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Screenshots included for UI changes

## 🐛 Issue Reporting

### Before Creating an Issue
1. Check existing issues to avoid duplicates
2. Search closed issues for solutions
3. Ensure you're using the latest version

### Issue Template
When creating an issue, please include:

**Bug Reports:**
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

**Feature Requests:**
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Additional context

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### Test Coverage
- Aim for >80% test coverage
- Test both success and error cases
- Include integration tests for API endpoints
- Test authentication flows

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Include examples in complex functions
- Document API endpoints
- Update README for new features

### API Documentation
- Update API documentation for new endpoints
- Include request/response examples
- Document error codes and messages

## 🔧 Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- PostgreSQL
- GitLens

### Debugging
- Use browser dev tools for frontend debugging
- Use VS Code debugger for backend
- Check browser console for errors
- Use PostgreSQL logs for database issues

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Create an issue for bugs or feature requests
- 📧 **Email**: Contact maintainers directly for sensitive issues

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Corgea! 🚀
