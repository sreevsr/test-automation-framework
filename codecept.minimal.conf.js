module.exports.config = {
  name: 'Minimal BDD Configuration',
  
  // BDD feature files configuration
  tests: './features/*.feature',
  output: './output',
  
  // Helpers configuration - REST only for reliability
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
  
  // Include configuration (optional for basic tests)
  include: {},
  
  // BDD Configuration
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/*_steps.js']
  },
  
  // Minimal plugins - no external dependencies
  plugins: {
    screenshotOnFail: {
      enabled: false  // Disabled since no browser for API tests
    }
  },
  
  // Timeout configuration
  timeout: 30000,
  
  // Bootstrap and teardown
  bootstrap: null,
  teardown: null,
  
  // Hooks
  hooks: []
};