Feature('Web UI Login Tests');

const { LoginPage, DashboardPage } = inject();

// Test data
const validUser = {
  email: 'test@example.com',
  password: 'Test123!'
};

const invalidCredentials = [
  { email: 'wrong@email.com', password: 'wrongpass', error: 'Invalid credentials' },
  { email: 'test@example.com', password: 'wrongpass', error: 'Invalid password' },
  { email: '', password: 'Test123!', error: 'Email is required' },
  { email: 'test@example.com', password: '', error: 'Password is required' }
];

BeforeSuite(async () => {
  console.log('🚀 Starting Web UI Login Tests Suite');
});

AfterSuite(async () => {
  console.log('✅ Web UI Login Tests Suite Completed');
});

Before(async () => {
  // Setup before each test
  await LoginPage.open();
});

After(async () => {
  // Cleanup after each test
  try {
    await DashboardPage.logout();
  } catch (e) {
    // User might not be logged in
  }
});

Scenario('Successful login with valid credentials @web @smoke @login', async () => {
  // Arrange
  await LoginPage.seeLoginForm();
  
  // Act
  await LoginPage.login(validUser.email, validUser.password);
  
  // Assert
  await DashboardPage.waitForPageToLoad();
  await DashboardPage.seeDashboard();
  await DashboardPage.seeWelcomeMessage();
}).tag('@web').tag('@smoke').tag('@login');

Scenario('Login form validation @web @regression @validation', async () => {
  // Test empty email
  await LoginPage.fillEmail('');
  await LoginPage.fillPassword('password123');
  await LoginPage.clickLogin();
  await LoginPage.seeErrorMessage('Email is required');
  
  // Test invalid email format
  await LoginPage.fillEmail('invalid-email');
  await LoginPage.clickLogin();
  await LoginPage.seeErrorMessage('Please enter a valid email');
  
  // Test empty password
  await LoginPage.fillEmail('test@example.com');
  await LoginPage.fillPassword('');
  await LoginPage.clickLogin();
  await LoginPage.seeErrorMessage('Password is required');
}).tag('@web').tag('@regression').tag('@validation');

Scenario('Failed login attempts with invalid credentials @web @regression @security', async () => {
  for (const creds of invalidCredentials) {
    await LoginPage.open();
    await LoginPage.login(creds.email, creds.password);
    await LoginPage.seeErrorMessage(creds.error);
  }
}).tag('@web').tag('@regression').tag('@security');

Scenario('Remember me functionality @web @regression @feature', async () => {
  // Login with remember me checked
  await LoginPage.fillEmail(validUser.email);
  await LoginPage.fillPassword(validUser.password);
  await LoginPage.checkRememberMe();
  await LoginPage.clickLogin();
  
  await DashboardPage.waitForPageToLoad();
  await DashboardPage.logout();
  
  // Verify user is remembered (implementation depends on app behavior)
  await LoginPage.open();
  const rememberedEmail = await I.grabValueFrom(LoginPage.locators.emailField);
  I.assertEqual(rememberedEmail, validUser.email, 'Email should be remembered');
}).tag('@web').tag('@regression').tag('@feature');

Scenario('Forgot password functionality @web @regression @feature', async () => {
  await LoginPage.clickForgotPassword();
  I.seeInCurrentUrl('/forgot-password');
  I.see('Reset Password');
}).tag('@web').tag('@regression').tag('@feature');

Scenario('Login page accessibility @web @accessibility', async () => {
  // Check for proper form labels
  I.seeElement('label[for="email"]');
  I.seeElement('label[for="password"]');
  
  // Check for proper ARIA attributes
  I.seeElementAttribute(LoginPage.locators.emailField, 'type', 'email');
  I.seeElementAttribute(LoginPage.locators.passwordField, 'type', 'password');
  
  // Check keyboard navigation
  I.pressKey('Tab'); // Should focus email field
  I.pressKey('Tab'); // Should focus password field
  I.pressKey('Tab'); // Should focus login button
}).tag('@web').tag('@accessibility');

Scenario('Login performance test @web @performance', async () => {
  const startTime = Date.now();
  
  await LoginPage.login(validUser.email, validUser.password);
  await DashboardPage.waitForPageToLoad();
  
  const endTime = Date.now();
  const loginTime = endTime - startTime;
  
  I.assertTrue(loginTime < 5000, `Login took ${loginTime}ms, should be under 5 seconds`);
}).tag('@web').tag('@performance');

Scenario('Cross-browser login compatibility @web @crossbrowser', async () => {
  // This test will run across multiple browsers when using parallel execution
  await LoginPage.login(validUser.email, validUser.password);
  await DashboardPage.waitForPageToLoad();
  await DashboardPage.validateDashboardLayout();
}).tag('@web').tag('@crossbrowser');

Data(invalidCredentials).Scenario('Data-driven invalid login tests @web @regression @data-driven', async ({ current }) => {
  await LoginPage.login(current.email, current.password);
  await LoginPage.seeErrorMessage(current.error);
}).tag('@web').tag('@regression').tag('@data-driven');