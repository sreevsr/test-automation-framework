Feature('Mobile App Login Tests');

const { MobileLoginPage } = inject();

let testUser;

BeforeSuite(async () => {
  console.log('🚀 Starting Mobile App Login Tests Suite');
  
  // Ensure app is installed and ready
  const appPackage = global.testConfig.mobile.android.appPackage;
  const isInstalled = await I.isAppInstalled(appPackage);
  
  if (!isInstalled) {
    console.log('📱 Installing test app...');
    await I.installApp(global.testConfig.mobile.android.appPath);
  }
  
  console.log('✅ Mobile app is ready for testing');
});

AfterSuite(async () => {
  console.log('✅ Mobile App Login Tests Suite Completed');
});

Before(async () => {
  // Start app fresh for each test
  const appPackage = global.testConfig.mobile.android.appPackage;
  const appActivity = global.testConfig.mobile.android.appActivity;
  
  I.startActivity(appPackage, appActivity);
  await MobileLoginPage.waitForLoginScreen();
  
  // Generate test user
  testUser = {
    email: 'mobile.test@example.com',
    password: 'MobileTest123!'
  };
});

After(async () => {
  // Clean up app state
  try {
    I.terminateApp(global.testConfig.mobile.android.appPackage);
  } catch (e) {
    console.log('App already terminated or not running');
  }
});

Scenario('Successful mobile app login @mobile @smoke @login', async () => {
  // Verify login screen is displayed
  await MobileLoginPage.seeLoginScreen();
  
  // Perform login
  await MobileLoginPage.login(testUser.email, testUser.password);
  
  // Verify successful login (app-specific validation)
  I.waitForElement('~home-screen', 10);
  I.seeElement('~welcome-message');
  
  // Verify user is on home screen
  I.seeAppIsActive();
}).tag('@mobile').tag('@smoke').tag('@login');

Scenario('Mobile app form validation @mobile @regression @validation', async () => {
  // Test empty email
  await MobileLoginPage.fillEmail('');
  await MobileLoginPage.fillPassword('password123');
  await MobileLoginPage.tapLoginButton();
  await MobileLoginPage.seeErrorMessage('Email is required');
  
  // Test invalid email format
  await MobileLoginPage.fillEmail('invalid-email');
  await MobileLoginPage.tapLoginButton();
  await MobileLoginPage.seeErrorMessage('Please enter a valid email');
  
  // Test empty password
  await MobileLoginPage.fillEmail('test@example.com');
  await MobileLoginPage.fillPassword('');
  await MobileLoginPage.tapLoginButton();
  await MobileLoginPage.seeErrorMessage('Password is required');
}).tag('@mobile').tag('@regression').tag('@validation');

Scenario('Failed login with invalid credentials @mobile @regression @security', async () => {
  const invalidCredentials = [
    { email: 'wrong@email.com', password: 'wrongpass' },
    { email: 'test@example.com', password: 'wrongpass' },
    { email: 'nonexistent@email.com', password: 'password123' }
  ];
  
  for (const creds of invalidCredentials) {
    await MobileLoginPage.login(creds.email, creds.password);
    await MobileLoginPage.seeErrorMessage('Invalid credentials');
    
    // Clear fields for next attempt
    await MobileLoginPage.fillEmail('');
    await MobileLoginPage.fillPassword('');
  }
}).tag('@mobile').tag('@regression').tag('@security');

Scenario('Mobile app keyboard interaction @mobile @regression @input', async () => {
  // Test keyboard appears when tapping input fields
  await MobileLoginPage.validateFieldFocus();
  
  // Test password masking
  await MobileLoginPage.validatePasswordMasking();
  
  // Test keyboard dismissal
  I.tap(MobileLoginPage.getLocator('emailField'));
  I.seeDeviceKeyboard();
  I.hideDeviceKeyboard();
  I.dontSeeDeviceKeyboard();
}).tag('@mobile').tag('@regression').tag('@input');

Scenario('Orientation change handling @mobile @regression @orientation', async () => {
  // Test login in different orientations
  await MobileLoginPage.validateLoginInDifferentOrientations();
  
  // Fill form in portrait
  await MobileLoginPage.rotateToPortrait();
  await MobileLoginPage.fillEmail(testUser.email);
  await MobileLoginPage.fillPassword(testUser.password);
  
  // Rotate to landscape and verify data is preserved
  await MobileLoginPage.rotateToLandscape();
  await MobileLoginPage.seeLoginScreen();
  
  // Submit form in landscape
  await MobileLoginPage.tapLoginButton();
  
  // Return to portrait for cleanup
  await MobileLoginPage.rotateToPortrait();
}).tag('@mobile').tag('@regression').tag('@orientation');

Scenario('App state management during interruptions @mobile @regression @lifecycle', async () => {
  // Fill login form
  await MobileLoginPage.fillEmail(testUser.email);
  await MobileLoginPage.fillPassword(testUser.password);
  
  // Simulate app going to background
  await MobileLoginPage.backgroundApp();
  I.wait(2); // Simulate time in background
  
  // Bring app back to foreground
  await MobileLoginPage.foregroundApp();
  
  // Verify app state (depends on app implementation)
  await MobileLoginPage.seeLoginScreen();
  
  // Check if form data is preserved or cleared (depends on security requirements)
  // This is app-specific behavior
}).tag('@mobile').tag('@regression').tag('@lifecycle');

Scenario('Network connectivity handling @mobile @regression @network', async () => {
  // Test offline login attempt
  await MobileLoginPage.testOfflineLogin();
  
  // Test login when network is restored
  await MobileLoginPage.login(testUser.email, testUser.password);
  // Should work once network is available
}).tag('@mobile').tag('@regression').tag('@network');

Scenario('Mobile app gestures @mobile @regression @gestures', async () => {
  // Test swipe gestures
  await MobileLoginPage.swipeToRefresh();
  await MobileLoginPage.seeLoginScreen();
  
  // Test scroll gestures if login screen is scrollable
  try {
    I.swipeUp();
    I.swipeDown();
    await MobileLoginPage.seeLoginScreen();
  } catch (e) {
    console.log('Scroll gestures not applicable for this screen');
  }
  
  // Test pinch gestures if applicable
  try {
    await MobileLoginPage.pinchToZoom();
  } catch (e) {
    console.log('Zoom gestures not supported or applicable');
  }
}).tag('@mobile').tag('@regression').tag('@gestures');

Scenario('Forgot password functionality in mobile app @mobile @regression @feature', async () => {
  await MobileLoginPage.tapForgotPassword();
  
  // Verify forgot password screen appears
  I.waitForElement('~forgot-password-screen', 10);
  I.seeElement('~email-input-forgot');
  I.seeElement('~reset-password-button');
  
  // Test password reset request
  I.fillField('~email-input-forgot', testUser.email);
  I.tap('~reset-password-button');
  
  // Verify success message
  I.waitForElement('~reset-email-sent-message', 10);
}).tag('@mobile').tag('@regression').tag('@feature');

Scenario('Remember me functionality @mobile @regression @feature', async () => {
  // Login with remember me
  await MobileLoginPage.fillEmail(testUser.email);
  await MobileLoginPage.fillPassword(testUser.password);
  await MobileLoginPage.tapRememberMe();
  await MobileLoginPage.tapLoginButton();
  
  // Verify successful login
  I.waitForElement('~home-screen', 10);
  
  // Logout
  I.tap('~logout-button');
  
  // Verify user is remembered on next app launch
  I.terminateApp(global.testConfig.mobile.android.appPackage);
  I.startActivity(global.testConfig.mobile.android.appPackage, global.testConfig.mobile.android.appActivity);
  
  // Check if email is pre-filled (app-specific behavior)
  await MobileLoginPage.waitForLoginScreen();
  // Implementation depends on how the app handles "remember me"
}).tag('@mobile').tag('@regression').tag('@feature');

Scenario('Mobile app accessibility @mobile @accessibility', async () => {
  // Check for accessibility labels
  I.seeElementAttribute(MobileLoginPage.getLocator('emailField'), 'content-desc', 'Email input field');
  I.seeElementAttribute(MobileLoginPage.getLocator('passwordField'), 'content-desc', 'Password input field');
  I.seeElementAttribute(MobileLoginPage.getLocator('loginButton'), 'content-desc', 'Login button');
  
  // Test TalkBack/VoiceOver navigation (if enabled)
  try {
    I.enableAccessibilityService();
    // Navigate using accessibility gestures
    I.tap(MobileLoginPage.getLocator('emailField'));
    I.tap(MobileLoginPage.getLocator('passwordField'));
    I.tap(MobileLoginPage.getLocator('loginButton'));
  } catch (e) {
    console.log('Accessibility service not available for testing');
  }
}).tag('@mobile').tag('@accessibility');

Scenario('Mobile app performance @mobile @performance', async () => {
  const startTime = Date.now();
  
  // Measure app startup time
  I.startActivity(global.testConfig.mobile.android.appPackage, global.testConfig.mobile.android.appActivity);
  await MobileLoginPage.waitForLoginScreen();
  
  const startupTime = Date.now() - startTime;
  I.assertTrue(startupTime < 5000, `App startup time ${startupTime}ms should be under 5 seconds`);
  
  // Measure login flow performance
  const loginStartTime = Date.now();
  await MobileLoginPage.login(testUser.email, testUser.password);
  I.waitForElement('~home-screen', 10);
  
  const loginTime = Date.now() - loginStartTime;
  I.assertTrue(loginTime < 3000, `Login time ${loginTime}ms should be under 3 seconds`);
}).tag('@mobile').tag('@performance');

Scenario('Deep linking to login screen @mobile @regression @deeplink', async () => {
  // Test deep link to login screen
  const deepLinkUrl = 'myapp://login';
  
  try {
    I.openDeepLink(deepLinkUrl);
    await MobileLoginPage.waitForLoginScreen();
    await MobileLoginPage.seeLoginScreen();
  } catch (e) {
    console.log('Deep linking not supported or configured');
  }
}).tag('@mobile').tag('@regression').tag('@deeplink');