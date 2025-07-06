const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// Enable headless mode when running in CI
setHeadlessWhen(process.env.CI);

// Enable common plugins
setCommonPlugins();

module.exports.config = {
  name: 'Comprehensive Test Automation Framework',
  
  // Test files configuration
  tests: './tests/**/*_test.js',
  output: './output',
  
  // Helpers configuration for different platforms
  helpers: {
    // Web UI Testing with Playwright
    Playwright: {
      url: process.env.BASE_URL || 'https://httpbin.org',
      browser: 'chromium',
      show: !process.env.CI,
      windowSize: '1920x1080',
      waitForNavigation: 'networkidle',
      waitForAction: 1000,
      timeout: 30000,
      chromium: {
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    },
    
    // API Testing
    REST: {
      endpoint: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    
    // Mobile Web Testing
    WebDriver: {
      url: process.env.BASE_URL || 'https://httpbin.org',
      browser: 'chrome',
      host: process.env.SELENIUM_HOST || 'localhost',
      port: process.env.SELENIUM_PORT || 4444,
      restart: false,
      windowSize: 'maximize',
      desiredCapabilities: {
        chromeOptions: {
          mobileEmulation: {
            deviceName: 'iPhone 12 Pro'
          }
        }
      }
    },
    
    // Mobile App Testing with Appium
    Appium: {
      platform: 'Android',
      desiredCapabilities: {
        platformName: 'Android',
        platformVersion: process.env.ANDROID_VERSION || '11.0',
        deviceName: process.env.DEVICE_NAME || 'emulator-5554',
        automationName: 'UiAutomator2',
        app: process.env.APP_PATH || './apps/sample-app.apk',
        appPackage: process.env.APP_PACKAGE || 'com.example.app',
        appActivity: process.env.APP_ACTIVITY || '.MainActivity',
        newCommandTimeout: 300
      },
      host: process.env.APPIUM_HOST || 'localhost',
      port: process.env.APPIUM_PORT || 4723,
      restart: false
    },
    
    // Custom helpers
    DataHelper: {
      require: './helpers/DataHelper.js'
    },
    AssertionHelper: {
      require: './helpers/AssertionHelper.js'
    },
    DatabaseHelper: {
      require: './helpers/DatabaseHelper.js'
    }
  },
  
  // Include configuration
  include: {
    // Page Objects
    LoginPage: './pages/web/LoginPage.js',
    DashboardPage: './pages/web/DashboardPage.js',
    ProductPage: './pages/web/ProductPage.js',
    
    // Mobile Pages
    MobileLoginPage: './pages/mobile/MobileLoginPage.js',
    MobileHomePage: './pages/mobile/MobileHomePage.js',
    
    // API Endpoints
    UserAPI: './api/UserAPI.js',
    ProductAPI: './api/ProductAPI.js',
    OrderAPI: './api/OrderAPI.js'
  },
  
  // Gherkin BDD configuration
  gherkin: {
    features: './features/**/*.feature',
    steps: './step_definitions/**/*.js'
  },
  
  // Plugins
  plugins: {
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      resultsDir: './output/allure-results'
    },
    
    retryFailedStep: {
      enabled: true,
      retries: 3
    },
    
    screenshotOnFail: {
      enabled: true
    },
    
    stepByStepReport: {
      enabled: false
    },
    
    pauseOnFail: {
      enabled: !process.env.CI
    }
  },
  
  // Multiple browser configurations for parallel execution
  multiple: {
    parallel: {
      chunks: 3,
      browsers: [
        {
          browser: 'chromium'
        },
        {
          browser: 'firefox'
        },
        {
          browser: 'webkit'
        }
      ]
    },
    
    smoke: {
      grep: '@smoke',
      browsers: ['chromium']
    },
    
    regression: {
      grep: '@regression',
      browsers: ['chromium', 'firefox']
    }
  },
  
  // Bootstrap and teardown
  bootstrap: async () => {
    const bootstrapFn = require('./config/bootstrap.js');
    await bootstrapFn();
  },
  teardown: async () => {
    const teardownFn = require('./config/teardown.js');
    await teardownFn();
  },
  
  // Mocha configuration
  mocha: {
    timeout: 60000,
    reporter: 'spec'
  },
  
  // Environment variables
  require: ['./config/environment.js']
};

// Environment-specific configurations
const environment = process.env.NODE_ENV || 'test';

if (environment === 'staging') {
  module.exports.config.helpers.Playwright.url = 'https://staging.example.com';
  module.exports.config.helpers.REST.endpoint = 'https://api-staging.example.com';
}

if (environment === 'production') {
  module.exports.config.helpers.Playwright.url = 'https://example.com';
  module.exports.config.helpers.REST.endpoint = 'https://api.example.com';
}