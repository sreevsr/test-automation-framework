const { I } = inject();
const { UiSelectors, ErrorMessages } = require('../../config/constants');
const { ValidationError, ElementNotFoundError } = require('../../utils/errors');
const { logger } = require('../../utils/Logger');

// Create page-specific logger
const pageLogger = logger.child({ component: 'LoginPage' });

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
    pageLogger.step('Open Login Page', 'Navigating to login page');
    
    try {
      I.amOnPage('/login');
      await this.waitForPageToLoad();
      pageLogger.info('Login page opened successfully');
    } catch (error) {
      pageLogger.error('Failed to open login page', { error: error.message });
      throw error;
    }
  }
  
  async waitForPageToLoad() {
    pageLogger.step('Wait for Page Load', 'Waiting for login page elements to load');
    
    try {
      I.waitForElement(this.locators.emailField, 10);
      I.waitForElement(this.locators.passwordField, 10);
      I.waitForElement(this.locators.loginButton, 10);
      pageLogger.debug('Login page loaded successfully');
    } catch (error) {
      pageLogger.error('Login page failed to load', { error: error.message });
      throw error;
    }
  }
  
  async fillEmail(email) {
    pageLogger.step('Fill Email Field', 'Entering email address');
    
    try {
      I.fillField(this.locators.emailField, email);
      pageLogger.debug('Email field filled successfully', { email });
    } catch (error) {
      pageLogger.error('Failed to fill email field', { email, error: error.message });
      throw error;
    }
  }
  
  async fillPassword(password) {
    pageLogger.step('Fill Password Field', 'Entering password');
    
    try {
      I.fillField(this.locators.passwordField, password);
      pageLogger.debug('Password field filled successfully');
    } catch (error) {
      pageLogger.error('Failed to fill password field', { error: error.message });
      throw error;
    }
  }
  
  async checkRememberMe() {
    I.checkOption(this.locators.rememberMeCheckbox);
  }
  
  async clickLogin() {
    pageLogger.step('Click Login Button', 'Clicking login button to submit form');
    
    try {
      I.click(this.locators.loginButton);
      pageLogger.debug('Login button clicked successfully');
    } catch (error) {
      pageLogger.error('Failed to click login button', { error: error.message });
      throw error;
    }
  }
  
  async clickForgotPassword() {
    I.click(this.locators.forgotPasswordLink);
  }
  
  async clickSignUp() {
    I.click(this.locators.signUpLink);
  }
  
  // Composite actions
  async login(email, password, rememberMe = false) {
    pageLogger.step('Login Flow', 'Performing complete login sequence');
    
    try {
      await this.fillEmail(email);
      await this.fillPassword(password);
      
      if (rememberMe) {
        pageLogger.debug('Enabling remember me option');
        await this.checkRememberMe();
      }
      
      await this.clickLogin();
      await this.waitForLoginResult();
      
      pageLogger.info('Login flow completed successfully', { email, rememberMe });
    } catch (error) {
      pageLogger.error('Login flow failed', { email, rememberMe, error: error.message });
      throw error;
    }
  }
  
  async loginAsStandardUser() {
    pageLogger.step('Login as Standard User', 'Logging in with standard user credentials');
    
    try {
      const user = global.testConfig.users.standard;
      await this.login(user.email, user.password);
      pageLogger.info('Standard user login completed');
    } catch (error) {
      pageLogger.error('Standard user login failed', { error: error.message });
      throw error;
    }
  }
  
  async loginAsAdmin() {
    pageLogger.step('Login as Admin', 'Logging in with admin credentials');
    
    try {
      const user = global.testConfig.users.admin;
      await this.login(user.email, user.password);
      pageLogger.info('Admin user login completed');
    } catch (error) {
      pageLogger.error('Admin user login failed', { error: error.message });
      throw error;
    }
  }
  
  async waitForLoginResult() {
    pageLogger.step('Wait for Login Result', 'Waiting for login success or error message');
    
    try {
      I.waitForElement([this.locators.errorMessage, this.locators.successMessage], 10);
      pageLogger.debug('Login result received');
    } catch (error) {
      pageLogger.error('Failed to get login result', { error: error.message });
      throw error;
    }
  }
  
  // Assertions
  async seeLoginForm() {
    pageLogger.step('Verify Login Form', 'Checking login form elements are visible');
    
    try {
      I.seeElement(this.locators.emailField);
      I.seeElement(this.locators.passwordField);
      I.seeElement(this.locators.loginButton);
      
      pageLogger.assertion('Login form is visible', true);
    } catch (error) {
      pageLogger.assertion('Login form is visible', false);
      pageLogger.error('Login form validation failed', { error: error.message });
      throw error;
    }
  }
  
  async seeErrorMessage(message) {
    pageLogger.step('Verify Error Message', 'Checking error message is displayed');
    
    try {
      I.seeElement(this.locators.errorMessage);
      if (message) {
        I.see(message, this.locators.errorMessage);
      }
      
      pageLogger.assertion('Error message is visible', true, { message });
    } catch (error) {
      pageLogger.assertion('Error message is visible', false, { message });
      pageLogger.error('Error message validation failed', { message, error: error.message });
      throw error;
    }
  }
  
  async seeSuccessMessage(message) {
    pageLogger.step('Verify Success Message', 'Checking success message is displayed');
    
    try {
      I.seeElement(this.locators.successMessage);
      if (message) {
        I.see(message, this.locators.successMessage);
      }
      
      pageLogger.assertion('Success message is visible', true, { message });
    } catch (error) {
      pageLogger.assertion('Success message is visible', false, { message });
      pageLogger.error('Success message validation failed', { message, error: error.message });
      throw error;
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