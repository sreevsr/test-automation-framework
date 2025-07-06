# 🚀 Comprehensive Test Automation Framework

A production-ready CodeceptJS framework supporting **Web UI**, **API**, **Mobile Web**, and **Mobile App** test automation with BDD support.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 🎯 **Multi-Platform Support**
- **Web UI Testing**: Playwright-powered cross-browser testing
- **API Testing**: REST API validation and performance testing
- **Mobile Web Testing**: Responsive design and mobile browser testing
- **Mobile App Testing**: Native Android/iOS app automation with Appium

### 🧪 **Testing Capabilities**
- **BDD Support**: Gherkin feature files with plain English scenarios
- **Page Object Model**: Maintainable and reusable page objects
- **Data-Driven Testing**: CSV, JSON, and dynamic test data generation
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge support
- **Parallel Execution**: Faster test execution with configurable parallelism

### 📊 **Reporting & CI/CD**
- **Allure Reports**: Beautiful, interactive test reports
- **GitHub Actions**: Automated CI/CD pipeline
- **Screenshot/Video**: Failure evidence capture
- **Performance Metrics**: Load time and response time tracking

### 🛡️ **Quality & Maintenance**
- **Custom Helpers**: Enhanced assertions and utilities
- **Database Integration**: Test data setup and validation
- **Environment Management**: Multi-environment configuration
- **Error Handling**: Retry mechanisms and failure recovery

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Java 11+ (for mobile testing)
- Android SDK (for mobile app testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd test-automation-framework

# Install dependencies
npm install

# Setup browsers and tools
npm run setup

# Copy environment configuration
cp .env.example .env
# Edit .env with your specific values
```

### Run Your First Test

```bash
# Run smoke tests (fastest)
npm run test:smoke

# Run all web tests
npm run test:web

# Run API tests only
npm run test:api

# Run with debug mode
npm run test:debug
```

## 📁 Project Structure

```
test-automation-framework/
├── 📁 config/                 # Framework configuration
│   ├── bootstrap.js           # Global setup
│   ├── environment.js         # Environment variables
│   └── teardown.js           # Global cleanup
├── 📁 data/                   # Test data files
│   ├── test-users.json       # User credentials and test data
│   └── test-data.csv         # CSV test data for data-driven tests
├── 📁 features/              # BDD feature files
│   └── login.feature         # Gherkin scenarios
├── 📁 helpers/               # Custom helper classes
│   ├── AssertionHelper.js    # Enhanced assertions
│   ├── DataHelper.js         # Test data utilities
│   └── DatabaseHelper.js     # Database operations
├── 📁 pages/                 # Page Object Models
│   ├── 📁 web/               # Web page objects
│   │   ├── LoginPage.js
│   │   └── DashboardPage.js
│   └── 📁 mobile/            # Mobile page objects
│       └── MobileLoginPage.js
├── 📁 api/                   # API endpoint classes
│   └── UserAPI.js            # User management API
├── 📁 tests/                 # Test files
│   ├── 📁 web/               # Web UI tests
│   ├── 📁 api/               # API tests
│   ├── 📁 mobile-web/        # Mobile web tests
│   └── 📁 mobile-app/        # Mobile app tests
├── 📁 step_definitions/      # BDD step implementations
├── 📁 output/                # Test results and reports
└── 📁 .github/workflows/     # CI/CD configuration
```

## ✍️ Writing Tests

### Simple CodeceptJS Test

```javascript
Feature('Login Functionality');

Scenario('User can login successfully @smoke', async () => {
  I.amOnPage('/login');
  I.fillField('email', 'test@example.com');
  I.fillField('password', 'password123');
  I.click('Login');
  I.see('Welcome Dashboard');
  I.seeInCurrentUrl('/dashboard');
});
```

### BDD Feature File

```gherkin
Feature: User Authentication
  As a user
  I want to login to the application
  So that I can access my account

Scenario: Successful login
  Given I am on the login page
  When I enter valid credentials
  And I click the login button
  Then I should see the dashboard
```

### Page Object Example

```javascript
class LoginPage {
  locators = {
    emailField: '#email',
    passwordField: '#password',
    loginButton: 'button[type="submit"]'
  };

  async login(email, password) {
    I.fillField(this.locators.emailField, email);
    I.fillField(this.locators.passwordField, password);
    I.click(this.locators.loginButton);
  }
}
```

### API Test Example

```javascript
Scenario('Create user via API @api', async () => {
  const userData = {
    email: 'newuser@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  I.sendPostRequest('/users', userData);
  I.seeResponseCodeIs(201);
  I.seeResponseContainsJson({
    email: userData.email,
    firstName: userData.firstName
  });
});
```

## 🏃 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run by platform
npm run test:web          # Web UI tests only
npm run test:api          # API tests only  
npm run test:mobile       # Mobile app tests
npm run test:mobile-web   # Mobile web tests

# Run by test type
npm run test:smoke        # Quick smoke tests
npm run test:regression   # Full regression suite

# Run with specific tags
npm test -- --grep "@smoke"
npm test -- --grep "@api"
npm test -- --grep "@mobile"

# Parallel execution
npm run test:parallel

# Debug mode
npm run test:debug
npm run test:steps        # See step-by-step execution
```

### Environment Configuration

```bash
# Test against different environments
NODE_ENV=staging npm test
NODE_ENV=production npm run test:smoke

# Mobile testing
PLATFORM=android npm run test:mobile
PLATFORM=ios npm run test:mobile
```

### Browser Selection

```bash
# Single browser
BROWSER=firefox npm run test:web
BROWSER=webkit npm run test:web

# Multiple browsers
npm run test:parallel     # Runs on Chrome, Firefox, Safari
```

## 📊 Test Reports

### Generate Reports

```bash
# Generate Allure report
npm run report:generate

# Serve interactive report
npm run report

# Clean old reports
npm run clean
```

### View Results

- **Allure Reports**: `output/allure-reports/index.html`
- **Screenshots**: `output/screenshots/`
- **Videos**: `output/videos/`
- **Logs**: `output/logs/`

## 🎯 Best Practices

### 1. Test Organization

```javascript
// ✅ Good: Clear, descriptive scenario names
Scenario('User can successfully login with valid credentials @smoke', async () => {
  // test implementation
});

// ❌ Bad: Vague scenario names
Scenario('Login test', async () => {
  // test implementation
});
```

### 2. Page Objects

```javascript
// ✅ Good: Locators as constants, reusable methods
class LoginPage {
  locators = {
    emailField: '#email',
    passwordField: '#password'
  };

  async fillCredentials(email, password) {
    I.fillField(this.locators.emailField, email);
    I.fillField(this.locators.passwordField, password);
  }
}

// ❌ Bad: Hardcoded selectors in tests
Scenario('Login', async () => {
  I.fillField('#email', 'test@example.com');
  I.fillField('#password', 'password123');
});
```

### 3. Data Management

```javascript
// ✅ Good: Use data helpers and configuration
const userData = DataHelper.generateUser();
const testUser = testConfig.users.standard;

// ❌ Bad: Hardcoded test data
I.fillField('email', 'hardcoded@email.com');
```

### 4. Test Tags

```javascript
// ✅ Good: Multiple descriptive tags
Scenario('User registration flow @smoke @registration @web', async () => {

// ✅ Good: Platform and feature tags  
Scenario('Mobile login @mobile @login @critical', async () => {
```

### 5. Assertions

```javascript
// ✅ Good: Specific, meaningful assertions
I.see('Login successful');
I.seeInCurrentUrl('/dashboard');
I.seeElement('[data-testid="user-menu"]');

// ❌ Bad: Vague assertions
I.see('Success');
```

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes a complete CI/CD pipeline:

- **Multi-browser testing** across Chrome, Firefox, Safari
- **Parallel execution** for faster feedback
- **Environment-specific testing** (staging, production)
- **Automated reporting** with Allure
- **Slack notifications** for team updates

### Manual Triggers

```bash
# Trigger specific test suite
gh workflow run test-automation.yml -f test_suite=smoke
gh workflow run test-automation.yml -f test_suite=regression
gh workflow run test-automation.yml -f environment=production
```

### Scheduled Runs

- **Nightly regression tests** at 2 AM UTC
- **Smoke tests** on every push/PR
- **Full suite** on main branch updates

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

```bash
# Application URLs
BASE_URL=https://staging.example.com
API_URL=https://api-staging.example.com

# Test Configuration  
DEFAULT_TIMEOUT=30000
PARALLEL_CHUNKS=3

# Mobile Configuration
ANDROID_VERSION=11.0
DEVICE_NAME=emulator-5554
APP_PATH=./apps/sample-app.apk

# Database (optional)
DB_HOST=localhost
DB_NAME=test_db
DB_USER=test_user
```

### Browser Configuration

```javascript
// codecept.conf.js
helpers: {
  Playwright: {
    browser: 'chromium', // 'firefox', 'webkit'
    show: !process.env.CI,
    windowSize: '1920x1080'
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Failing Due to Timing

```javascript
// ✅ Solution: Use proper waits
I.waitForElement('.loading-complete', 10);
I.waitForText('Welcome', 5);

// ❌ Problem: Fixed waits
I.wait(3); // Unreliable
```

#### 2. Element Not Found

```javascript
// ✅ Solution: More robust selectors
I.seeElement('[data-testid="submit-button"]');
I.seeElement('button:has-text("Submit")');

// ❌ Problem: Fragile selectors
I.seeElement('#btn-123'); // May change
```

#### 3. Mobile Tests Failing

```bash
# Check Appium server
appium doctor

# Verify device connection
adb devices

# Check app installation
adb shell pm list packages | grep com.yourapp
```

#### 4. API Tests Timing Out

```javascript
// ✅ Solution: Increase timeout for slow APIs
I.sendGetRequest('/slow-endpoint', {
  timeout: 60000
});
```

### Debug Commands

```bash
# Run with verbose output
npm test -- --verbose

# Run single test with debug
npm test -- --grep "specific test" --debug

# Check configuration
npx codeceptjs def

# Validate setup
npx codeceptjs list
```

### Getting Help

1. **Check logs**: `output/logs/test.log`
2. **Review screenshots**: `output/screenshots/`
3. **Examine configuration**: `codecept.conf.js`
4. **Validate environment**: `.env` file
5. **Test connectivity**: Run single API test first

## 🤝 Contributing

### Adding New Tests

1. **Web UI Tests**: Add to `tests/web/`
2. **API Tests**: Add to `tests/api/`
3. **Mobile Tests**: Add to `tests/mobile-app/` or `tests/mobile-web/`
4. **Page Objects**: Add to `pages/web/` or `pages/mobile/`

### Code Standards

- Use descriptive test names
- Tag tests appropriately
- Follow Page Object Model
- Add assertions with meaningful messages
- Include both positive and negative test cases

### Before Committing

```bash
# Run linting (if configured)
npm run lint

# Run smoke tests
npm run test:smoke

# Check for security issues
npm audit
```

---

## 📞 Support

For questions, issues, or contributions:

- **Documentation**: Check this README first
- **Issues**: Create GitHub issues for bugs
- **Features**: Discuss new features in team meetings
- **Questions**: Ask in team chat or create discussions

**Happy Testing! 🧪✨**