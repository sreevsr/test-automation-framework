const { I } = inject();
const { UiSelectors, ErrorMessages } = require('../../config/constants');
const { ValidationError, ElementNotFoundError } = require('../../utils/errors');

/**
 * LoginPage - Page Object Model for login functionality
 * 
 * Handles all login-related UI interactions including form filling,
 * validation, and navigation. Provides methods for both positive
 * and negative test scenarios.
 * 
 * @class LoginPage
 * @example
 * const loginPage = new LoginPage();
 * await loginPage.open();
 * await loginPage.login('user@example.com', 'password123');
 */
class LoginPage {
  
  /**
   * Creates a new LoginPage instance
   * @constructor
   */
  constructor() {
    /** @type {string} Login page URL */
    this.url = '/login';
  }

  /** @type {Object} UI element selectors for login page */
  locators = {
    emailField: UiSelectors.LOGIN_PAGE.EMAIL_FIELD,
    passwordField: UiSelectors.LOGIN_PAGE.PASSWORD_FIELD,
    loginButton: UiSelectors.LOGIN_PAGE.LOGIN_BUTTON,
    rememberMeCheckbox: UiSelectors.LOGIN_PAGE.REMEMBER_ME_CHECKBOX,
    forgotPasswordLink: UiSelectors.LOGIN_PAGE.FORGOT_PASSWORD_LINK,
    signUpLink: 'a[href*="signup"]',
    errorMessage: UiSelectors.LOGIN_PAGE.ERROR_MESSAGE,
    successMessage: UiSelectors.LOGIN_PAGE.SUCCESS_MESSAGE,
    loadingSpinner: UiSelectors.COMMON.LOADING_SPINNER
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