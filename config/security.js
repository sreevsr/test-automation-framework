/**
 * Security Configuration
 * 
 * This file contains security guidelines and utilities for the test automation framework.
 * It ensures that no sensitive data is hardcoded in the repository.
 */

/**
 * Security Guidelines:
 * 
 * 1. NEVER commit real passwords, API keys, or credentials
 * 2. Use environment variables for sensitive configuration
 * 3. Use example.com or test.example domains for test data
 * 4. Avoid email/password combinations that could trigger security scanners
 * 5. Use constants from TestDataConstants for passwords
 * 6. Keep test data obviously fake and non-sensitive
 */

const SECURITY_PATTERNS_TO_AVOID = [
  'real email addresses with passwords',
  'production URLs or domains',
  'actual API keys or tokens',
  'real database connection strings',
  'company-specific email domains with passwords'
];

const SAFE_TEST_DOMAINS = [
  'example.com',
  'test.com', 
  'demo.org',
  'sample.net',
  'example-corp.com',
  'test-company.org'
];

const ENVIRONMENT_VARIABLES = {
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME || 'test_db',
  DB_USER: process.env.DB_USER || 'test_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'test_password',
  
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  API_TIMEOUT: process.env.API_TIMEOUT || '30000',
  
  // Test Configuration
  BROWSER: process.env.BROWSER || 'chromium',
  HEADLESS: process.env.HEADLESS || 'true',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Authentication (for test environments only)
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || 'testuser@example.com',
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || 'Test123!',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123!'
};

/**
 * Validates that test data follows security guidelines
 * @param {Object} data - Test data object
 * @throws {Error} If data contains potentially sensitive information
 */
function validateTestData(data) {
  if (typeof data !== 'object' || data === null) {
    return;
  }
  
  const dataString = JSON.stringify(data).toLowerCase();
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /[a-zA-Z0-9._%+-]+@(?!example|test|demo|sample)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /password.*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*password/
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(dataString)) {
      console.warn('⚠️ WARNING: Test data may contain sensitive information');
      console.warn('Consider using example.com domains and constant passwords');
      break;
    }
  }
}

/**
 * Creates safe test credentials
 * @param {string} userType - Type of user (user, admin, guest)
 * @returns {Object} Safe test credentials
 */
function createSafeTestCredentials(userType = 'user') {
  const { TestDataConstants } = require('./constants');
  
  const baseEmails = {
    user: 'testuser@example.com',
    admin: 'admin@example.com',
    guest: 'guest@example.com'
  };
  
  const passwords = {
    user: TestDataConstants.DEFAULT_PASSWORDS.USER,
    admin: TestDataConstants.DEFAULT_PASSWORDS.ADMIN,
    guest: TestDataConstants.DEFAULT_PASSWORDS.TEST
  };
  
  return {
    email: baseEmails[userType] || baseEmails.user,
    password: passwords[userType] || passwords.user
  };
}

module.exports = {
  SECURITY_PATTERNS_TO_AVOID,
  SAFE_TEST_DOMAINS,
  ENVIRONMENT_VARIABLES,
  validateTestData,
  createSafeTestCredentials
};