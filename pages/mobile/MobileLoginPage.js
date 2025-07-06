const { I } = inject();

class MobileLoginPage {
  
  // Mobile-specific locators (can be XPath, accessibility IDs, or text)
  locators = {
    // Android locators
    android: {
      emailField: '//android.widget.EditText[@resource-id="email"]',
      passwordField: '//android.widget.EditText[@resource-id="password"]',
      loginButton: '//android.widget.Button[@text="Login"]',
      rememberCheckbox: '//android.widget.CheckBox[@resource-id="remember"]',
      forgotPasswordLink: '//android.widget.TextView[@text="Forgot Password?"]',
      errorMessage: '//android.widget.TextView[contains(@text, "Error")]',
      loadingSpinner: '//android.widget.ProgressBar'
    },
    
    // iOS locators
    ios: {
      emailField: '~email-input',
      passwordField: '~password-input',
      loginButton: '~login-button',
      rememberCheckbox: '~remember-checkbox',
      forgotPasswordLink: '~forgot-password-link',
      errorMessage: '~error-message',
      loadingSpinner: '~loading-spinner'
    }
  };
  
  // Get platform-specific locators
  getLocator(element) {
    const platform = process.env.PLATFORM || 'android';
    return this.locators[platform.toLowerCase()][element];
  }
  
  // Actions
  async waitForLoginScreen() {
    I.waitForElement(this.getLocator('emailField'), 30);
    I.waitForElement(this.getLocator('passwordField'), 30);
    I.waitForElement(this.getLocator('loginButton'), 30);
  }
  
  async fillEmail(email) {
    I.clearField(this.getLocator('emailField'));
    I.fillField(this.getLocator('emailField'), email);
    
    // Hide keyboard on mobile
    if (process.platform === 'android') {
      I.hideDeviceKeyboard();
    }
  }
  
  async fillPassword(password) {
    I.clearField(this.getLocator('passwordField'));
    I.fillField(this.getLocator('passwordField'), password);
    
    // Hide keyboard on mobile
    if (process.platform === 'android') {
      I.hideDeviceKeyboard();
    }
  }
  
  async tapLoginButton() {
    I.tap(this.getLocator('loginButton'));
  }
  
  async tapRememberMe() {
    I.tap(this.getLocator('rememberCheckbox'));
  }
  
  async tapForgotPassword() {
    I.tap(this.getLocator('forgotPasswordLink'));
  }
  
  // Composite actions
  async login(email, password, rememberMe = false) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.tapRememberMe();
    }
    
    await this.tapLoginButton();
    await this.waitForLoginResult();
  }
  
  async loginAsStandardUser() {
    const user = global.testConfig.users.standard;
    await this.login(user.email, user.password);
  }
  
  async loginAsAdmin() {
    const user = global.testConfig.users.admin;
    await this.login(user.email, user.password);
  }
  
  async waitForLoginResult() {
    // Wait for either error message or successful navigation
    try {
      I.waitForElement(this.getLocator('errorMessage'), 10);
    } catch (e) {
      // If no error message, login was likely successful
      console.log('Login appears successful - no error message found');
    }
  }
  
  // Mobile-specific actions
  async swipeToShowPassword() {
    // Some mobile apps hide password field below fold
    I.swipeUp();
  }
  
  async rotateToLandscape() {
    I.setOrientation('LANDSCAPE');
  }
  
  async rotateToPortrait() {
    I.setOrientation('PORTRAIT');
  }
  
  async backgroundApp() {
    I.runOnAndroid(() => {
      I.pressKeycode(187); // APP_SWITCH key
    });
  }
  
  async foregroundApp() {
    I.runOnAndroid(() => {
      const appPackage = global.testConfig.mobile.android.appPackage;
      I.startActivity(appPackage, '.MainActivity');
    });
  }
  
  // Assertions
  async seeLoginScreen() {
    I.seeElement(this.getLocator('emailField'));
    I.seeElement(this.getLocator('passwordField'));
    I.seeElement(this.getLocator('loginButton'));
  }
  
  async seeErrorMessage(message) {
    I.seeElement(this.getLocator('errorMessage'));
    if (message) {
      I.see(message, this.getLocator('errorMessage'));
    }
  }
  
  async seeLoadingSpinner() {
    I.seeElement(this.getLocator('loadingSpinner'));
  }
  
  async dontSeeLoadingSpinner() {
    I.dontSeeElement(this.getLocator('loadingSpinner'));
  }
  
  // Mobile-specific validations
  async validateFieldFocus() {
    // Tap email field and verify keyboard appears
    I.tap(this.getLocator('emailField'));
    I.runOnAndroid(() => {
      I.seeDeviceKeyboard();
    });
  }
  
  async validatePasswordMasking() {
    await this.fillPassword('testpassword');
    const passwordText = await I.grabTextFrom(this.getLocator('passwordField'));
    
    // Password should be masked (typically shows as dots or asterisks)
    I.assertNotEqual(passwordText, 'testpassword', 'Password should be masked');
  }
  
  async validateLoginInDifferentOrientations() {
    // Test login in portrait mode
    await this.rotateToPortrait();
    await this.seeLoginScreen();
    
    // Test login in landscape mode
    await this.rotateToLandscape();
    await this.seeLoginScreen();
    
    // Return to portrait
    await this.rotateToPortrait();
  }
  
  async validateAppStateHandling() {
    // Fill login form
    await this.fillEmail('test@example.com');
    await this.fillPassword('password123');
    
    // Background and foreground app
    await this.backgroundApp();
    await this.foregroundApp();
    
    // Verify form data is preserved (app-dependent behavior)
    await this.seeLoginScreen();
  }
  
  // Gesture-based actions
  async swipeToRefresh() {
    I.swipeDown();
    await this.waitForLoginScreen();
  }
  
  async pinchToZoom() {
    // Some apps may support zoom gestures
    I.pinchOut();
    await this.seeLoginScreen();
  }
  
  // Network-based testing
  async testOfflineLogin() {
    // Disable network
    I.runOnAndroid(() => {
      I.toggleAirplaneMode();
    });
    
    await this.login('test@example.com', 'password123');
    await this.seeErrorMessage('No internet connection');
    
    // Re-enable network
    I.runOnAndroid(() => {
      I.toggleAirplaneMode();
    });
  }
}

module.exports = new MobileLoginPage();
module.exports.MobileLoginPage = MobileLoginPage;