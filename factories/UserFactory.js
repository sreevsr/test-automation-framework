const { TestDataConstants } = require('../config/constants');

/**
 * UserFactory - Factory for generating test user data
 * 
 * Provides methods to create various types of user data for testing purposes.
 * Supports different user roles, statuses, and data patterns.
 * 
 * @class UserFactory
 * @example
 * const userFactory = new UserFactory();
 * const user = userFactory.create({ role: 'admin' });
 * const users = userFactory.createBatch(5);
 */
class UserFactory {
  
  /**
   * Creates a new UserFactory instance
   * @constructor
   */
  constructor() {
    this.sequenceCounters = new Map();
  }
  
  /**
   * Creates a user with specified attributes
   * @param {Object} [attributes={}] - User attributes to override defaults
   * @returns {Object} Generated user data
   */
  create(attributes = {}) {
    const defaults = this._getDefaultUserData();
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates an admin user
   * @param {Object} [attributes={}] - Additional attributes
   * @returns {Object} Admin user data
   */
  createAdmin(attributes = {}) {
    return this.create({
      role: TestDataConstants.USER_ROLES.ADMIN,
      password: TestDataConstants.DEFAULT_PASSWORDS.ADMIN,
      permissions: ['read', 'write', 'delete', 'admin'],
      ...attributes
    });
  }
  
  /**
   * Creates a standard user
   * @param {Object} [attributes={}] - Additional attributes
   * @returns {Object} Standard user data
   */
  createUser(attributes = {}) {
    return this.create({
      role: TestDataConstants.USER_ROLES.USER,
      password: TestDataConstants.DEFAULT_PASSWORDS.USER,
      permissions: ['read', 'write'],
      ...attributes
    });
  }
  
  /**
   * Creates a guest user
   * @param {Object} [attributes={}] - Additional attributes
   * @returns {Object} Guest user data
   */
  createGuest(attributes = {}) {
    return this.create({
      role: TestDataConstants.USER_ROLES.GUEST,
      password: TestDataConstants.DEFAULT_PASSWORDS.TEST,
      permissions: ['read'],
      status: TestDataConstants.USER_STATUS.PENDING,
      ...attributes
    });
  }
  
  /**
   * Creates a batch of users
   * @param {number} count - Number of users to create
   * @param {Object} [attributes={}] - Common attributes for all users
   * @returns {Array<Object>} Array of user data objects
   */
  createBatch(count, attributes = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(this.create({
        ...attributes,
        email: this._generateUniqueEmail(attributes.email)
      }));
    }
    return users;
  }
  
  /**
   * Creates users with different roles
   * @param {Object} [counts] - Number of users per role
   * @param {number} [counts.admin=1] - Number of admin users
   * @param {number} [counts.user=3] - Number of regular users
   * @param {number} [counts.guest=1] - Number of guest users
   * @returns {Array<Object>} Array of user data objects
   */
  createMixedRoles(counts = {}) {
    const { admin = 1, user = 3, guest = 1 } = counts;
    const users = [];
    
    // Create admin users
    for (let i = 0; i < admin; i++) {
      users.push(this.createAdmin());
    }
    
    // Create regular users
    for (let i = 0; i < user; i++) {
      users.push(this.createUser());
    }
    
    // Create guest users
    for (let i = 0; i < guest; i++) {
      users.push(this.createGuest());
    }
    
    return users;
  }
  
  /**
   * Creates a user with invalid data for negative testing
   * @param {string} [invalidField] - Field to make invalid
   * @returns {Object} User data with invalid field
   */
  createInvalid(invalidField = 'email') {
    const user = this.create();
    
    switch (invalidField) {
      case 'email':
        user.email = 'invalid-email';
        break;
      case 'password':
        user.password = '123'; // Too short
        break;
      case 'firstName':
        user.firstName = '';
        break;
      case 'lastName':
        user.lastName = null;
        break;
      case 'role':
        user.role = 'invalid-role';
        break;
      default:
        user[invalidField] = null;
    }
    
    return user;
  }
  
  /**
   * Creates a user with specific validation issues
   * @param {Array<string>} issues - Array of validation issues to create
   * @returns {Object} User data with validation issues
   */
  createWithValidationIssues(issues = ['email']) {
    const user = this.create();
    
    issues.forEach(issue => {
      switch (issue) {
        case 'email':
          user.email = 'invalid-email-format';
          break;
        case 'password':
          user.password = '123'; // Too short
          break;
        case 'firstName':
          user.firstName = '';
          break;
        case 'lastName':
          user.lastName = '';
          break;
        case 'long-email':
          user.email = 'a'.repeat(250) + '@example.com';
          break;
        case 'long-name':
          user.firstName = 'a'.repeat(100);
          break;
      }
    });
    
    return user;
  }
  
  /**
   * Creates user data for edge cases
   * @param {string} edgeCase - Type of edge case
   * @returns {Object} User data for edge case
   */
  createEdgeCase(edgeCase) {
    const user = this.create();
    
    switch (edgeCase) {
      case 'minimum-fields':
        return {
          firstName: 'A',
          lastName: 'B',
          email: 'a@b.co',
          password: 'Pass123!'
        };
      case 'maximum-fields':
        user.firstName = 'a'.repeat(TestDataConstants.LIMITS.MAX_USERNAME_LENGTH);
        user.lastName = 'b'.repeat(TestDataConstants.LIMITS.MAX_USERNAME_LENGTH);
        user.email = 'a'.repeat(TestDataConstants.LIMITS.MAX_EMAIL_LENGTH - 20) + '@example.com';
        break;
      case 'special-characters':
        user.firstName = "O'Connor";
        user.lastName = "José-María";
        user.email = 'user+test@example-domain.co.uk';
        break;
      case 'unicode':
        user.firstName = 'José';
        user.lastName = 'Müller';
        user.email = 'josé.müller@example.com';
        break;
      case 'suspended':
        user.status = TestDataConstants.USER_STATUS.SUSPENDED;
        break;
      case 'inactive':
        user.status = TestDataConstants.USER_STATUS.INACTIVE;
        break;
    }
    
    return user;
  }
  
  /**
   * Creates user data based on a template
   * @param {string} template - Template name
   * @param {Object} [overrides={}] - Field overrides
   * @returns {Object} User data based on template
   */
  createFromTemplate(template, overrides = {}) {
    const templates = {
      'complete-profile': {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        role: TestDataConstants.USER_ROLES.USER,
        status: TestDataConstants.USER_STATUS.ACTIVE,
        phone: '+1-555-123-4567',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        preferences: {
          notifications: true,
          theme: 'light',
          language: 'en'
        }
      },
      'minimal-profile': {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'Pass123!'
      },
      'corporate-user': {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@company.com',
        password: 'Corporate123!',
        role: TestDataConstants.USER_ROLES.USER,
        department: 'Engineering',
        employeeId: 'EMP001',
        manager: 'sarah.wilson@company.com'
      }
    };
    
    const templateData = templates[template];
    if (!templateData) {
      throw new Error(`Template '${template}' not found`);
    }
    
    return { ...templateData, ...overrides };
  }
  
  /**
   * Generates default user data
   * @private
   * @returns {Object} Default user data
   */
  _getDefaultUserData() {
    return {
      firstName: this._generateRandomName().split(' ')[0],
      lastName: this._generateRandomName().split(' ')[1],
      email: this._generateRandomEmail(),
      password: TestDataConstants.DEFAULT_PASSWORDS.TEST,
      role: TestDataConstants.USER_ROLES.USER,
      status: TestDataConstants.USER_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      profileCompleted: false
    };
  }
  
  /**
   * Generates a random name
   * @private
   * @returns {string} Random name
   */
  _generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }
  
  /**
   * Generates a random email
   * @private
   * @returns {string} Random email
   */
  _generateRandomEmail() {
    const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const username = 'user' + Math.floor(Math.random() * 10000);
    
    return `${username}@${domain}`;
  }
  
  /**
   * Generates a unique email using sequence counter
   * @private
   * @param {string} [baseEmail] - Base email to make unique
   * @returns {string} Unique email
   */
  _generateUniqueEmail(baseEmail) {
    if (!baseEmail) {
      baseEmail = this._generateRandomEmail();
    }
    
    const counter = this.sequenceCounters.get('email') || 0;
    this.sequenceCounters.set('email', counter + 1);
    
    const [username, domain] = baseEmail.split('@');
    return `${username}${counter}@${domain}`;
  }
  
  /**
   * Resets sequence counters
   */
  resetSequenceCounters() {
    this.sequenceCounters.clear();
  }
}

module.exports = UserFactory;