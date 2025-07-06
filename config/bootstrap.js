// Global setup before all tests
const { faker } = require('@faker-js/faker');

module.exports = async () => {
  console.log('🚀 Starting Test Automation Framework...');
  
  // Set up global test data
  global.faker = faker;
  
  // Set up global utilities
  global.testUtils = {
    generateRandomEmail: () => faker.internet.email(),
    generateRandomName: () => faker.person.fullName(),
    generateRandomPhone: () => faker.phone.number(),
    generateRandomString: (length = 10) => faker.string.alphanumeric(length),
    generateRandomNumber: (min = 1, max = 100) => faker.number.int({ min, max }),
    getCurrentTimestamp: () => new Date().toISOString(),
    getFormattedDate: (format = 'YYYY-MM-DD') => {
      const moment = require('moment');
      return moment().format(format);
    }
  };
  
  // Create output directories if they don't exist
  const fs = require('fs');
  const outputDirs = [
    './output',
    './output/screenshots',
    './output/videos',
    './output/allure-results',
    './output/allure-reports',
    './output/logs'
  ];
  
  outputDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Set up logging
  const winston = require('winston');
  global.logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: './output/logs/test.log' }),
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });
  
  console.log('✅ Framework initialization completed');
};