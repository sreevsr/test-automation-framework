const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../../config/constants');
const { ValidationError, NotFoundError } = require('../../utils/errors');

/**
 * UserRepository - Handles user data persistence operations
 * 
 * Dedicated repository for managing user CRUD operations, following the
 * Repository pattern for data access abstraction.
 * 
 * @class UserRepository
 * @example
 * const userRepo = new UserRepository();
 * const user = await userRepo.create({ email: 'user@example.com', firstName: 'John' });
 */
class UserRepository {
  
  /**
   * Creates a new UserRepository instance
   * @constructor
   * @param {Object} [authService] - Authentication service instance
   */
  constructor(authService = null) {
    /** @type {string} Base endpoint for user operations */
    this.endpoint = ApiConstants.ENDPOINTS.USERS;
    /** @type {Object} Authentication service */
    this.authService = authService;
  }
  
  /**
   * Creates a new user
   * @param {Object} userData - User data for creation
   * @param {string} userData.email - User email (required)
   * @param {string} userData.firstName - User first name (required)
   * @param {string} userData.lastName - User last name (required)
   * @param {string} [userData.role='user'] - User role (optional)
   * @param {string} [userData.status='active'] - User status (optional)
   * @returns {Promise<Object>} Created user data
   * @throws {ValidationError} If required fields are missing
   */
  async create(userData) {
    this._validateUserData(userData);
    
    try {
      return await I.sendPostRequest(this.endpoint, userData, this._getHeaders());
    } catch (error) {
      if (error.response && error.response.status === ApiConstants.STATUS_CODES.BAD_REQUEST) {
        throw new ValidationError('Invalid user data provided', 'userData', userData);
      }
      throw error;
    }
  }
  
  /**
   * Retrieves a user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} User data
   * @throws {NotFoundError} If user not found
   */
  async findById(userId) {
    if (!this._isValidUserId(userId)) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'userId', userId);
    }
    
    try {
      return await I.sendGetRequest(`${this.endpoint}/${userId}`, this._getHeaders());
    } catch (error) {
      if (error.response && error.response.status === ApiConstants.STATUS_CODES.NOT_FOUND) {
        throw new NotFoundError(ErrorMessages.SYSTEM.NOT_FOUND, 'user', userId);
      }
      throw error;
    }
  }
  
  /**
   * Retrieves all users with optional filtering
   * @param {Object} [params={}] - Query parameters for filtering
   * @returns {Promise<Object>} Array of users
   */
  async findAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return await I.sendGetRequest(url, this._getHeaders());
  }
  
  /**
   * Updates a user completely
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async update(userId, userData) {
    if (!this._isValidUserId(userId)) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'userId', userId);
    }
    
    this._validateUserData(userData);
    
    return await I.sendPutRequest(`${this.endpoint}/${userId}`, userData, this._getHeaders());
  }
  
  /**
   * Partially updates a user
   * @param {string|number} userId - User ID
   * @param {Object} userData - Partial user data
   * @returns {Promise<Object>} Updated user data
   */
  async partialUpdate(userId, userData) {
    if (!this._isValidUserId(userId)) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'userId', userId);
    }
    
    if (!userData || Object.keys(userData).length === 0) {
      throw new ValidationError('Update data cannot be empty', 'userData', userData);
    }
    
    return await I.sendPatchRequest(`${this.endpoint}/${userId}`, userData, this._getHeaders());
  }
  
  /**
   * Deletes a user
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Deletion response
   */
  async delete(userId) {
    if (!this._isValidUserId(userId)) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'userId', userId);
    }
    
    return await I.sendDeleteRequest(`${this.endpoint}/${userId}`, this._getHeaders());
  }
  
  /**
   * Finds users by role
   * @param {string} role - User role to filter by
   * @returns {Promise<Object>} Array of users with specified role
   */
  async findByRole(role) {
    if (!role) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'role', role);
    }
    
    return await I.sendGetRequest(`${this.endpoint}?role=${role}`, this._getHeaders());
  }
  
  /**
   * Finds users by status
   * @param {string} status - User status to filter by
   * @returns {Promise<Object>} Array of users with specified status
   */
  async findByStatus(status) {
    if (!status) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'status', status);
    }
    
    return await I.sendGetRequest(`${this.endpoint}?status=${status}`, this._getHeaders());
  }
  
  /**
   * Bulk creates multiple users
   * @param {Array<Object>} usersArray - Array of user data objects
   * @returns {Promise<Object>} Bulk creation response
   */
  async bulkCreate(usersArray) {
    if (!Array.isArray(usersArray) || usersArray.length === 0) {
      throw new ValidationError('Users array is required and cannot be empty', 'usersArray', usersArray);
    }
    
    // Validate each user data
    usersArray.forEach((userData, index) => {
      try {
        this._validateUserData(userData);
      } catch (error) {
        throw new ValidationError(`Invalid user data at index ${index}: ${error.message}`, 'userData', userData);
      }
    });
    
    return await I.sendPostRequest(`${this.endpoint}/bulk`, {
      users: usersArray
    }, this._getHeaders());
  }
  
  /**
   * Bulk updates multiple users
   * @param {Array<Object>} updates - Array of update objects with id and data
   * @returns {Promise<Object>} Bulk update response
   */
  async bulkUpdate(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new ValidationError('Updates array is required and cannot be empty', 'updates', updates);
    }
    
    return await I.sendPatchRequest(`${this.endpoint}/bulk`, {
      updates: updates
    }, this._getHeaders());
  }
  
  /**
   * Bulk deletes multiple users
   * @param {Array<string|number>} userIds - Array of user IDs to delete
   * @returns {Promise<Object>} Bulk deletion response
   */
  async bulkDelete(userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new ValidationError('User IDs array is required and cannot be empty', 'userIds', userIds);
    }
    
    return await I.sendDeleteRequest(`${this.endpoint}/bulk`, {
      userIds: userIds
    }, this._getHeaders());
  }
  
  /**
   * Validates user data for creation/update
   * @private
   * @param {Object} userData - User data to validate
   * @throws {ValidationError} If validation fails
   */
  _validateUserData(userData) {
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
   * Gets headers for API requests
   * @private
   * @returns {Object} Headers object
   */
  _getHeaders() {
    return this.authService ? this.authService.getHeaders() : ApiConstants.DEFAULT_HEADERS;
  }
}

module.exports = UserRepository;