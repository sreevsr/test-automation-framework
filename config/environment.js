// Environment configuration loader
require('dotenv').config();

// Global test configuration
global.testConfig = {
  // URLs
  baseUrl: process.env.BASE_URL || 'https://httpbin.org',
  apiUrl: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
  
  // Timeouts
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
  apiTimeout: parseInt(process.env.API_TIMEOUT) || 15000,
  mobileTimeout: parseInt(process.env.MOBILE_TIMEOUT) || 60000,
  
  // Test users
  users: {
    standard: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    },
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    }
  },
  
  // Environment
  environment: process.env.NODE_ENV || 'test',
  isCI: process.env.CI === 'true',
  
  // Mobile configuration
  mobile: {
    android: {
      version: process.env.ANDROID_VERSION || '11.0',
      deviceName: process.env.DEVICE_NAME || 'emulator-5554',
      appPath: process.env.APP_PATH || './apps/sample-app.apk',
      appPackage: process.env.APP_PACKAGE || 'com.example.app',
      appActivity: process.env.APP_ACTIVITY || '.MainActivity'
    },
    ios: {
      version: process.env.IOS_VERSION || '15.0',
      deviceName: process.env.IOS_DEVICE_NAME || 'iPhone 12',
      appPath: process.env.IOS_APP_PATH || './apps/sample-app.app',
      bundleId: process.env.IOS_BUNDLE_ID || 'com.example.app'
    }
  }
};

// Export for use in other modules
module.exports = global.testConfig;