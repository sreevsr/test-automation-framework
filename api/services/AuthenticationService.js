const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../../config/constants');
const { ValidationError, AuthenticationError } = require('../../utils/errors');

/**
 * AuthenticationService - Handles user authentication operations
 * 
 * Dedicated service for managing user authentication including login, logout,
 * token management, and password operations. Follows Single Responsibility Principle.
 * 
 * @class AuthenticationService
 * @example
 * const authService = new AuthenticationService();
 * await authService.login('user@example.com', 'password');
 */
class AuthenticationService {
  
  /**
   * Creates a new AuthenticationService instance
   * @constructor
   */
  constructor() {
    /** @type {Object} Authentication headers */
    this.headers = { ...ApiConstants.DEFAULT_HEADERS };
    /** @type {string|null} Current authentication token */
    this.token = null;
  }
  
  /**
   * Authenticates a user and stores the authentication token
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token
   * @throws {ValidationError} If email or password is missing or invalid
   * @throws {AuthenticationError} If authentication fails
   */
  async login(email, password) {
    // Input validation
    if (!email) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'email', email);
    }
    if (!password) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'password', password);
    }
    if (!this._isValidEmail(email)) {
      throw new ValidationError(ErrorMessages.VALIDATION.INVALID_EMAIL, 'email', email);
    }
    
    try {
      const response = await I.sendPostRequest(ApiConstants.ENDPOINTS.LOGIN, {
        email: email,
        password: password
      });
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.headers['Authorization'] = `Bearer ${this.token}`;
      } else {
        throw new AuthenticationError(ErrorMessages.AUTHENTICATION.INVALID_CREDENTIALS, email);
      }
      
      return response;
    } catch (error) {
      if (error.response && error.response.status === ApiConstants.STATUS_CODES.UNAUTHORIZED) {
        throw new AuthenticationError(ErrorMessages.AUTHENTICATION.INVALID_CREDENTIALS, email);
      }
      throw error;
    }
  }
  
  /**
   * Logs out the current user and clears authentication token
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      const response = await I.sendPostRequest(ApiConstants.ENDPOINTS.LOGOUT, {}, this.headers);
      this._clearToken();
      return response;
    } catch (error) {
      // Clean up token even if logout fails
      this._clearToken();
      throw error;
    }
  }
  
  /**
   * Changes user password
   * @param {string|number} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  async changePassword(userId, oldPassword, newPassword) {
    if (!userId) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'userId', userId);
    }
    if (!oldPassword) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'oldPassword', oldPassword);
    }
    if (!newPassword) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'newPassword', newPassword);
    }
    
    return await I.sendPostRequest(`${ApiConstants.ENDPOINTS.USERS}/${userId}/change-password`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    }, this.headers);
  }
  
  /**
   * Initiates password reset for a user
   * @param {string} email - User email address
   * @returns {Promise<Object>} Password reset response
   */
  async resetPassword(email) {
    if (!email) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'email', email);
    }
    if (!this._isValidEmail(email)) {
      throw new ValidationError(ErrorMessages.VALIDATION.INVALID_EMAIL, 'email', email);
    }
    
    return await I.sendPostRequest('/auth/reset-password', {
      email: email
    });
  }
  
  /**
   * Verifies password reset token and sets new password
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Verification response
   */
  async verifyPasswordReset(token, newPassword) {
    if (!token) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'token', token);
    }
    if (!newPassword) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'newPassword', newPassword);
    }
    
    return await I.sendPostRequest('/auth/verify-reset', {
      token: token,
      newPassword: newPassword
    });
  }
  
  /**
   * Gets current authentication token
   * @returns {string|null} Current token or null if not authenticated
   */
  getToken() {
    return this.token;
  }
  
  /**
   * Gets authentication headers
   * @returns {Object} Headers object with authorization
   */
  getHeaders() {
    return { ...this.headers };
  }
  
  /**
   * Checks if user is currently authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.token !== null;
  }
  
  /**
   * Clears authentication token and headers
   * @private
   */
  _clearToken() {
    this.token = null;
    delete this.headers['Authorization'];
  }
  
  /**
   * Validates email format using regex
   * @private
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = AuthenticationService;