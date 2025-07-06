const Helper = require('@codeceptjs/helper');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { faker } = require('@faker-js/faker');

class DataHelper extends Helper {
  
  // Generate test data
  generateUser(overrides = {}) {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test123!',
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      },
      ...overrides
    };
  }
  
  generateProduct(overrides = {}) {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      ...overrides
    };
  }
  
  generateOrder(overrides = {}) {
    return {
      orderId: faker.string.alphanumeric(10).toUpperCase(),
      customerId: faker.string.uuid(),
      orderDate: faker.date.recent(),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      total: parseFloat(faker.commerce.price(100, 1000)),
      ...overrides
    };
  }
  
  // Read data from files
  async readJsonFile(filePath) {
    try {
      const fullPath = path.resolve(filePath);
      const data = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
  }
  
  async readCsvFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const fullPath = path.resolve(filePath);
      
      fs.createReadStream(fullPath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
  
  // Data manipulation utilities
  getRandomItem(array) {
    return faker.helpers.arrayElement(array);
  }
  
  getRandomItems(array, count) {
    return faker.helpers.arrayElements(array, count);
  }
  
  shuffleArray(array) {
    return faker.helpers.shuffle([...array]);
  }
  
  // Environment-specific data
  getTestUserByRole(role = 'standard') {
    const users = {
      standard: {
        email: testConfig.users.standard.email,
        password: testConfig.users.standard.password
      },
      admin: {
        email: testConfig.users.admin.email,
        password: testConfig.users.admin.password
      }
    };
    
    return users[role] || users.standard;
  }
  
  // Date utilities
  getDateInFuture(days = 7) {
    return faker.date.future({ days });
  }
  
  getDateInPast(days = 7) {
    return faker.date.past({ days });
  }
  
  formatDate(date, format = 'MM/DD/YYYY') {
    const moment = require('moment');
    return moment(date).format(format);
  }
  
  // Validation utilities
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }
  
  // API response validation
  validateApiResponse(response, expectedSchema) {
    // Basic validation - can be enhanced with JSON schema validation
    if (!response) {
      throw new Error('Response is null or undefined');
    }
    
    if (expectedSchema) {
      Object.keys(expectedSchema).forEach(key => {
        if (!(key in response)) {
          throw new Error(`Missing required field: ${key}`);
        }
      });
    }
    
    return true;
  }
}

module.exports = DataHelper;