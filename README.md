# 🚀 Test Automation Framework

A comprehensive, cross-platform test automation framework built with CodeceptJS, supporting BDD (Behavior Driven Development), API testing, and web UI automation.

![Framework Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Mac%20%7C%20Linux-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [Tag-Based Test Execution](#-tag-based-test-execution)
- [Windows Users](#-windows-users)
- [Framework Features](#-framework-features)
- [Writing Tests](#-writing-tests)
- [Configuration](#-configuration)
- [CI/CD Integration](#-cicd-integration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation
```bash
# Clone the repository
git clone https://github.com/sreevsr/test-automation-framework.git
cd test-automation-framework

# Install dependencies
npm install

# Run all tests
npm run test:all
```

### Verify Installation
```bash
# Quick validation (Windows)
QUICK_TEST.cmd

# Or use npm command
npm run test:all
```

## 🏷️ Tag-Based Test Execution

The framework supports comprehensive tag-based test filtering for targeted test execution.

### Available Tags

| Tag | Description | Use Case |
|-----|-------------|----------|
| `@smoke` | Quick basic functionality validation | CI/CD pipelines, quick checks |
| `@regression` | Comprehensive full test suite | Pre-release validation |
| `@api` | Backend/API endpoint testing | API development, integration |
| `@web` | Frontend/UI testing | UI development, browser testing |
| `@products` | Product-related functionality | E-commerce features |
| `@cart` | Shopping cart operations | Checkout flows |
| `@login` | Authentication and login flows | Security testing |
| `@security` | Security and authorization tests | Security audits |
| `@performance` | Performance and load testing | Performance optimization |

### Execution Methods

#### 1. 📱 **Interactive Menu (Windows)**
```cmd
TAG_MENU.cmd
```
**Features:**
- Visual menu with numbered options
- Descriptions for each test type
- Automatic execution of selected tests
- Perfect for non-technical users

#### 2. 🖥️ **Command Line Scripts**
```bash
# Individual test types
npm run test:tag:smoke        # Smoke tests
npm run test:tag:regression   # Full regression suite
npm run test:tag:api          # API tests only
npm run test:tag:web          # Web UI tests only
npm run test:tag:products     # Product functionality
npm run test:tag:cart         # Shopping cart features
npm run test:tag:login        # Authentication flows
npm run test:tag:security     # Security testing
npm run test:tag:performance  # Performance tests

# Smart tag runner with interactive selection
npm run test:by-tag
npm run test:by-tag smoke
npm run test:by-tag regression
```

#### 3. 🖱️ **Windows Batch Scripts (Double-click)**
```
SMOKE_TESTS.cmd       # Quick smoke validation
REGRESSION_TESTS.cmd  # Full test suite
API_TESTS.cmd         # API endpoint testing
WEB_TESTS.cmd         # Web UI testing
TAG_MENU.cmd          # Interactive selection menu
QUICK_TEST.cmd        # All tests without filtering
```

#### 4. 🔧 **Direct CodeceptJS Commands**
```bash
# Most reliable method - works on all platforms
npx codeceptjs run --config codecept.final.conf.js --grep smoke
npx codeceptjs run --config codecept.final.conf.js --grep regression
npx codeceptjs run --config codecept.final.conf.js --grep api
npx codeceptjs run --config codecept.final.conf.js --grep web

# Run all tests without filtering
npx codeceptjs run --config codecept.final.conf.js
```

### Tag Combinations
```bash
# Multiple tags (API + Smoke)
npx codeceptjs run --config codecept.final.conf.js --grep "api.*smoke|smoke.*api"

# Exclude tags (All except performance)
npx codeceptjs run --config codecept.final.conf.js --grep "^(?!.*performance).*"
```

## 🪟 Windows Users

### Automated Setup
```cmd
# Pull latest updates
git pull origin main

# Automated Windows setup and validation
FINAL_WINDOWS_FIX.cmd
```

### Quick Commands
```cmd
QUICK_TEST.cmd          # Run all tests (most reliable)
SMOKE_TESTS.cmd         # Quick validation
TAG_MENU.cmd            # Interactive test selection
VALIDATE_SUCCESS.cmd    # Validate framework setup
```

### Troubleshooting
```cmd
npm run debug           # Comprehensive diagnostics
FINAL_WINDOWS_FIX.cmd   # Automated problem resolution
```

## ⭐ Framework Features

### 🎯 **BDD (Behavior Driven Development)**
- **Gherkin Syntax**: Write tests in plain English
- **Business Readable**: Non-technical stakeholders can understand tests
- **Example**:
```gherkin
@smoke @api
Scenario: Validate product catalog
  Given the API is available
  When I request all products
  Then I should receive a list of products
  And each product should have required fields
```

### 🔗 **API Testing**
- **REST API Support**: Full HTTP method support (GET, POST, PUT, DELETE)
- **Response Validation**: JSON schema validation and data verification
- **Authentication**: Token-based auth and session management
- **Error Handling**: Comprehensive error scenarios

### 🌐 **Web UI Testing**
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Page Object Model**: Maintainable UI test structure
- **Element Interactions**: Forms, buttons, navigation
- **Visual Testing**: Screenshot comparison

### 📱 **Mobile Testing**
- **Mobile Web**: Responsive design validation
- **Mobile App**: Native app testing capabilities
- **Device Emulation**: Various screen sizes and devices

### 🏗️ **Architecture**
- **Dependency Injection**: Modular, testable components
- **Factory Pattern**: Test data generation
- **Structured Logging**: Comprehensive test execution tracking
- **Error Handling**: Custom error classes with detailed context

## 📝 Writing Tests

### Creating BDD Feature Files

1. **Create a new feature file** in the `features/` directory:
```gherkin
# features/user_management.feature
Feature: User Management
  As an administrator
  I want to manage user accounts
  So that I can control system access

  @smoke @user
  Scenario: Create new user
    Given I am logged in as an administrator
    When I create a new user with email "test@example.com"
    Then the user should be created successfully
    And I should see the user in the user list

  @regression @user @security
  Scenario: User permissions validation
    Given I have a user with role "standard"
    When I try to access admin features
    Then I should be denied access
    And I should see an authorization error
```

2. **Implement step definitions** in `step_definitions/`:
```javascript
// step_definitions/user_steps.js
Given('I am logged in as an administrator', async () => {
  await userAPI.authenticate('admin@example.com', 'AdminPass123!');
});

When('I create a new user with email {string}', async (email) => {
  const userData = userFactory.create({ email });
  const response = await userAPI.createUser(userData);
  saveTestData('createdUser', response.data);
});

Then('the user should be created successfully', async () => {
  const user = getTestData('createdUser');
  assert(user.id, 'User should have an ID');
  assert(user.email, 'User should have an email');
});
```

### Adding New Tags

1. **Define the tag** in your feature file:
```gherkin
@my-new-feature @api
Scenario: My new functionality
  # ... test steps
```

2. **Add npm script** in `package.json`:
```json
"test:tag:my-new-feature": "npx codeceptjs run --config codecept.final.conf.js --grep my-new-feature"
```

3. **Create Windows batch script** (optional):
```cmd
# MY_NEW_FEATURE_TESTS.cmd
@echo off
echo Running My New Feature Tests...
npx codeceptjs run --config codecept.final.conf.js --grep my-new-feature
pause
```

4. **Update tag-runner.js** to include your new tag:
```javascript
const availableTags = {
  // ... existing tags
  'my-new-feature': 'Description of my new feature tests'
};
```

## ⚙️ Configuration

### Environment Variables
```bash
# API Configuration
API_URL=https://your-api.com
BASE_URL=https://your-app.com

# Test Configuration  
BROWSER=chromium
HEADLESS=true
LOG_LEVEL=info

# Authentication
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=TestPass123!
```

### Configuration Files
- `codecept.final.conf.js` - Production configuration (recommended)
- `codecept.simple.conf.js` - Simple API-only testing
- `codecept.bdd.conf.js` - Full BDD with all features
- `codecept.basic.conf.js` - Minimal dependencies

### Test Data Management
```javascript
// Using the factory pattern
const userFactory = new UserFactory();
const testUser = userFactory.create({
  role: 'admin',
  status: 'active'
});

// Environment-specific data
const testData = new TestDataFactory();
const scenario = testData.createScenario('login-flow', {
  user: { email: 'custom@example.com' }
});
```

## 🔄 CI/CD Integration

### GitHub Actions
The framework includes a pre-configured GitHub Actions workflow:

```yaml
# .github/workflows/test-automation.yml
name: Test Automation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:smoke
      - run: npm run test:regression
```

### Integration Commands
```bash
# CI-friendly commands
npm run test:smoke        # Quick validation
npm run test:regression   # Full test suite
npm run test:api          # API-only (no browser)
npm run test:headless     # Headless browser mode
```

### Docker Support
```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps
COPY . .
CMD ["npm", "run", "test:smoke"]
```

## 🔧 Troubleshooting

### Common Issues

#### Windows: "No tests found by pattern"
**Solution:**
```cmd
# Use pattern-free commands
QUICK_TEST.cmd
npm run test:all

# Or use direct CodeceptJS
npx codeceptjs run --config codecept.final.conf.js
```

#### Module Not Found Errors
**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Windows automated fix
FINAL_WINDOWS_FIX.cmd
```

#### Browser Not Starting
**Solution:**
```bash
# Install browsers
npx playwright install

# Use API-only tests as fallback
npm run test:tag:api
```

### Diagnostic Commands
```bash
npm run debug           # Comprehensive environment check
npm run run-tests       # Auto-tries multiple configurations
VALIDATE_SUCCESS.cmd    # Windows validation script
```

### Debug Mode
```bash
# Detailed execution logs
npx codeceptjs run --config codecept.final.conf.js --debug --grep smoke

# Step-by-step execution
npx codeceptjs run --config codecept.final.conf.js --steps --grep smoke
```

## 📊 Test Reports

### Viewing Results
```bash
# Generate reports
npm run report

# Open reports
npm run report:generate
```

### Output Structure
```
output/
├── logs/              # Execution logs
├── screenshots/       # Failure screenshots
├── videos/           # Test execution videos
└── allure-reports/   # Comprehensive test reports
```

## 🤝 Contributing

### Adding New Tests
1. **Create feature file** in `features/`
2. **Add step definitions** in `step_definitions/`
3. **Tag appropriately** for organization
4. **Test locally** before committing
5. **Update documentation** as needed

### Code Standards
- **BDD First**: Write scenarios in business language
- **Page Objects**: Use POM pattern for UI tests
- **Factory Pattern**: Generate test data systematically
- **Error Handling**: Use custom error classes
- **Documentation**: JSDoc for all functions

### Pull Request Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📚 Additional Resources

### Documentation
- [CodeceptJS Documentation](https://codecept.io/)
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/)
- [Playwright Documentation](https://playwright.dev/)

### Support
- 📁 **Issues**: [GitHub Issues](https://github.com/sreevsr/test-automation-framework/issues)
- 📖 **Wiki**: [Project Wiki](https://github.com/sreevsr/test-automation-framework/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/sreevsr/test-automation-framework/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🚀 Quick Command Reference

### Essential Commands
```bash
# Setup
npm install                    # Install dependencies
FINAL_WINDOWS_FIX.cmd         # Windows automated setup

# All Tests
npm run test:all              # All tests, no filtering
QUICK_TEST.cmd                # Windows: all tests

# Tag-Based Testing
npm run test:tag:smoke        # Smoke tests
npm run test:tag:regression   # Full regression
npm run test:tag:api          # API tests only
npm run test:by-tag           # Interactive tag selection

# Windows GUI
TAG_MENU.cmd                  # Interactive menu
SMOKE_TESTS.cmd               # Quick validation
REGRESSION_TESTS.cmd          # Full test suite

# Troubleshooting
npm run debug                 # Environment diagnostics
VALIDATE_SUCCESS.cmd          # Validate setup (Windows)
```

**🎉 Happy Testing! Your framework is ready for production use.**