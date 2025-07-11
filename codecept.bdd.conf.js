const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// Enable headless mode when running in CI
setHeadlessWhen(process.env.CI);

// Enable common plugins
setCommonPlugins();

module.exports.config = {
  name: 'BDD Test Configuration',
  
  // BDD feature files configuration
  tests: './features/*.feature',
  output: './output',
  
  // Helpers configuration
  helpers: {
    // REST API Testing
    REST: {
      endpoint: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    
    // Web UI Testing with Playwright (for UI tests)
    Playwright: {
      url: process.env.BASE_URL || 'https://example.com',
      browser: 'chromium',
      show: !process.env.CI,
      windowSize: '1920x1080',
      waitForNavigation: 'networkidle',
      waitForAction: 1000,
      timeout: 30000,
      chromium: {
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    }
  },
  
  // Include configuration
  include: {
    I: './steps_file.js',
    userAPI: './api/UserAPI.js',
    loginPage: './pages/web/LoginPage.js'
  },
  
  // BDD Configuration
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/*_steps.js']
  },
  
  // Plugins
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy'
    },
    retryFailedStep: {
      enabled: true,
      retries: 2
    }
  },
  
  // Timeout configuration
  timeout: 30000,
  
  // Multiple browser configurations for parallel execution
  multiple: {
    parallel: {
      chunks: 2,
      browsers: ['chromium']
    }
  },
  
  // Bootstrap and teardown
  bootstrap: null,
  teardown: null,
  
  // Hooks
  hooks: [],
  
  // Test metadata
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: true,
          steps: true
        }
      }
    }
  }
};