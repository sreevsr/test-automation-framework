/**
 * Custom Error Classes
 * 
 * Provides specific error types for better error handling and debugging
 * throughout the test automation framework.
 */

/**
 * Base class for all custom framework errors
 * @class FrameworkError
 * @extends Error
 */
class FrameworkError extends Error {
  /**
   * Creates a new FrameworkError
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   */
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when API validation fails
 * @class ValidationError
 * @extends FrameworkError
 */
class ValidationError extends FrameworkError {
  /**
   * Creates a new ValidationError
   * @param {string} message - Validation error message
   * @param {string} field - Field that failed validation
   * @param {*} value - Value that failed validation
   */
  constructor(message, field, value) {
    super(message, { field, value });
    this.field = field;
    this.value = value;
  }
}

/**
 * Error thrown when authentication fails
 * @class AuthenticationError
 * @extends FrameworkError
 */
class AuthenticationError extends FrameworkError {
  /**
   * Creates a new AuthenticationError
   * @param {string} message - Authentication error message
   * @param {string} [username] - Username that failed authentication
   */
  constructor(message, username = null) {
    super(message, { username });
    this.username = username;
  }
}

/**
 * Error thrown when user is not authorized for an action
 * @class AuthorizationError
 * @extends FrameworkError
 */
class AuthorizationError extends FrameworkError {
  /**
   * Creates a new AuthorizationError
   * @param {string} message - Authorization error message
   * @param {string} [resource] - Resource that was accessed
   * @param {string} [action] - Action that was attempted
   */
  constructor(message, resource = null, action = null) {
    super(message, { resource, action });
    this.resource = resource;
    this.action = action;
  }
}

/**
 * Error thrown when a resource is not found
 * @class NotFoundError
 * @extends FrameworkError
 */
class NotFoundError extends FrameworkError {
  /**
   * Creates a new NotFoundError
   * @param {string} message - Not found error message
   * @param {string} resourceType - Type of resource (user, product, etc.)
   * @param {string|number} resourceId - ID of the resource
   */
  constructor(message, resourceType, resourceId) {
    super(message, { resourceType, resourceId });
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

/**
 * Error thrown when API request fails
 * @class ApiError
 * @extends FrameworkError
 */
class ApiError extends FrameworkError {
  /**
   * Creates a new ApiError
   * @param {string} message - API error message
   * @param {number} statusCode - HTTP status code
   * @param {string} endpoint - API endpoint that failed
   * @param {Object} [response] - Full response object
   */
  constructor(message, statusCode, endpoint, response = null) {
    super(message, { statusCode, endpoint, response });
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.response = response;
  }
}

/**
 * Error thrown when test configuration is invalid
 * @class ConfigurationError
 * @extends FrameworkError
 */
class ConfigurationError extends FrameworkError {
  /**
   * Creates a new ConfigurationError
   * @param {string} message - Configuration error message
   * @param {string} configKey - Configuration key that is invalid
   * @param {*} configValue - Configuration value that is invalid
   */
  constructor(message, configKey, configValue) {
    super(message, { configKey, configValue });
    this.configKey = configKey;
    this.configValue = configValue;
  }
}

/**
 * Error thrown when test data is invalid
 * @class TestDataError
 * @extends FrameworkError
 */
class TestDataError extends FrameworkError {
  /**
   * Creates a new TestDataError
   * @param {string} message - Test data error message
   * @param {string} dataType - Type of test data
   * @param {*} data - Invalid test data
   */
  constructor(message, dataType, data) {
    super(message, { dataType, data });
    this.dataType = dataType;
    this.data = data;
  }
}

/**
 * Error thrown when UI element is not found
 * @class ElementNotFoundError
 * @extends FrameworkError
 */
class ElementNotFoundError extends FrameworkError {
  /**
   * Creates a new ElementNotFoundError
   * @param {string} message - Element not found error message
   * @param {string} selector - CSS selector or locator
   * @param {string} [page] - Page where element was expected
   */
  constructor(message, selector, page = null) {
    super(message, { selector, page });
    this.selector = selector;
    this.page = page;
  }
}

/**
 * Error thrown when test timeout occurs
 * @class TimeoutError
 * @extends FrameworkError
 */
class TimeoutError extends FrameworkError {
  /**
   * Creates a new TimeoutError
   * @param {string} message - Timeout error message
   * @param {number} timeout - Timeout value in milliseconds
   * @param {string} [operation] - Operation that timed out
   */
  constructor(message, timeout, operation = null) {
    super(message, { timeout, operation });
    this.timeout = timeout;
    this.operation = operation;
  }
}

/**
 * Error thrown when network request fails
 * @class NetworkError
 * @extends FrameworkError
 */
class NetworkError extends FrameworkError {
  /**
   * Creates a new NetworkError
   * @param {string} message - Network error message
   * @param {string} url - URL that failed
   * @param {string} [method] - HTTP method
   */
  constructor(message, url, method = null) {
    super(message, { url, method });
    this.url = url;
    this.method = method;
  }
}

/**
 * Utility functions for error handling
 * @namespace ErrorUtils
 */
const ErrorUtils = {
  /**
   * Checks if an error is a specific type of framework error
   * @param {Error} error - Error to check
   * @param {Function} errorType - Error class to check against
   * @returns {boolean} True if error is of specified type
   */
  isErrorType(error, errorType) {
    return error instanceof errorType;
  },
  
  /**
   * Extracts useful information from an error for logging
   * @param {Error} error - Error to extract info from
   * @returns {Object} Error information object
   */
  getErrorInfo(error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: error.timestamp || new Date().toISOString(),
      details: error.details || {}
    };
  },
  
  /**
   * Creates a user-friendly error message
   * @param {Error} error - Error to format
   * @returns {string} Formatted error message
   */
  formatErrorMessage(error) {
    if (error instanceof ValidationError) {
      return `Validation failed for field '${error.field}': ${error.message}`;
    }
    if (error instanceof AuthenticationError) {
      return `Authentication failed: ${error.message}`;
    }
    if (error instanceof NotFoundError) {
      return `${error.resourceType} with ID '${error.resourceId}' not found`;
    }
    if (error instanceof ApiError) {
      return `API error (${error.statusCode}): ${error.message}`;
    }
    return error.message || 'An unexpected error occurred';
  }
};

module.exports = {
  FrameworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ApiError,
  ConfigurationError,
  TestDataError,
  ElementNotFoundError,
  TimeoutError,
  NetworkError,
  ErrorUtils
};