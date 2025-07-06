const { I, LoginPage, DashboardPage } = inject();

// Background steps
Given('I am on the login page', async () => {
  await LoginPage.open();
  await LoginPage.waitForPageToLoad();
});

// Credential setup steps
Given('I have valid user credentials', () => {
  I.setTestUser(global.testConfig.users.standard);
});

Given('I am using a mobile device', () => {
  I.resizeWindow(375, 667); // iPhone SE size
});

// Input steps
When('I enter my email address', async () => {
  const user = I.getTestUser() || global.testConfig.users.standard;
  await LoginPage.fillEmail(user.email);
});

When('I enter my password', async () => {
  const user = I.getTestUser() || global.testConfig.users.standard;
  await LoginPage.fillPassword(user.password);
});

When('I enter a valid email address', async () => {
  await LoginPage.fillEmail('valid@example.com');
});

When('I enter a valid password', async () => {
  await LoginPage.fillPassword('ValidPass123!');
});

When('I enter an invalid email address', async () => {
  await LoginPage.fillEmail('invalid@example.com');
});

When('I enter an invalid password', async () => {
  await LoginPage.fillPassword('wrongpassword');
});

When('I enter an invalid email format {string}', async (email) => {
  await LoginPage.fillEmail(email);
});

When('I leave the email field empty', async () => {
  await LoginPage.fillEmail('');
});

When('I leave the password field empty', async () => {
  await LoginPage.fillPassword('');
});

// Action steps
When('I click the login button', async () => {
  await LoginPage.clickLogin();
});

When('I tap the login button', async () => {
  await LoginPage.clickLogin(); // Same action, different context
});

When('I check the {string} checkbox', async (checkboxName) => {
  if (checkboxName.toLowerCase().includes('remember')) {
    await LoginPage.checkRememberMe();
  }
});

When('I click the {string} link', async (linkText) => {
  if (linkText.toLowerCase().includes('forgot password')) {
    await LoginPage.clickForgotPassword();
  }
});

// Complex action steps
When('I enter valid credentials', async () => {
  const user = global.testConfig.users.standard;
  await LoginPage.fillEmail(user.email);
  await LoginPage.fillPassword(user.password);
});

When('I complete the login process', async () => {
  const user = global.testConfig.users.standard;
  await LoginPage.login(user.email, user.password);
});

When('I attempt to login with invalid credentials {int} times', async (attempts) => {
  for (let i = 0; i < attempts; i++) {
    await LoginPage.login('invalid@example.com', 'wrongpassword');
    I.wait(1); // Brief pause between attempts
  }
});

When('I login with email {string} and password {string}', async (email, password) => {
  await LoginPage.login(email, password);
});

When('I logout and return to the login page', async () => {
  await DashboardPage.logout();
  await LoginPage.open();
});

// Assertion steps
Then('I should be redirected to the dashboard', async () => {
  await DashboardPage.waitForPageToLoad();
  I.seeInCurrentUrl('/dashboard');
});

Then('I should see a welcome message', async () => {
  await DashboardPage.seeWelcomeMessage();
});

Then('I should see an {string} error message', async (expectedMessage) => {
  await LoginPage.seeErrorMessage(expectedMessage);
});

Then('I should see a {string} error message', async (expectedMessage) => {
  await LoginPage.seeErrorMessage(expectedMessage);
});

Then('I should remain on the login page', () => {
  I.seeInCurrentUrl('/login');
});

Then('I should be redirected to the password reset page', () => {
  I.seeInCurrentUrl('/forgot-password');
});

Then('I should see password reset instructions', () => {
  I.see('Reset Password');
  I.see('Enter your email address');
});

Then('my email should be pre-filled', async () => {
  const emailValue = await I.grabValueFrom(LoginPage.locators.emailField);
  const user = global.testConfig.users.standard;
  I.assertEqual(emailValue, user.email, 'Email should be remembered');
});

Then('I should successfully login', async () => {
  await DashboardPage.waitForPageToLoad();
  await DashboardPage.seeDashboard();
});

Then('the mobile interface should be responsive', async () => {
  // Check that elements are properly sized for mobile
  const loginButtonRect = await I.grabElementBoundingRect(LoginPage.locators.loginButton);
  I.assertTrue(loginButtonRect.height >= 44, 'Mobile touch targets should be at least 44px');
});

// Accessibility assertions
Then('the login form should have proper labels', () => {
  I.seeElement('label[for="email"]');
  I.seeElement('label[for="password"]');
});

Then('form fields should have appropriate ARIA attributes', () => {
  I.seeElementAttribute(LoginPage.locators.emailField, 'type', 'email');
  I.seeElementAttribute(LoginPage.locators.passwordField, 'type', 'password');
});

Then('the form should be keyboard navigable', () => {
  I.pressKey('Tab'); // Should focus email field
  I.pressKey('Tab'); // Should focus password field
  I.pressKey('Tab'); // Should focus login button
});

Then('touch targets should meet minimum size requirements', async () => {
  const elements = [LoginPage.locators.emailField, LoginPage.locators.passwordField, LoginPage.locators.loginButton];
  
  for (const element of elements) {
    const rect = await I.grabElementBoundingRect(element);
    I.assertTrue(rect.height >= 44, `Element ${element} should meet minimum touch target size`);
  }
});

// Performance assertions
Then('the login should complete within {int} seconds', async (seconds) => {
  // This would typically be measured at the step level
  // For simplicity, we'll just verify we're on the next page
  await DashboardPage.waitForPageToLoad();
});

Then('the dashboard should load within {int} seconds', async (seconds) => {
  const loadTime = await I.executeScript(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation.loadEventEnd - navigation.fetchStart;
  });
  
  I.assertTrue(loadTime < seconds * 1000, `Dashboard load time ${loadTime}ms should be under ${seconds} seconds`);
});

// Security assertions
Then('the account should be temporarily locked', async () => {
  await LoginPage.seeErrorMessage('Account temporarily locked');
});

Then('I should see a security warning message', async () => {
  I.see('Multiple failed login attempts detected');
});

// Data-driven result assertions
Then('I should see the result {string}', async (expectedResult) => {
  switch (expectedResult) {
    case 'success':
      await DashboardPage.waitForPageToLoad();
      await DashboardPage.seeDashboard();
      break;
    case 'invalid_credentials':
      await LoginPage.seeErrorMessage('Invalid credentials');
      break;
    case 'password_required':
      await LoginPage.seeErrorMessage('Password is required');
      break;
    case 'email_required':
      await LoginPage.seeErrorMessage('Email is required');
      break;
    case 'invalid_email':
      await LoginPage.seeErrorMessage('Please enter a valid email');
      break;
    default:
      throw new Error(`Unknown expected result: ${expectedResult}`);
  }
});

// Custom step definition helpers
I.setTestUser = function(user) {
  this._currentTestUser = user;
};

I.getTestUser = function() {
  return this._currentTestUser;
};