module.exports.config = {
  name: 'Basic Configuration - No Dependencies',
  
  // BDD feature files configuration
  tests: './features/*.feature',
  output: './output',
  
  // Only REST helper - most reliable
  helpers: {
    REST: {
      endpoint: 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  },
  
  // BDD Configuration
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/*_steps.js']
  },
  
  // Timeout configuration
  timeout: 30000
};