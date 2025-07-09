const UserFactory = require('./UserFactory');

/**
 * TestDataFactory - Master factory for generating test data
 * 
 * Provides centralized access to all data factories and common test data
 * generation utilities. Manages data relationships and scenarios.
 * 
 * @class TestDataFactory
 * @example
 * const testData = new TestDataFactory();
 * const scenario = testData.createScenario('login-flow');
 * const user = testData.users.create({ role: 'admin' });
 */
class TestDataFactory {
  
  /**
   * Creates a new TestDataFactory instance
   * @constructor
   */
  constructor() {
    this.users = new UserFactory();
    this.scenarios = new Map();
    this.globalSequence = 0;
  }
  
  /**
   * Creates a test scenario with related data
   * @param {string} scenarioName - Name of the scenario
   * @param {Object} [options={}] - Scenario options
   * @returns {Object} Scenario data
   */
  createScenario(scenarioName, options = {}) {
    const scenario = this._getScenarioTemplate(scenarioName);
    const customizedScenario = this._customizeScenario(scenario, options);
    
    // Store scenario for cleanup
    const scenarioId = this._generateScenarioId();
    this.scenarios.set(scenarioId, customizedScenario);
    
    return {
      id: scenarioId,
      name: scenarioName,
      data: customizedScenario
    };
  }
  
  /**
   * Creates product test data
   * @param {Object} [attributes={}] - Product attributes
   * @returns {Object} Product data
   */
  createProduct(attributes = {}) {
    const defaults = {
      id: this._generateId(),
      name: this._generateProductName(),
      description: this._generateProductDescription(),
      price: this._generatePrice(),
      category: this._generateCategory(),
      sku: this._generateSKU(),
      stock: Math.floor(Math.random() * 100) + 1,
      status: 'active',
      tags: this._generateTags(),
      images: this._generateImageUrls(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates order test data
   * @param {Object} [attributes={}] - Order attributes
   * @returns {Object} Order data
   */
  createOrder(attributes = {}) {
    const defaults = {
      id: this._generateId(),
      userId: this._generateId(),
      orderNumber: this._generateOrderNumber(),
      items: this._generateOrderItems(),
      subtotal: 0,
      tax: 0,
      shipping: 9.99,
      total: 0,
      status: 'pending',
      paymentMethod: 'credit_card',
      shippingAddress: this._generateAddress(),
      billingAddress: this._generateAddress(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Calculate totals
    defaults.subtotal = defaults.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    defaults.tax = defaults.subtotal * 0.08; // 8% tax
    defaults.total = defaults.subtotal + defaults.tax + defaults.shipping;
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates API test data
   * @param {string} endpoint - API endpoint
   * @param {Object} [attributes={}] - Request attributes
   * @returns {Object} API test data
   */
  createApiData(endpoint, attributes = {}) {
    const defaults = {
      endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      queryParams: {},
      body: null,
      expectedStatus: 200,
      timeout: 30000
    };
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates browser test data
   * @param {Object} [attributes={}] - Browser attributes
   * @returns {Object} Browser test data
   */
  createBrowserData(attributes = {}) {
    const defaults = {
      browser: 'chromium',
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      headless: true,
      slowMo: 0,
      timeout: 30000,
      retries: 2
    };
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates form test data
   * @param {string} formType - Type of form
   * @param {Object} [attributes={}] - Form attributes
   * @returns {Object} Form test data
   */
  createFormData(formType, attributes = {}) {
    const templates = {
      'login': {
        email: 'user@example.com',
        password: 'Test123!',
        rememberMe: false
      },
      'registration': {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        termsAccepted: true
      },
      'contact': {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        phone: '+1-555-123-4567'
      },
      'checkout': {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-123-4567',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        paymentMethod: 'credit_card',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123'
      }
    };
    
    const template = templates[formType];
    if (!template) {
      throw new Error(`Form template '${formType}' not found`);
    }
    
    return { ...template, ...attributes };
  }
  
  /**
   * Creates database test data
   * @param {string} table - Database table name
   * @param {Object} [attributes={}] - Record attributes
   * @returns {Object} Database test data
   */
  createDatabaseData(table, attributes = {}) {
    const defaults = {
      id: this._generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Creates test data for specific environments
   * @param {string} environment - Environment name
   * @param {Object} [attributes={}] - Environment-specific attributes
   * @returns {Object} Environment test data
   */
  createEnvironmentData(environment, attributes = {}) {
    const environmentData = {
      development: {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3001/api',
        database: 'test_db_dev',
        debug: true
      },
      staging: {
        baseUrl: 'https://staging.example.com',
        apiUrl: 'https://api-staging.example.com',
        database: 'test_db_staging',
        debug: false
      },
      production: {
        baseUrl: 'https://example.com',
        apiUrl: 'https://api.example.com',
        database: 'test_db_prod',
        debug: false
      }
    };
    
    const defaults = environmentData[environment];
    if (!defaults) {
      throw new Error(`Environment '${environment}' not found`);
    }
    
    return { ...defaults, ...attributes };
  }
  
  /**
   * Gets scenario template
   * @private
   * @param {string} scenarioName - Scenario name
   * @returns {Object} Scenario template
   */
  _getScenarioTemplate(scenarioName) {
    const templates = {
      'login-flow': {
        user: this.users.create(),
        loginData: this.createFormData('login'),
        expectedRedirect: '/dashboard'
      },
      'registration-flow': {
        user: this.users.create(),
        formData: this.createFormData('registration'),
        expectedRedirect: '/welcome'
      },
      'checkout-flow': {
        user: this.users.create(),
        products: [this.createProduct(), this.createProduct()],
        shippingAddress: this._generateAddress(),
        billingAddress: this._generateAddress(),
        paymentMethod: 'credit_card'
      },
      'api-crud': {
        createData: this.createApiData('/users', { method: 'POST' }),
        readData: this.createApiData('/users/1', { method: 'GET' }),
        updateData: this.createApiData('/users/1', { method: 'PUT' }),
        deleteData: this.createApiData('/users/1', { method: 'DELETE' })
      },
      'search-flow': {
        user: this.users.create(),
        searchQueries: ['laptop', 'smartphone', 'headphones'],
        expectedResults: [10, 15, 8],
        filters: ['category', 'price', 'brand']
      }
    };
    
    const template = templates[scenarioName];
    if (!template) {
      throw new Error(`Scenario template '${scenarioName}' not found`);
    }
    
    return template;
  }
  
  /**
   * Customizes scenario with options
   * @private
   * @param {Object} scenario - Base scenario
   * @param {Object} options - Customization options
   * @returns {Object} Customized scenario
   */
  _customizeScenario(scenario, options) {
    // Deep clone scenario to avoid mutation
    const customized = JSON.parse(JSON.stringify(scenario));
    
    // Apply customizations
    Object.entries(options).forEach(([key, value]) => {
      if (customized[key] && typeof customized[key] === 'object') {
        customized[key] = { ...customized[key], ...value };
      } else {
        customized[key] = value;
      }
    });
    
    return customized;
  }
  
  /**
   * Generates unique ID
   * @private
   * @returns {string} Unique ID
   */
  _generateId() {
    return `test_${Date.now()}_${++this.globalSequence}`;
  }
  
  /**
   * Generates scenario ID
   * @private
   * @returns {string} Scenario ID
   */
  _generateScenarioId() {
    return `scenario_${Date.now()}_${++this.globalSequence}`;
  }
  
  /**
   * Generates product name
   * @private
   * @returns {string} Product name
   */
  _generateProductName() {
    const adjectives = ['Premium', 'Professional', 'Standard', 'Deluxe', 'Basic'];
    const products = ['Laptop', 'Smartphone', 'Headphones', 'Monitor', 'Keyboard', 'Mouse'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    
    return `${adjective} ${product}`;
  }
  
  /**
   * Generates product description
   * @private
   * @returns {string} Product description
   */
  _generateProductDescription() {
    const descriptions = [
      'High-quality product with excellent performance and durability.',
      'Professional-grade item designed for demanding users.',
      'Reliable and efficient solution for everyday use.',
      'Premium quality with advanced features and sleek design.',
      'Versatile product suitable for various applications.'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  
  /**
   * Generates price
   * @private
   * @returns {number} Price
   */
  _generatePrice() {
    return Math.floor(Math.random() * 1000) + 10;
  }
  
  /**
   * Generates category
   * @private
   * @returns {string} Category
   */
  _generateCategory() {
    const categories = ['Electronics', 'Computers', 'Accessories', 'Audio', 'Gaming'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
  
  /**
   * Generates SKU
   * @private
   * @returns {string} SKU
   */
  _generateSKU() {
    const prefix = 'SKU';
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${number}`;
  }
  
  /**
   * Generates tags
   * @private
   * @returns {Array<string>} Tags
   */
  _generateTags() {
    const allTags = ['popular', 'new', 'sale', 'premium', 'bestseller', 'limited', 'featured'];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags = [];
    
    for (let i = 0; i < numTags; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return tags;
  }
  
  /**
   * Generates image URLs
   * @private
   * @returns {Array<string>} Image URLs
   */
  _generateImageUrls() {
    const count = Math.floor(Math.random() * 3) + 1;
    const urls = [];
    
    for (let i = 0; i < count; i++) {
      urls.push(`https://picsum.photos/600/400?random=${Math.random()}`);
    }
    
    return urls;
  }
  
  /**
   * Generates order number
   * @private
   * @returns {string} Order number
   */
  _generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
  
  /**
   * Generates order items
   * @private
   * @returns {Array<Object>} Order items
   */
  _generateOrderItems() {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    
    for (let i = 0; i < itemCount; i++) {
      items.push({
        productId: this._generateId(),
        name: this._generateProductName(),
        price: this._generatePrice(),
        quantity: Math.floor(Math.random() * 3) + 1,
        sku: this._generateSKU()
      });
    }
    
    return items;
  }
  
  /**
   * Generates address
   * @private
   * @returns {Object} Address
   */
  _generateAddress() {
    const streets = ['Main St', 'Oak Ave', 'Park Dr', 'First St', 'Second Ave'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    
    return {
      street: `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zip: Math.floor(Math.random() * 90000) + 10000,
      country: 'USA'
    };
  }
  
  /**
   * Cleans up scenario data
   * @param {string} scenarioId - Scenario ID to clean up
   * @returns {boolean} True if cleaned up successfully
   */
  cleanupScenario(scenarioId) {
    return this.scenarios.delete(scenarioId);
  }
  
  /**
   * Cleans up all scenarios
   */
  cleanupAllScenarios() {
    this.scenarios.clear();
  }
  
  /**
   * Resets all factories
   */
  reset() {
    this.users.resetSequenceCounters();
    this.scenarios.clear();
    this.globalSequence = 0;
  }
}

module.exports = TestDataFactory;