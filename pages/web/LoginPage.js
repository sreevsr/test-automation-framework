const { I } = inject();

class LoginPage {
  
  // Locators
  locators = {
    emailField: '#email',
    passwordField: '#password',
    loginButton: 'button[type="submit"]',
    rememberMeCheckbox: '#remember-me',
    forgotPasswordLink: 'a[href*="forgot-password"]',
    signUpLink: 'a[href*="signup"]',
    errorMessage: '.error-message',
    successMessage: '.success-message',
    loadingSpinner: '.loading-spinner'
  };
  
  // Actions
  async open() {
    I.amOnPage('/login');
    await this.waitForPageToLoad();
  }
  
  async waitForPageToLoad() {
    I.waitForElement(this.locators.emailField, 10);
    I.waitForElement(this.locators.passwordField, 10);
    I.waitForElement(this.locators.loginButton, 10);
  }
  
  async fillEmail(email) {
    I.fillField(this.locators.emailField, email);
  }
  
  async fillPassword(password) {
    I.fillField(this.locators.passwordField, password);
  }
  
  async checkRememberMe() {
    I.checkOption(this.locators.rememberMeCheckbox);
  }
  
  async clickLogin() {
    I.click(this.locators.loginButton);
  }
  
  async clickForgotPassword() {
    I.click(this.locators.forgotPasswordLink);
  }
  
  async clickSignUp() {
    I.click(this.locators.signUpLink);
  }
  
  // Composite actions
  async login(email, password, rememberMe = false) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickLogin();
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
    I.waitForElement([this.locators.errorMessage, this.locators.successMessage], 10);
  }
  
  // Assertions
  async seeLoginForm() {
    I.seeElement(this.locators.emailField);
    I.seeElement(this.locators.passwordField);
    I.seeElement(this.locators.loginButton);
  }
  
  async seeErrorMessage(message) {
    I.seeElement(this.locators.errorMessage);
    if (message) {
      I.see(message, this.locators.errorMessage);
    }
  }
  
  async seeSuccessMessage(message) {
    I.seeElement(this.locators.successMessage);
    if (message) {
      I.see(message, this.locators.successMessage);
    }
  }
  
  async seeLoadingSpinner() {
    I.seeElement(this.locators.loadingSpinner);
  }
  
  async dontSeeLoadingSpinner() {
    I.dontSeeElement(this.locators.loadingSpinner);
  }
  
  // Validations
  async validateEmailField() {
    // Test empty email
    await this.fillEmail('');
    await this.clickLogin();
    await this.seeErrorMessage('Email is required');
    
    // Test invalid email format
    await this.fillEmail('invalid-email');
    await this.clickLogin();
    await this.seeErrorMessage('Please enter a valid email');
  }
  
  async validatePasswordField() {
    await this.fillPassword('');
    await this.clickLogin();
    await this.seeErrorMessage('Password is required');
  }
  
  // Data-driven login attempts
  async attemptLoginWithInvalidCredentials() {
    const invalidCredentials = [
      { email: 'wrong@email.com', password: 'wrongpassword' },
      { email: 'test@example.com', password: 'wrongpassword' },
      { email: 'wrong@email.com', password: 'Test123!' }
    ];
    
    for (const creds of invalidCredentials) {
      await this.open();
      await this.login(creds.email, creds.password);
      await this.seeErrorMessage('Invalid credentials');
    }
  }
}

module.exports = new LoginPage();
module.exports.LoginPage = LoginPage;