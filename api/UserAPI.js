const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../config/constants');
const { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  ApiError 
} = require('../utils/errors');

/**
 * UserAPI - Comprehensive user management API client
 * 
 * Handles all user-related API operations including authentication, CRUD operations,
 * search functionality, and user management. Follows REST API conventions with
 * proper error handling and validation.
 * 
 * @class UserAPI
 * @example
 * const userAPI = new UserAPI();
 * await userAPI.authenticate('user@example.com', 'password');
 * const users = await userAPI.getAllUsers();
 */
class UserAPI {
  
  /**
   * Creates a new UserAPI instance
   * @constructor
   */
  constructor() {
    /** @type {string} Base endpoint for user operations */
    this.endpoint = ApiConstants.ENDPOINTS.USERS;
    /** @type {Object} Default headers for API requests */
    this.headers = { ...ApiConstants.DEFAULT_HEADERS };
  }
  
  // Authentication
  /**
   * Authenticates a user and stores the authentication token
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token
   * @throws {Error} If email or password is missing
   * @throws {Error} If authentication fails
   * @example
   * const response = await userAPI.authenticate('user@example.com', 'password123');
   */
  async authenticate(email, password) {
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
        this.headers['Authorization'] = `Bearer ${response.data.token}`;
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
   * @example
   * await userAPI.logout();
   */
  async logout() {
    try {
      const response = await I.sendPostRequest(ApiConstants.ENDPOINTS.LOGOUT, {}, this.headers);
      delete this.headers['Authorization'];
      return response;
    } catch (error) {
      // Clean up token even if logout fails
      delete this.headers['Authorization'];
      throw error;
    }
  }
  
  // User CRUD operations
  /**
   * Creates a new user via API
   * @param {Object} userData - User data for creation
   * @param {string} userData.email - User email (required)
   * @param {string} userData.firstName - User first name (required)
   * @param {string} userData.lastName - User last name (required)
   * @param {string} [userData.role='user'] - User role (optional)
   * @param {string} [userData.status='active'] - User status (optional)
   * @returns {Promise<Object>} API response with created user data
   * @throws {Error} If required fields are missing
   * @example
   * const user = await userAPI.createUser({
   *   email: 'john@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   */
  async createUser(userData) {
    // Input validation
    if (!userData) {
      throw new ValidationError('User data is required', 'userData', userData);
    }
    if (!userData.email) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'email', userData.email);
    }
    if (!userData.firstName) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'firstName', userData.firstName);
    }
    if (!userData.lastName) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'lastName', userData.lastName);
    }
    if (!this._isValidEmail(userData.email)) {
      throw new ValidationError(ErrorMessages.VALIDATION.INVALID_EMAIL, 'email', userData.email);
    }
    
    try {
      return await I.sendPostRequest(this.endpoint, userData, this.headers);
    } catch (error) {
      if (error.response && error.response.status === ApiConstants.STATUS_CODES.BAD_REQUEST) {
        throw new ValidationError('Invalid user data provided', 'userData', userData);
      }
      throw error;
    }
  }
  
  async getUserById(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}`, this.headers);
  }
  
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return await I.sendGetRequest(url, this.headers);
  }
  
  async updateUser(userId, userData) {
    return await I.sendPutRequest(`${this.endpoint}/${userId}`, userData, this.headers);
  }
  
  async partialUpdateUser(userId, userData) {
    return await I.sendPatchRequest(`${this.endpoint}/${userId}`, userData, this.headers);
  }
  
  async deleteUser(userId) {
    return await I.sendDeleteRequest(`${this.endpoint}/${userId}`, this.headers);
  }
  
  // User search and filtering
  async searchUsers(searchQuery) {
    return await I.sendGetRequest(`${this.endpoint}/search?q=${encodeURIComponent(searchQuery)}`, this.headers);
  }
  
  async getUsersByRole(role) {
    return await I.sendGetRequest(`${this.endpoint}?role=${role}`, this.headers);
  }
  
  async getUsersByStatus(status) {
    return await I.sendGetRequest(`${this.endpoint}?status=${status}`, this.headers);
  }
  
  // User profile operations
  async getUserProfile(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/profile`, this.headers);
  }
  
  async updateUserProfile(userId, profileData) {
    return await I.sendPutRequest(`${this.endpoint}/${userId}/profile`, profileData, this.headers);
  }
  
  async uploadUserAvatar(userId, avatarFile) {
    return await I.sendPostRequest(
      `${this.endpoint}/${userId}/avatar`,
      { avatar: avatarFile },
      { ...this.headers, 'Content-Type': 'multipart/form-data' }
    );
  }
  
  // Password management
  async changePassword(userId, oldPassword, newPassword) {
    return await I.sendPostRequest(`${this.endpoint}/${userId}/change-password`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    }, this.headers);
  }
  
  async resetPassword(email) {
    return await I.sendPostRequest('/auth/reset-password', {
      email: email
    });
  }
  
  async verifyPasswordReset(token, newPassword) {
    return await I.sendPostRequest('/auth/verify-reset', {
      token: token,
      newPassword: newPassword
    });
  }
  
  // User permissions and roles
  async getUserPermissions(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/permissions`, this.headers);
  }
  
  async assignRoleToUser(userId, roleId) {
    return await I.sendPostRequest(`${this.endpoint}/${userId}/roles`, {
      roleId: roleId
    }, this.headers);
  }
  
  async removeRoleFromUser(userId, roleId) {
    return await I.sendDeleteRequest(`${this.endpoint}/${userId}/roles/${roleId}`, this.headers);
  }
  
  // User activity and audit
  async getUserActivity(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.endpoint}/${userId}/activity?${queryString}` 
      : `${this.endpoint}/${userId}/activity`;
    return await I.sendGetRequest(url, this.headers);
  }
  
  async getUserLoginHistory(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/login-history`, this.headers);
  }
  
  // Bulk operations
  async bulkCreateUsers(usersArray) {
    return await I.sendPostRequest(`${this.endpoint}/bulk`, {
      users: usersArray
    }, this.headers);
  }
  
  async bulkUpdateUsers(updates) {
    return await I.sendPatchRequest(`${this.endpoint}/bulk`, {
      updates: updates
    }, this.headers);
  }
  
  async bulkDeleteUsers(userIds) {
    return await I.sendDeleteRequest(`${this.endpoint}/bulk`, {
      userIds: userIds
    }, this.headers);
  }
  
  // Validation helpers
  async validateUserCreation(userData) {
    const response = await this.createUser(userData);
    
    I.seeResponseCodeIs(201);
    I.seeResponseContainsJson({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    
    return response;
  }
  
  async validateUserNotFound(userId) {
    const response = await this.getUserById(userId);
    I.seeResponseCodeIs(404);
    return response;
  }
  
  async validateUnauthorizedAccess() {
    const originalHeaders = { ...this.headers };
    delete this.headers['Authorization'];
    
    const response = await this.getAllUsers();
    I.seeResponseCodeIs(401);
    
    this.headers = originalHeaders;
    return response;
  }
  
  // Test data generators
  /**
   * Generates test user data with optional overrides
   * @param {Object} [overrides={}] - Values to override default data
   * @returns {Object} Generated user data object
   * @example
   * const userData = userAPI.generateUserData({
   *   role: 'admin',
   *   status: 'active'
   * });
   */
  generateUserData(overrides = {}) {
    return {
      firstName: global.testUtils.generateRandomName().split(' ')[0],
      lastName: global.testUtils.generateRandomName().split(' ')[1],
      email: global.testUtils.generateRandomEmail(),
      password: 'Test123!',
      role: 'user',
      status: 'active',
      ...overrides
    };
  }

  // Private helper methods
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

  /**
   * Validates user ID format
   * @private
   * @param {string|number} userId - User ID to validate
   * @returns {boolean} True if user ID is valid
   */
  _isValidUserId(userId) {
    return userId !== null && userId !== undefined && 
           (typeof userId === 'string' || typeof userId === 'number') && 
           userId.toString().length > 0;
  }
  
  generateBulkUsers(count = 5) {
    return Array.from({ length: count }, () => this.generateUserData());
  }
  
  // Cleanup helpers
  async cleanupTestUsers(testEmails = []) {
    for (const email of testEmails) {
      try {
        const users = await this.searchUsers(email);
        if (users.data && users.data.length > 0) {
          await this.deleteUser(users.data[0].id);
        }
      } catch (error) {
        console.log(`Failed to cleanup user ${email}: ${error.message}`);
      }
    }
  }
}

module.exports = new UserAPI();
module.exports.UserAPI = UserAPI;