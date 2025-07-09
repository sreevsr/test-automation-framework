const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../config/constants');
const { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  ApiError 
} = require('../utils/errors');
const { logger } = require('../utils/Logger');
const AuthenticationService = require('./services/AuthenticationService');
const UserRepository = require('./services/UserRepository');
const UserSearchService = require('./services/UserSearchService');

/**
 * UserAPI - Comprehensive user management API client
 * 
 * Handles all user-related API operations including authentication, CRUD operations,
 * search functionality, and user management. Now refactored to use dependency injection
 * and follows Single Responsibility Principle.
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
   * @param {Object} [dependencies] - Injected dependencies
   * @param {AuthenticationService} [dependencies.authService] - Authentication service
   * @param {UserRepository} [dependencies.userRepository] - User repository
   * @param {UserSearchService} [dependencies.searchService] - Search service
   * @param {Logger} [dependencies.logger] - Logger instance
   */
  constructor(dependencies = {}) {
    // Dependency injection with fallback to default instances
    this.authService = dependencies.authService || new AuthenticationService();
    this.userRepository = dependencies.userRepository || new UserRepository(this.authService);
    this.searchService = dependencies.searchService || new UserSearchService(this.authService);
    this.logger = dependencies.logger || logger.child({ component: 'UserAPI' });
    
    // Legacy support - maintain backward compatibility
    this.endpoint = ApiConstants.ENDPOINTS.USERS;
    this.headers = this.authService.getHeaders();
    
    this.logger.debug('UserAPI initialized with dependency injection');
  }
  
  // Authentication (delegated to AuthenticationService)
  /**
   * Authenticates a user and stores the authentication token
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token
   * @throws {ValidationError} If email or password is missing or invalid
   * @throws {AuthenticationError} If authentication fails
   * @example
   * const response = await userAPI.authenticate('user@example.com', 'password123');
   */
  async authenticate(email, password) {
    this.logger.debug('Authenticating user', { email });
    
    try {
      const response = await this.authService.login(email, password);
      // Update headers for backward compatibility
      this.headers = this.authService.getHeaders();
      
      this.logger.info('User authenticated successfully', { email });
      return response;
    } catch (error) {
      this.logger.error('Authentication failed', { email, error: error.message });
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
    this.logger.debug('Logging out user');
    
    try {
      const response = await this.authService.logout();
      // Update headers for backward compatibility
      this.headers = this.authService.getHeaders();
      
      this.logger.info('User logged out successfully');
      return response;
    } catch (error) {
      this.logger.error('Logout failed', { error: error.message });
      throw error;
    }
  }
  
  // User CRUD operations (delegated to UserRepository)
  /**
   * Creates a new user via API
   * @param {Object} userData - User data for creation
   * @param {string} userData.email - User email (required)
   * @param {string} userData.firstName - User first name (required)
   * @param {string} userData.lastName - User last name (required)
   * @param {string} [userData.role='user'] - User role (optional)
   * @param {string} [userData.status='active'] - User status (optional)
   * @returns {Promise<Object>} API response with created user data
   * @throws {ValidationError} If required fields are missing
   * @example
   * const user = await userAPI.createUser({
   *   email: 'john@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   */
  async createUser(userData) {
    this.logger.debug('Creating user', { email: userData?.email });
    
    try {
      const response = await this.userRepository.create(userData);
      this.logger.info('User created successfully', { email: userData?.email, userId: response.data?.id });
      return response;
    } catch (error) {
      this.logger.error('Failed to create user', { email: userData?.email, error: error.message });
      throw error;
    }
  }
  
  async getUserById(userId) {
    this.logger.debug('Getting user by ID', { userId });
    
    try {
      const response = await this.userRepository.findById(userId);
      this.logger.debug('User retrieved successfully', { userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to get user', { userId, error: error.message });
      throw error;
    }
  }
  
  async getAllUsers(params = {}) {
    this.logger.debug('Getting all users', { params });
    
    try {
      const response = await this.userRepository.findAll(params);
      this.logger.debug('Users retrieved successfully', { count: response.data?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to get users', { error: error.message });
      throw error;
    }
  }
  
  async updateUser(userId, userData) {
    this.logger.debug('Updating user', { userId });
    
    try {
      const response = await this.userRepository.update(userId, userData);
      this.logger.info('User updated successfully', { userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to update user', { userId, error: error.message });
      throw error;
    }
  }
  
  async partialUpdateUser(userId, userData) {
    this.logger.debug('Partially updating user', { userId });
    
    try {
      const response = await this.userRepository.partialUpdate(userId, userData);
      this.logger.info('User partially updated successfully', { userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to partially update user', { userId, error: error.message });
      throw error;
    }
  }
  
  async deleteUser(userId) {
    this.logger.debug('Deleting user', { userId });
    
    try {
      const response = await this.userRepository.delete(userId);
      this.logger.info('User deleted successfully', { userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to delete user', { userId, error: error.message });
      throw error;
    }
  }
  
  // User search and filtering (delegated to UserSearchService)
  async searchUsers(searchQuery) {
    this.logger.debug('Searching users', { searchQuery });
    
    try {
      const response = await this.searchService.search(searchQuery);
      this.logger.debug('User search completed', { searchQuery, count: response.data?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to search users', { searchQuery, error: error.message });
      throw error;
    }
  }
  
  async getUsersByRole(role) {
    this.logger.debug('Getting users by role', { role });
    
    try {
      const response = await this.searchService.searchByRole(role);
      this.logger.debug('Users by role retrieved', { role, count: response.data?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to get users by role', { role, error: error.message });
      throw error;
    }
  }
  
  async getUsersByStatus(status) {
    this.logger.debug('Getting users by status', { status });
    
    try {
      const response = await this.searchService.searchByStatus(status);
      this.logger.debug('Users by status retrieved', { status, count: response.data?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to get users by status', { status, error: error.message });
      throw error;
    }
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
  
  // Password management (delegated to AuthenticationService)
  async changePassword(userId, oldPassword, newPassword) {
    this.logger.debug('Changing password', { userId });
    
    try {
      const response = await this.authService.changePassword(userId, oldPassword, newPassword);
      this.logger.info('Password changed successfully', { userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to change password', { userId, error: error.message });
      throw error;
    }
  }
  
  async resetPassword(email) {
    this.logger.debug('Resetting password', { email });
    
    try {
      const response = await this.authService.resetPassword(email);
      this.logger.info('Password reset initiated', { email });
      return response;
    } catch (error) {
      this.logger.error('Failed to reset password', { email, error: error.message });
      throw error;
    }
  }
  
  async verifyPasswordReset(token, newPassword) {
    this.logger.debug('Verifying password reset');
    
    try {
      const response = await this.authService.verifyPasswordReset(token, newPassword);
      this.logger.info('Password reset verified successfully');
      return response;
    } catch (error) {
      this.logger.error('Failed to verify password reset', { error: error.message });
      throw error;
    }
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
  
  // Bulk operations (delegated to UserRepository)
  async bulkCreateUsers(usersArray) {
    this.logger.debug('Bulk creating users', { count: usersArray?.length });
    
    try {
      const response = await this.userRepository.bulkCreate(usersArray);
      this.logger.info('Bulk user creation completed', { count: usersArray?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to bulk create users', { count: usersArray?.length, error: error.message });
      throw error;
    }
  }
  
  async bulkUpdateUsers(updates) {
    this.logger.debug('Bulk updating users', { count: updates?.length });
    
    try {
      const response = await this.userRepository.bulkUpdate(updates);
      this.logger.info('Bulk user update completed', { count: updates?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to bulk update users', { count: updates?.length, error: error.message });
      throw error;
    }
  }
  
  async bulkDeleteUsers(userIds) {
    this.logger.debug('Bulk deleting users', { count: userIds?.length });
    
    try {
      const response = await this.userRepository.bulkDelete(userIds);
      this.logger.info('Bulk user deletion completed', { count: userIds?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to bulk delete users', { count: userIds?.length, error: error.message });
      throw error;
    }
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

  // Utility methods (for backward compatibility)
  /**
   * Gets current authentication status
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
  
  /**
   * Gets current authentication token
   * @returns {string|null} Current token or null
   */
  getToken() {
    return this.authService.getToken();
  }
  
  /**
   * Gets current headers
   * @returns {Object} Current headers
   */
  getHeaders() {
    return this.authService.getHeaders();
  }
  
  /**
   * Advanced search with multiple criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object>} Search results
   */
  async advancedSearch(criteria) {
    this.logger.debug('Performing advanced search', { criteria });
    
    try {
      const response = await this.searchService.advancedSearch(criteria);
      this.logger.debug('Advanced search completed', { criteria, count: response.data?.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to perform advanced search', { criteria, error: error.message });
      throw error;
    }
  }
  
  // Private helper methods (maintained for backward compatibility)
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