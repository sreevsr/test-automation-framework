const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../../config/constants');
const { ValidationError } = require('../../utils/errors');

/**
 * UserSearchService - Handles user search and filtering operations
 * 
 * Dedicated service for managing user search functionality, providing
 * various search methods and filtering capabilities.
 * 
 * @class UserSearchService
 * @example
 * const searchService = new UserSearchService();
 * const users = await searchService.search('john doe');
 */
class UserSearchService {
  
  /**
   * Creates a new UserSearchService instance
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
   * Searches users by query string
   * @param {string} searchQuery - Search query string
   * @returns {Promise<Object>} Search results
   * @throws {ValidationError} If search query is empty
   */
  async search(searchQuery) {
    if (!searchQuery || searchQuery.trim().length === 0) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'searchQuery', searchQuery);
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?q=${encodeURIComponent(searchQuery)}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users by email
   * @param {string} email - Email to search for
   * @returns {Promise<Object>} Search results
   * @throws {ValidationError} If email is invalid
   */
  async searchByEmail(email) {
    if (!email) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'email', email);
    }
    if (!this._isValidEmail(email)) {
      throw new ValidationError(ErrorMessages.VALIDATION.INVALID_EMAIL, 'email', email);
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?email=${encodeURIComponent(email)}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users by name (first name or last name)
   * @param {string} name - Name to search for
   * @returns {Promise<Object>} Search results
   */
  async searchByName(name) {
    if (!name || name.trim().length === 0) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'name', name);
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?name=${encodeURIComponent(name)}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users by role
   * @param {string} role - Role to search for
   * @returns {Promise<Object>} Search results
   */
  async searchByRole(role) {
    if (!role) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'role', role);
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?role=${role}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users by status
   * @param {string} status - Status to search for
   * @returns {Promise<Object>} Search results
   */
  async searchByStatus(status) {
    if (!status) {
      throw new ValidationError(ErrorMessages.VALIDATION.REQUIRED_FIELD, 'status', status);
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?status=${status}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Advanced search with multiple criteria
   * @param {Object} criteria - Search criteria object
   * @param {string} [criteria.query] - General search query
   * @param {string} [criteria.email] - Email filter
   * @param {string} [criteria.firstName] - First name filter
   * @param {string} [criteria.lastName] - Last name filter
   * @param {string} [criteria.role] - Role filter
   * @param {string} [criteria.status] - Status filter
   * @param {Date} [criteria.createdAfter] - Created after date
   * @param {Date} [criteria.createdBefore] - Created before date
   * @returns {Promise<Object>} Search results
   */
  async advancedSearch(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      throw new ValidationError('Search criteria cannot be empty', 'criteria', criteria);
    }
    
    const queryParams = new URLSearchParams();
    
    // Add search parameters
    if (criteria.query) queryParams.append('q', criteria.query);
    if (criteria.email) queryParams.append('email', criteria.email);
    if (criteria.firstName) queryParams.append('firstName', criteria.firstName);
    if (criteria.lastName) queryParams.append('lastName', criteria.lastName);
    if (criteria.role) queryParams.append('role', criteria.role);
    if (criteria.status) queryParams.append('status', criteria.status);
    if (criteria.createdAfter) queryParams.append('createdAfter', criteria.createdAfter.toISOString());
    if (criteria.createdBefore) queryParams.append('createdBefore', criteria.createdBefore.toISOString());
    
    return await I.sendGetRequest(
      `${this.endpoint}/search?${queryParams.toString()}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Filters users with pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} [pagination] - Pagination options
   * @param {number} [pagination.page=1] - Page number
   * @param {number} [pagination.limit=10] - Items per page
   * @param {string} [pagination.sortBy] - Sort field
   * @param {string} [pagination.sortOrder='asc'] - Sort order (asc/desc)
   * @returns {Promise<Object>} Filtered and paginated results
   */
  async filter(filters, pagination = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    // Add pagination parameters
    if (pagination.page) queryParams.append('page', pagination.page);
    if (pagination.limit) queryParams.append('limit', pagination.limit);
    if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination.sortOrder) queryParams.append('sortOrder', pagination.sortOrder);
    
    return await I.sendGetRequest(
      `${this.endpoint}?${queryParams.toString()}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users with autocomplete functionality
   * @param {string} partial - Partial string to search
   * @param {string} [field='name'] - Field to search in (name, email)
   * @param {number} [limit=5] - Maximum number of results
   * @returns {Promise<Object>} Autocomplete suggestions
   */
  async autocomplete(partial, field = 'name', limit = 5) {
    if (!partial || partial.length < 2) {
      throw new ValidationError('Partial string must be at least 2 characters', 'partial', partial);
    }
    
    const queryParams = new URLSearchParams({
      partial: partial,
      field: field,
      limit: limit.toString()
    });
    
    return await I.sendGetRequest(
      `${this.endpoint}/autocomplete?${queryParams.toString()}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Gets search suggestions based on input
   * @param {string} input - User input
   * @returns {Promise<Object>} Search suggestions
   */
  async getSuggestions(input) {
    if (!input || input.trim().length === 0) {
      return { suggestions: [] };
    }
    
    return await I.sendGetRequest(
      `${this.endpoint}/suggestions?input=${encodeURIComponent(input)}`, 
      this._getHeaders()
    );
  }
  
  /**
   * Searches users by multiple IDs
   * @param {Array<string|number>} userIds - Array of user IDs
   * @returns {Promise<Object>} Users matching the IDs
   */
  async searchByIds(userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new ValidationError('User IDs array is required and cannot be empty', 'userIds', userIds);
    }
    
    return await I.sendPostRequest(
      `${this.endpoint}/search/batch`, 
      { userIds: userIds },
      this._getHeaders()
    );
  }
  
  /**
   * Searches users within a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} [dateField='createdAt'] - Date field to search (createdAt, updatedAt)
   * @returns {Promise<Object>} Users within date range
   */
  async searchByDateRange(startDate, endDate, dateField = 'createdAt') {
    if (!startDate || !endDate) {
      throw new ValidationError('Both start and end dates are required', 'dateRange', { startDate, endDate });
    }
    
    if (startDate >= endDate) {
      throw new ValidationError('Start date must be before end date', 'dateRange', { startDate, endDate });
    }
    
    const queryParams = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dateField: dateField
    });
    
    return await I.sendGetRequest(
      `${this.endpoint}/search/date-range?${queryParams.toString()}`, 
      this._getHeaders()
    );
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

module.exports = UserSearchService;