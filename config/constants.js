/**
 * Configuration Constants
 * 
 * Central location for all configuration constants used throughout the framework.
 * This eliminates magic strings and provides a single source of truth for
 * configuration values.
 */

/**
 * API Configuration Constants
 * @namespace ApiConstants
 */
const ApiConstants = {
  /** @type {Object} Default API endpoints */
  ENDPOINTS: {
    USERS: '/users',
    AUTH: '/auth',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    POSTS: '/posts',
    COMMENTS: '/comments',
    ALBUMS: '/albums'
  },
  
  /** @type {Object} HTTP status codes */
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  
  /** @type {Object} Default headers for API requests */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  /** @type {Object} Request timeout values */
  TIMEOUTS: {
    DEFAULT: 30000,
    SLOW: 60000,
    FAST: 5000
  }
};

/**
 * UI Selector Constants
 * @namespace UiSelectors
 */
const UiSelectors = {
  /** @type {Object} Login page selectors */
  LOGIN_PAGE: {
    EMAIL_FIELD: '#email',
    PASSWORD_FIELD: '#password',
    LOGIN_BUTTON: 'button[type="submit"]',
    REMEMBER_ME_CHECKBOX: '#remember-me',
    FORGOT_PASSWORD_LINK: '.forgot-password-link',
    ERROR_MESSAGE: '.error-message',
    SUCCESS_MESSAGE: '.success-message'
  },
  
  /** @type {Object} Dashboard page selectors */
  DASHBOARD_PAGE: {
    WELCOME_MESSAGE: '.welcome-message',
    USER_MENU: '[data-testid="user-menu"]',
    LOGOUT_BUTTON: '#logout-button',
    NAVIGATION_MENU: '.navigation-menu'
  },
  
  /** @type {Object} Common UI selectors */
  COMMON: {
    LOADING_SPINNER: '.loading-spinner',
    ERROR_ALERT: '.alert-error',
    SUCCESS_ALERT: '.alert-success',
    MODAL: '.modal',
    CLOSE_BUTTON: '.close-button'
  }
};

/**
 * Test Data Constants
 * @namespace TestDataConstants
 */
const TestDataConstants = {
  /** @type {Object} User roles */
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
    GUEST: 'guest'
  },
  
  /** @type {Object} User status values */
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },
  
  /** @type {Object} Default passwords for different user types */
  DEFAULT_PASSWORDS: {
    ADMIN: 'AdminPass123!',
    USER: 'UserPass123!',
    TEST: 'TestPass123!'
  },
  
  /** @type {Object} Test data limits */
  LIMITS: {
    MAX_USERNAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 8,
    MAX_EMAIL_LENGTH: 254
  }
};

/**
 * Environment Configuration Constants
 * @namespace EnvironmentConstants
 */
const EnvironmentConstants = {
  /** @type {Object} Environment names */
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    TEST: 'test',
    STAGING: 'staging',
    PRODUCTION: 'production'
  },
  
  /** @type {Object} Default URLs for different environments */
  DEFAULT_URLS: {
    DEVELOPMENT: 'http://localhost:3000',
    TEST: 'https://test.example.com',
    STAGING: 'https://staging.example.com',
    PRODUCTION: 'https://example.com'
  },
  
  /** @type {Object} API URLs for different environments */
  API_URLS: {
    DEVELOPMENT: 'http://localhost:3001/api',
    TEST: 'https://api-test.example.com',
    STAGING: 'https://api-staging.example.com',
    PRODUCTION: 'https://api.example.com'
  }
};

/**
 * Browser Configuration Constants
 * @namespace BrowserConstants
 */
const BrowserConstants = {
  /** @type {Object} Supported browsers */
  BROWSERS: {
    CHROMIUM: 'chromium',
    FIREFOX: 'firefox',
    WEBKIT: 'webkit',
    CHROME: 'chrome',
    EDGE: 'edge'
  },
  
  /** @type {Object} Common viewport sizes */
  VIEWPORTS: {
    DESKTOP: '1920x1080',
    TABLET: '768x1024',
    MOBILE: '375x667',
    MOBILE_LANDSCAPE: '667x375'
  },
  
  /** @type {Object} Wait strategies */
  WAIT_STRATEGIES: {
    LOAD: 'load',
    DOMCONTENTLOADED: 'domcontentloaded',
    NETWORKIDLE: 'networkidle'
  }
};

/**
 * Test Tags Constants
 * @namespace TestTagConstants
 */
const TestTagConstants = {
  /** @type {Object} Test execution tags */
  EXECUTION: {
    SMOKE: '@smoke',
    REGRESSION: '@regression',
    SLOW: '@slow',
    FAST: '@fast'
  },
  
  /** @type {Object} Platform tags */
  PLATFORM: {
    WEB: '@web',
    API: '@api',
    MOBILE: '@mobile',
    MOBILE_WEB: '@mobile-web'
  },
  
  /** @type {Object} Feature area tags */
  FEATURES: {
    LOGIN: '@login',
    CHECKOUT: '@checkout',
    ADMIN: '@admin',
    PAYMENT: '@payment',
    SEARCH: '@search'
  },
  
  /** @type {Object} Test type tags */
  TYPES: {
    SECURITY: '@security',
    PERFORMANCE: '@performance',
    ACCESSIBILITY: '@accessibility',
    VALIDATION: '@validation'
  }
};

/**
 * Error Message Constants
 * @namespace ErrorMessages
 */
const ErrorMessages = {
  /** @type {Object} Validation error messages */
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match'
  },
  
  /** @type {Object} Authentication error messages */
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    UNAUTHORIZED: 'You are not authorized to access this resource'
  },
  
  /** @type {Object} System error messages */
  SYSTEM: {
    NETWORK_ERROR: 'Network connection error. Please try again',
    SERVER_ERROR: 'Internal server error. Please contact support',
    TIMEOUT: 'Request timeout. Please try again',
    NOT_FOUND: 'The requested resource was not found'
  }
};

module.exports = {
  ApiConstants,
  UiSelectors,
  TestDataConstants,
  EnvironmentConstants,
  BrowserConstants,
  TestTagConstants,
  ErrorMessages
};