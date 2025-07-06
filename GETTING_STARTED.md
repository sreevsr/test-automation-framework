# 🚀 Getting Started Guide

This guide will help your team get up and running with the test automation framework quickly and efficiently.

## 👥 For Different Team Members

### Manual Testers → Automation Testers

**Week 1: Learn the Basics**
1. Understand the project structure
2. Run existing tests to see how they work
3. Write your first simple test
4. Learn basic CodeceptJS syntax

**Week 2: Write BDD Scenarios**
1. Learn Gherkin syntax (Given/When/Then)
2. Convert manual test cases to BDD scenarios
3. Practice with existing step definitions

**Week 3: Create Page Objects**
1. Learn Page Object Model concept
2. Create page objects for your test areas
3. Refactor tests to use page objects

**Week 4: Advanced Features**
1. Data-driven testing
2. API test basics
3. Mobile testing introduction

### Developers

**Day 1: Setup and Configuration**
1. Clone repository and install dependencies
2. Configure environment variables
3. Run full test suite
4. Understand CI/CD integration

**Day 2-3: Framework Architecture**
1. Study configuration files
2. Understand helper classes
3. Review test patterns and best practices
4. Set up local development environment

**Day 4-5: Integration**
1. Add tests for new features
2. Set up test data and mocks
3. Configure test environment
4. Integrate with development workflow

### QA Managers

**Initial Setup (1 hour)**
1. Review framework capabilities
2. Understand reporting and metrics
3. Configure CI/CD pipeline
4. Set up team access and permissions

**Ongoing Management**
1. Monitor test execution and results
2. Review test coverage and quality metrics
3. Plan test automation strategy
4. Coordinate team training and adoption

## 📚 Learning Path by Week

### Week 1: Foundation
**Goal**: Understand the framework and run your first test

**Day 1: Environment Setup**
```bash
# Install Node.js (16+)
node --version

# Clone repository
git clone <repository-url>
cd test-automation-framework

# Install dependencies
npm install
npm run setup
```

**Day 2: Run Existing Tests**
```bash
# Run smoke tests (fastest)
npm run test:smoke

# Run with visual mode
npm test -- --debug

# Check test results
npm run report
```

**Day 3: Understand Project Structure**
- Explore `tests/` folder
- Look at `pages/` folder  
- Check `data/` folder
- Review `features/` folder

**Day 4: Write Your First Test**
```javascript
Feature('My First Test');

Scenario('I can visit the homepage @smoke', () => {
  I.amOnPage('/');
  I.see('Welcome');
});
```

**Day 5: Learn Basic CodeceptJS Commands**
```javascript
// Navigation
I.amOnPage('/login');

// Interactions
I.fillField('email', 'test@example.com');
I.click('Login');

// Assertions
I.see('Welcome');
I.seeInCurrentUrl('/dashboard');
I.seeElement('.success-message');
```

### Week 2: BDD and Scenarios
**Goal**: Write readable test scenarios using BDD

**Day 1: Learn Gherkin Syntax**
```gherkin
Feature: User Login
  As a user
  I want to login to the application
  So that I can access my account

Background:
  Given I am on the login page

Scenario: Successful login
  When I enter valid credentials
  And I click the login button
  Then I should see the dashboard
```

**Day 2: Practice with Step Definitions**
```javascript
// step_definitions/login_steps.js
Given('I am on the login page', async () => {
  await LoginPage.open();
});

When('I enter valid credentials', async () => {
  await LoginPage.fillEmail('test@example.com');
  await LoginPage.fillPassword('password123');
});
```

**Day 3: Convert Manual Tests to BDD**
- Take existing manual test cases
- Write them as Gherkin scenarios
- Use existing step definitions
- Run and debug your scenarios

**Day 4: Data-Driven BDD**
```gherkin
Scenario Outline: Login with different users
  When I login with "<email>" and "<password>"
  Then I should see "<result>"

Examples:
  | email           | password    | result    |
  | valid@test.com  | correct123  | dashboard |
  | wrong@test.com  | wrong123    | error     |
```

**Day 5: Practice and Review**
- Write 3-5 BDD scenarios for your area
- Get code review from experienced team member
- Run tests and fix any issues

### Week 3: Page Objects and Organization
**Goal**: Create maintainable, reusable test code

**Day 1: Understand Page Object Model**
```javascript
// pages/web/LoginPage.js
class LoginPage {
  locators = {
    emailField: '#email',
    passwordField: '#password',
    loginButton: 'button[type="submit"]'
  };

  async open() {
    I.amOnPage('/login');
  }

  async login(email, password) {
    I.fillField(this.locators.emailField, email);
    I.fillField(this.locators.passwordField, password);
    I.click(this.locators.loginButton);
  }
}
```

**Day 2: Create Your First Page Object**
- Choose a page you're testing
- Identify all elements and actions
- Create page object class
- Add to codecept configuration

**Day 3: Refactor Existing Tests**
- Take tests you wrote in Week 1-2
- Convert them to use page objects
- Test and verify they still work

**Day 4: Advanced Page Object Features**
```javascript
class LoginPage {
  // Composite actions
  async loginAsStandardUser() {
    const user = testConfig.users.standard;
    await this.login(user.email, user.password);
  }

  // Validations
  async seeLoginForm() {
    I.seeElement(this.locators.emailField);
    I.seeElement(this.locators.passwordField);
    I.seeElement(this.locators.loginButton);
  }

  // Error handling
  async seeErrorMessage(message) {
    I.seeElement('.error-message');
    if (message) {
      I.see(message, '.error-message');
    }
  }
}
```

**Day 5: Test Organization**
- Organize tests by feature area
- Use consistent naming conventions
- Add appropriate tags
- Review with team

### Week 4: Advanced Features
**Goal**: Learn API testing, mobile testing, and data management

**Day 1: API Testing Basics**
```javascript
Scenario('Get user information @api', () => {
  I.sendGetRequest('/api/users/1');
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    id: 1,
    email: 'test@example.com'
  });
});

Scenario('Create new user @api', () => {
  const userData = {
    email: 'newuser@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  I.sendPostRequest('/api/users', userData);
  I.seeResponseCodeIs(201);
});
```

**Day 2: Test Data Management**
```javascript
// Using data helpers
const userData = DataHelper.generateUser();
const testUser = DataHelper.getTestUserByRole('admin');

// Using JSON data
const users = await DataHelper.readJsonFile('./data/test-users.json');
const standardUser = users.users.standardUser;
```

**Day 3: Mobile Web Testing**
```javascript
Scenario('Login works on mobile @mobile-web', () => {
  I.resizeWindow(375, 667); // iPhone size
  I.amOnPage('/login');
  
  // Test mobile-specific behavior
  I.fillField('#email', 'test@example.com');
  I.fillField('#password', 'password123');
  I.click('#login-button');
  
  I.seeInCurrentUrl('/dashboard');
});
```

**Day 4: Introduction to Mobile App Testing**
```javascript
// Basic mobile app test structure
Scenario('Mobile app login @mobile', () => {
  I.tap('~email-field');
  I.fillField('~email-field', 'test@example.com');
  I.tap('~password-field');
  I.fillField('~password-field', 'password123');
  I.tap('~login-button');
  
  I.waitForElement('~home-screen', 10);
});
```

**Day 5: Practice and Integration**
- Combine different test types
- Practice with real test scenarios
- Set up your development workflow

## 🎯 Quick Reference Cheat Sheet

### Essential CodeceptJS Commands

```javascript
// Navigation
I.amOnPage('/path');
I.click('button');
I.fillField('#input', 'value');

// Assertions
I.see('text');
I.seeElement('.selector');
I.seeInCurrentUrl('/expected');
I.dontSee('text');

// Waits
I.waitForElement('.element', 5);
I.waitForText('text', 3);
I.waitForNavigation();

// Data
I.grabTextFrom('.element');
I.grabValueFrom('#input');
I.grabNumberOfVisibleElements('.items');
```

### BDD Keywords

```gherkin
Feature: High-level functionality
Scenario: Specific test case
Background: Steps run before each scenario

Given: Initial context
When: Action or event
Then: Expected outcome
And: Additional step of same type
But: Contrasting step
```

### Test Tags

```javascript
// Execution control
@smoke     // Quick, critical tests
@regression // Full test suite
@slow      // Tests that take longer

// Platform
@web       // Web browser tests
@api       // API tests
@mobile    // Mobile app tests
@mobile-web // Mobile browser tests

// Feature areas
@login     // Authentication tests
@checkout  // Purchase flow tests
@admin     // Admin functionality
```

### Running Tests

```bash
# Basic execution
npm test                    # All tests
npm run test:smoke         # Smoke tests only
npm run test:web          # Web tests only
npm run test:api          # API tests only

# With filters
npm test -- --grep "@smoke"              # Tagged tests
npm test -- --grep "login"               # Text matching
npm test -- tests/web/login_test.js      # Specific file

# Debug and development
npm run test:debug         # Visual debugging
npm run test:steps         # Step-by-step execution
npm test -- --verbose      # Detailed output
```

## ❓ FAQ for New Team Members

**Q: I'm a manual tester with no coding experience. Can I use this framework?**
A: Absolutely! Start with BDD scenarios using plain English. You can write valuable tests using existing step definitions, then gradually learn more technical aspects.

**Q: How long does it take to become productive?**
A: Most team members can write basic tests within 1-2 weeks. Full productivity typically comes within 4-6 weeks with regular practice.

**Q: What should I focus on first?**
A: Focus on understanding the test structure and running existing tests. Once comfortable, start writing simple scenarios for areas you know well.

**Q: How do I know if my tests are good?**
A: Good tests are:
- Easy to understand and maintain
- Test one thing at a time
- Use descriptive names and assertions
- Are reliable and don't flake
- Run quickly

**Q: What if I break something?**
A: Don't worry! Use version control (git) to track changes. You can always revert to a working version. Ask experienced team members for code reviews.

**Q: How do I handle flaky tests?**
A: Flaky tests usually have timing issues. Use proper waits instead of fixed delays:
```javascript
// ❌ Bad
I.wait(3);

// ✅ Good
I.waitForElement('.loading-complete', 10);
```

**Q: Should I test everything through the UI?**
A: No! Use the testing pyramid:
- Most tests: Unit tests (developers write these)
- Some tests: API tests (fast, reliable)
- Few tests: UI tests (for critical user journeys)

**Q: How do I debug failing tests?**
A: 
1. Run with `--debug` flag to see what's happening
2. Check screenshots in `output/screenshots/`
3. Review logs in `output/logs/`
4. Use `I.saveScreenshot()` to capture specific moments
5. Add `I.pause()` to stop and inspect

**Q: When should I ask for help?**
A: Ask when:
- Stuck for more than 30 minutes
- Not sure about test design approach
- Need code review before committing
- Want to learn best practices
- Encountering framework issues

## 🎓 Next Steps

After completing the 4-week program:

1. **Specialize**: Choose an area (API, mobile, performance) for deeper learning
2. **Contribute**: Help improve the framework and documentation
3. **Mentor**: Help new team members get started
4. **Advanced Topics**: Learn CI/CD, performance testing, security testing

## 📞 Getting Help

- **Daily Standups**: Discuss testing progress and blockers
- **Code Reviews**: All test code should be reviewed
- **Team Chat**: Quick questions and discussions
- **Documentation**: Always check README and this guide first
- **Pair Programming**: Work with experienced team members

Remember: Everyone started as a beginner. The key is consistent practice and asking questions when you need help!

**Happy Testing! 🧪✨**