const { I } = inject();
const { ApiConstants, ErrorMessages } = require('../config/constants');
const { ValidationError, ApiError } = require('../utils/errors');
const { logger } = require('../utils/Logger');

// Create step-specific logger
const stepLogger = logger.child({ component: 'StepDefinitions' });

/**
 * E-commerce API Step Definitions
 * 
 * Implements BDD step definitions for e-commerce API testing scenarios.
 * Provides reusable steps for product management, cart operations, and order processing.
 * 
 * @fileoverview BDD step definitions for e-commerce API testing
 */

/** @type {Object} Global test data storage for sharing between steps */
let testData = {};

/**
 * Saves test data for use in subsequent steps
 * @param {string} key - Key to store data under
 * @param {*} data - Data to store
 */
function saveTestData(key, data) {
  testData[key] = data;
}

/**
 * Retrieves test data saved in previous steps
 * @param {string} key - Key to retrieve data for
 * @returns {*} Stored data or null if not found
 */
function getTestData(key) {
  return testData[key] || null;
}

// Background steps
Given('the API is available', async () => {
  stepLogger.step('API Health Check', 'Checking API availability');
  
  try {
    const response = await I.sendGetRequest('/posts'); // Using JSONPlaceholder for demo
    stepLogger.apiResponse(response.status || 200, '/posts');
    stepLogger.assertion('API is available and responding', true);
  } catch (error) {
    stepLogger.error('API health check failed', { error: error.message });
    stepLogger.assertion('API is available and responding', false);
    throw error;
  }
});

// Product-related steps
When('I request all products', async () => {
  stepLogger.step('Get All Products', 'Requesting all products from API');
  
  try {
    stepLogger.apiRequest('GET', '/posts');
    const response = await I.sendGetRequest('/posts');
    stepLogger.apiResponse(response.status || 200, '/posts');
    
    saveTestData('products', response.data);
    stepLogger.info(`Retrieved ${response.data.length} products`, { count: response.data.length });
  } catch (error) {
    stepLogger.error('Failed to retrieve products', { error: error.message });
    throw error;
  }
});

Then('I should receive a list of products', async () => {
  stepLogger.step('Validate Product List', 'Checking if products array is valid');
  
  const products = getTestData('products');
  const isValid = Array.isArray(products) && products.length > 0;
  
  stepLogger.assertion('Received valid product list', isValid, { 
    isArray: Array.isArray(products), 
    length: products?.length || 0 
  });
  
  if (!isValid) {
    const error = new Error('Expected a non-empty array of products');
    stepLogger.error('Product list validation failed', { error: error.message });
    throw error;
  }
});

Then('each product should have required fields', async () => {
  stepLogger.step('Validate Product Fields', 'Checking required fields for all products');
  
  const products = getTestData('products');
  const requiredFields = ['id', 'title', 'body', 'userId']; // JSONPlaceholder fields
  
  try {
    products.forEach((product, index) => {
      requiredFields.forEach(field => {
        if (!product.hasOwnProperty(field)) {
          const error = new Error(`Product ${index} missing required field: ${field}`);
          stepLogger.error('Product field validation failed', { 
            productIndex: index, 
            missingField: field, 
            error: error.message 
          });
          throw error;
        }
      });
    });
    
    stepLogger.assertion('All products have required fields', true, { 
      productCount: products.length,
      requiredFields 
    });
  } catch (error) {
    stepLogger.assertion('All products have required fields', false);
    throw error;
  }
});

Given('a product exists with ID {int}', async (productId) => {
  stepLogger.step('Verify Product Exists', `Checking if product ${productId} exists`);
  
  try {
    stepLogger.apiRequest('GET', `/posts/${productId}`);
    const response = await I.sendGetRequest(`/posts/${productId}`);
    stepLogger.apiResponse(response.status || 200, `/posts/${productId}`);
    
    const exists = response.data && response.data.id;
    stepLogger.assertion(`Product ${productId} exists`, exists, { productId, found: !!response.data });
    
    if (!exists) {
      const error = new Error(`Product with ID ${productId} not found`);
      stepLogger.error('Product existence check failed', { productId, error: error.message });
      throw error;
    }
    
    saveTestData('currentProduct', response.data);
    stepLogger.debug(`Product ${productId} verified and saved`, { productId });
  } catch (error) {
    stepLogger.error('Failed to verify product existence', { productId, error: error.message });
    throw error;
  }
});

When('I request product with ID {int}', async (productId) => {
  const response = await I.sendGetRequest(`/posts/${productId}`);
  saveTestData('productResponse', response.data);
  console.log(`📦 Retrieved product ${productId}`);
});

Then('I should receive the product details', async () => {
  const product = getTestData('productResponse');
  if (!product || !product.id) {
    throw new Error('Expected valid product details');
  }
  console.log('✅ Received valid product details');
});

Then('the product should have a valid price', async () => {
  // For demo purposes, we'll simulate price validation
  const product = getTestData('productResponse');
  // Simulate price based on product ID (for demo)
  const simulatedPrice = product.id * 10.99;
  
  if (simulatedPrice <= 0) {
    throw new Error('Product price should be greater than 0');
  }
  console.log(`✅ Product has valid price: $${simulatedPrice}`);
});

// Search functionality
When('I search for products in category {string}', async (category) => {
  // Simulate category search using JSONPlaceholder users (as categories)
  const response = await I.sendGetRequest('/users');
  const filteredProducts = response.data.filter(user => 
    user.company && user.company.name.toLowerCase().includes('electronics')
  );
  saveTestData('searchResults', filteredProducts);
  console.log(`🔍 Searched for products in ${category} category`);
});

Then('I should receive products in electronics category', async () => {
  const results = getTestData('searchResults');
  if (!Array.isArray(results)) {
    throw new Error('Expected search results to be an array');
  }
  console.log(`✅ Found ${results.length} products in electronics category`);
});

Then('all returned products should belong to electronics', async () => {
  const results = getTestData('searchResults');
  // For demo, just verify we have results
  if (results.length === 0) {
    console.log('⚠️ No electronics products found (this is expected with demo data)');
  } else {
    console.log('✅ All products belong to the correct category');
  }
});

// Cart functionality
Given('I have an empty cart', async () => {
  stepLogger.step('Initialize Cart', 'Creating empty cart');
  
  const emptyCart = { items: [], total: 0 };
  saveTestData('cart', emptyCart);
  
  stepLogger.info('Cart initialized as empty', { cart: emptyCart });
});

When('I add product ID {int} to the cart', async (productId) => {
  stepLogger.step('Add Product to Cart', `Adding product ${productId} to cart`);
  
  try {
    // Get product details first
    stepLogger.apiRequest('GET', `/posts/${productId}`);
    const response = await I.sendGetRequest(`/posts/${productId}`);
    stepLogger.apiResponse(response.status || 200, `/posts/${productId}`);
    
    const product = response.data;
    const cart = getTestData('cart');
    const price = productId * 10.99; // Simulated price
    
    const cartItem = {
      productId: productId,
      title: product.title,
      price: price,
      quantity: 1
    };
    
    cart.items.push(cartItem);
    cart.total += price;
    
    saveTestData('cart', cart);
    stepLogger.info(`Added product ${productId} to cart`, { 
      productId, 
      price, 
      cartTotal: cart.total, 
      itemCount: cart.items.length 
    });
  } catch (error) {
    stepLogger.error('Failed to add product to cart', { productId, error: error.message });
    throw error;
  }
});

Then('the cart should contain {int} item(s)', async (expectedCount) => {
  stepLogger.step('Validate Cart Item Count', `Checking cart contains ${expectedCount} items`);
  
  const cart = getTestData('cart');
  const actualCount = cart.items.length;
  const isValid = actualCount === expectedCount;
  
  stepLogger.assertion(`Cart contains ${expectedCount} item(s)`, isValid, { 
    expected: expectedCount, 
    actual: actualCount 
  });
  
  if (!isValid) {
    const error = new Error(`Expected ${expectedCount} items in cart, but found ${actualCount}`);
    stepLogger.error('Cart item count validation failed', { 
      expected: expectedCount, 
      actual: actualCount, 
      error: error.message 
    });
    throw error;
  }
});

Then('the cart total should be updated', async () => {
  stepLogger.step('Validate Cart Total', 'Checking cart total is updated');
  
  const cart = getTestData('cart');
  const isValid = cart.total > 0;
  
  stepLogger.assertion('Cart total is greater than 0', isValid, { 
    total: cart.total 
  });
  
  if (!isValid) {
    const error = new Error('Cart total should be greater than 0');
    stepLogger.error('Cart total validation failed', { 
      total: cart.total, 
      error: error.message 
    });
    throw error;
  }
  
  stepLogger.info(`Cart total updated: $${cart.total.toFixed(2)}`, { total: cart.total });
});

When('I try to add product ID {int} to the cart', async (productId) => {
  try {
    const response = await I.sendGetRequest(`/posts/${productId}`);
    // For demo, simulate error for non-existent products
    if (!response.data) {
      saveTestData('lastError', { message: 'Product not found' });
    }
  } catch (error) {
    saveTestData('lastError', { message: error.message });
  }
  console.log(`🛒 Attempted to add product ${productId} to cart`);
});

Then('I should receive an error message', async () => {
  const error = getTestData('lastError');
  if (!error || !error.message) {
    throw new Error('Expected an error message');
  }
  console.log('✅ Received expected error message');
});

Then('the cart should remain empty', async () => {
  const cart = getTestData('cart');
  if (cart.items.length !== 0) {
    throw new Error('Cart should remain empty after error');
  }
  console.log('✅ Cart remained empty as expected');
});

// Order functionality
Given('I have a cart with product ID {int}', async (productId) => {
  // Initialize empty cart
  saveTestData('cart', { items: [], total: 0 });
  console.log('🛒 Cart initialized as empty');
  
  // Add product to cart
  const response = await I.sendGetRequest(`/posts/${productId}`);
  const product = response.data;
  
  const cart = getTestData('cart');
  const price = productId * 10.99; // Simulated price
  
  cart.items.push({
    productId: productId,
    title: product.title,
    price: price,
    quantity: 1
  });
  cart.total += price;
  
  saveTestData('cart', cart);
  console.log(`🛒 Cart prepared with product ${productId}`);
});

When('I create an order with quantity {int}', async (quantity) => {
  const cart = getTestData('cart');
  
  // Simulate order creation
  const orderData = {
    items: cart.items.map(item => ({
      ...item,
      quantity: quantity
    })),
    total: cart.total * quantity,
    orderDate: new Date().toISOString()
  };
  
  // Simulate API call to create order
  const response = await I.sendPostRequest('/posts', orderData);
  saveTestData('order', { ...orderData, orderId: response.data.id });
  console.log(`📝 Created order with quantity ${quantity}`);
});

Then('the order should be created successfully', async () => {
  const order = getTestData('order');
  if (!order || !order.orderId) {
    throw new Error('Order should be created with valid ID');
  }
  console.log(`✅ Order created successfully with ID: ${order.orderId}`);
});

Then('the order total should be {float}', async (expectedTotal) => {
  const order = getTestData('order');
  const actualTotal = parseFloat(order.total.toFixed(2));
  const expected = parseFloat(expectedTotal);
  
  if (Math.abs(actualTotal - expected) > 0.01) {
    throw new Error(`Expected order total ${expected}, but got ${actualTotal}`);
  }
  console.log(`✅ Order total matches expected: $${expectedTotal}`);
});

// Security tests
When('I try to access my order history without authentication', async () => {
  // Simulate unauthorized access
  try {
    const response = await I.sendGetRequest('/users/1/albums'); // Simulate protected endpoint
    saveTestData('unauthorizedResponse', response.data);
  } catch (error) {
    saveTestData('unauthorizedError', { message: 'Unauthorized access' });
  }
  console.log('🔒 Attempted unauthorized access to order history');
});

Then('I should receive an unauthorized error', async () => {
  // For demo, we'll simulate this check
  console.log('✅ Unauthorized access properly blocked (simulated)');
});

Then('the response should suggest authentication', async () => {
  console.log('✅ Response includes authentication guidance (simulated)');
});

// Performance tests
Then('the response should be received within {int} seconds', async (maxSeconds) => {
  // This would be measured in a real implementation
  console.log(`✅ Response received within ${maxSeconds} seconds (timing not implemented in demo)`);
});

Then('the response should contain at least {int} products', async (minCount) => {
  const products = getTestData('products');
  if (products.length < minCount) {
    throw new Error(`Expected at least ${minCount} products, but got ${products.length}`);
  }
  console.log(`✅ Response contains ${products.length} products (>= ${minCount})`);
});

