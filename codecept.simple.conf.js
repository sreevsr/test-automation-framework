module.exports.config = {
  name: 'Simple Test Configuration',
  
  // Test files configuration
  tests: './tests/**/*_test.js',
  output: './output',
  
  // Only REST API helper for testing
  helpers: {
    REST: {
      endpoint: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  },
  
  // Include configuration
  include: {
    // API Endpoints
    UserAPI: './api/UserAPI.js'
  },
  
  // Gherkin BDD configuration
  gherkin: {
    features: './features/**/*.feature',
    steps: './step_definitions/**/*.js'
  },
  
  // Plugins - minimal set
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  },
  
  // Bootstrap and teardown
  bootstrap: async () => {
    console.log('🚀 Starting Simple Test Framework...');
    
    // Set up output directory
    const fs = require('fs');
    if (!fs.existsSync('./output')) {
      fs.mkdirSync('./output', { recursive: true });
    }
    
    // Set up minimal global utilities (same as main framework)
    const { faker } = require('@faker-js/faker');
    global.testUtils = {
      generateRandomEmail: () => faker.internet.email(),
      generateRandomName: () => faker.person.fullName(),
      generateRandomPhone: () => faker.phone.number(),
      generateRandomString: (length = 10) => faker.string.alphanumeric(length)
    };
    
    console.log('✅ Framework ready');
  },
  
  teardown: async () => {
    console.log('✅ Tests completed');
  },
  
  // Mocha configuration
  mocha: {
    timeout: 30000,
    reporter: 'spec'
  }
};