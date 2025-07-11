# Windows Setup Guide

This guide helps you set up and run the test automation framework on Windows machines.

## Prerequisites

1. **Node.js** (v16 or higher): Download from [nodejs.org](https://nodejs.org/)
2. **Git**: Download from [git-scm.com](https://git-scm.com/)
3. **Visual Studio Code** (recommended): Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sreevsr/test-automation-framework.git
cd test-automation-framework
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install browser dependencies:**
```bash
npx playwright install
```

## Running Tests

### BDD/Gherkin Tests (Recommended)

The framework includes BDD tests written in Gherkin syntax. These are the tests tagged with `@smoke`, `@regression`, etc.

**Run smoke tests:**
```bash
npm run test:smoke
```

**Run all BDD tests:**
```bash
npm run test:bdd
```

**Run BDD API tests:**
```bash
npm run test:bdd:api
```

**Run BDD web tests:**
```bash
npm run test:bdd:web
```

### Traditional CodeceptJS Tests

**Run simple API tests:**
```bash
npm run test:simple:api
```

**Run all simple tests:**
```bash
npm run test:simple
```

## Troubleshooting

### "No tests were executed" Error

This usually happens when:

1. **Wrong configuration**: Make sure you're using the correct npm script
   - For BDD tests: `npm run test:smoke` or `npm run test:bdd:smoke`
   - For simple tests: `npm run test:simple:api`

2. **Missing dependencies**: Run the setup command
   ```bash
   npm run setup
   ```

3. **Browser issues**: Install browsers manually
   ```bash
   npx playwright install chromium
   ```

### Path Issues on Windows

If you get path-related errors:

1. **Use forward slashes** in any manual configurations
2. **Check PowerShell execution policy**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Environment Variables

Create a `.env` file in the project root:
```env
# API Configuration
API_URL=https://jsonplaceholder.typicode.com
BASE_URL=https://example.com

# Test Configuration
BROWSER=chromium
HEADLESS=false
LOG_LEVEL=info

# Windows-specific
NODE_ENV=development
```

### Debugging Tests

**Run tests with debug output:**
```bash
npm run test:debug
```

**Run tests with step-by-step output:**
```bash
npm run test:steps
```

**Run specific test by tag:**
```bash
npx codeceptjs run --config codecept.bdd.conf.js --grep "@smoke"
```

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:smoke` | Run smoke tests (BDD) |
| `npm run test:bdd` | Run all BDD tests |
| `npm run test:bdd:api` | Run BDD API tests |
| `npm run test:bdd:web` | Run BDD web tests |
| `npm run test:simple` | Run simple CodeceptJS tests |
| `npm run test:simple:api` | Run simple API tests |
| `npm run clean` | Clean output directory |
| `npm run report` | Generate test report |

## Test Structure

```
test-automation-framework/
├── features/           # BDD Gherkin feature files
│   ├── ecommerce_api.feature
│   └── login.feature
├── step_definitions/   # BDD step implementations
├── tests/             # Traditional CodeceptJS tests
├── pages/             # Page Object Models
├── api/               # API service classes
├── config/            # Configuration files
└── output/            # Test results and reports
```

## IDE Configuration

### Visual Studio Code Extensions

Install these extensions for better development experience:

1. **Cucumber (Gherkin) Full Support**
2. **CodeceptJS Snippets**
3. **Playwright Test for VSCode**
4. **Git History**

### VSCode Settings

Add to your `.vscode/settings.json`:
```json
{
  "files.associations": {
    "*.feature": "gherkin"
  },
  "editor.quickSuggestions": {
    "comments": false,
    "strings": true,
    "other": true
  }
}
```

## Common Issues and Solutions

### 1. Tests don't run
**Solution**: Use BDD configuration
```bash
npm run test:bdd:smoke
```

### 2. Browser doesn't start
**Solution**: Install browsers and check environment
```bash
npx playwright install
npm run test:simple:api  # API tests don't need browser
```

### 3. Permission errors
**Solution**: Run as administrator or check execution policy
```powershell
Set-ExecutionPolicy RemoteSigned
```

### 4. Network timeouts
**Solution**: Check internet connection and proxy settings
```bash
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

## Getting Help

1. Check the main [README.md](./README.md) for general information
2. Review test output in the `./output` directory
3. Enable debug mode for detailed logs:
   ```bash
   npm run test:bdd:smoke -- --debug
   ```

## Quick Start (Windows Command Prompt)

```cmd
# Clone and setup
git clone https://github.com/sreevsr/test-automation-framework.git
cd test-automation-framework
npm install
npx playwright install

# Run smoke tests
npm run test:smoke

# If that fails, try simple API tests
npm run test:simple:api
```

## Quick Start (PowerShell)

```powershell
# Clone and setup
git clone https://github.com/sreevsr/test-automation-framework.git
Set-Location test-automation-framework
npm install
npx playwright install

# Run smoke tests
npm run test:smoke

# View results
Get-ChildItem .\output\ -Recurse
```