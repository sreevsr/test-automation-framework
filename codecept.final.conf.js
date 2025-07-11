module.exports.config = {
  name: 'Final Working Configuration',
  
  // BDD feature files
  tests: './features/*.feature',
  output: './output',
  
  // Only REST helper - guaranteed to work
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
  
  // Explicitly list step definition files instead of using glob pattern
  gherkin: {
    features: './features/*.feature',
    steps: [
      './step_definitions/ecommerce_api_steps.js',
      './step_definitions/login_steps.js'
    ]
  },
  
  // Timeout
  timeout: 30000,
  
  // Minimal bootstrap
  bootstrap: null,
  teardown: null
};