const Helper = require('@codeceptjs/helper');
const { expect } = require('chai');

class AssertionHelper extends Helper {
  
  // Enhanced web assertions
  async seeElementWithText(locator, expectedText) {
    const helper = this.helpers['Playwright'] || this.helpers['WebDriver'];
    const actualText = await helper.grabTextFrom(locator);
    
    expect(actualText.trim()).to.include(expectedText, 
      `Expected element ${locator} to contain "${expectedText}", but got "${actualText}"`);
  }
  
  async seeElementCount(locator, expectedCount) {
    const helper = this.helpers['Playwright'] || this.helpers['WebDriver'];
    const elements = await helper.grabNumberOfVisibleElements(locator);
    
    expect(elements).to.equal(expectedCount, 
      `Expected ${expectedCount} elements matching ${locator}, but found ${elements}`);
  }
  
  async seeElementAttribute(locator, attribute, expectedValue) {
    const helper = this.helpers['Playwright'] || this.helpers['WebDriver'];
    const actualValue = await helper.grabAttributeFrom(locator, attribute);
    
    expect(actualValue).to.equal(expectedValue, 
      `Expected ${attribute} to be "${expectedValue}", but got "${actualValue}"`);
  }
  
  async seeElementStyle(locator, property, expectedValue) {
    const helper = this.helpers['Playwright'] || this.helpers['WebDriver'];
    const actualValue = await helper.grabCssPropertyFrom(locator, property);
    
    expect(actualValue).to.include(expectedValue, 
      `Expected CSS property ${property} to contain "${expectedValue}", but got "${actualValue}"`);
  }
  
  // API response assertions
  async seeResponseCodeEquals(expectedCode) {
    const helper = this.helpers['REST'];
    const response = helper.response;
    
    expect(response.status).to.equal(expectedCode, 
      `Expected status code ${expectedCode}, but got ${response.status}`);
  }
  
  async seeResponseContainsJson(expectedJson) {
    const helper = this.helpers['REST'];
    const response = helper.response;
    
    expect(response.data).to.deep.include(expectedJson, 
      `Response does not contain expected JSON: ${JSON.stringify(expectedJson)}`);
  }
  
  async seeResponseTimeBelow(maxTime) {
    const helper = this.helpers['REST'];
    const responseTime = helper.response.config.metadata?.endTime - helper.response.config.metadata?.startTime;
    
    expect(responseTime).to.be.below(maxTime, 
      `Response time ${responseTime}ms exceeded maximum of ${maxTime}ms`);
  }
  
  async seeResponseHeaderEquals(headerName, expectedValue) {
    const helper = this.helpers['REST'];
    const actualValue = helper.response.headers[headerName.toLowerCase()];
    
    expect(actualValue).to.equal(expectedValue, 
      `Expected header ${headerName} to be "${expectedValue}", but got "${actualValue}"`);
  }
  
  async seeJsonSchema(schema) {
    const helper = this.helpers['REST'];
    const response = helper.response.data;
    
    // Basic schema validation - can be enhanced with ajv or joi
    Object.keys(schema).forEach(key => {
      expect(response).to.have.property(key, 
        `Response missing required property: ${key}`);
      
      if (schema[key].type) {
        expect(typeof response[key]).to.equal(schema[key].type, 
          `Property ${key} should be of type ${schema[key].type}`);
      }
    });
  }
  
  // Database assertions
  async seeInDatabase(table, conditions) {
    const helper = this.helpers['DatabaseHelper'];
    const result = await helper.queryDatabase(`SELECT * FROM ${table} WHERE ${conditions}`);
    
    expect(result.length).to.be.greaterThan(0, 
      `No records found in ${table} with conditions: ${conditions}`);
  }
  
  async dontSeeInDatabase(table, conditions) {
    const helper = this.helpers['DatabaseHelper'];
    const result = await helper.queryDatabase(`SELECT * FROM ${table} WHERE ${conditions}`);
    
    expect(result.length).to.equal(0, 
      `Found ${result.length} records in ${table} with conditions: ${conditions}, expected 0`);
  }
  
  // Mobile-specific assertions
  async seeAppIsInstalled(bundleId) {
    const helper = this.helpers['Appium'];
    const isInstalled = await helper.isAppInstalled(bundleId);
    
    expect(isInstalled).to.be.true(`App ${bundleId} is not installed`);
  }
  
  async seeElementOnScreen(locator) {
    const helper = this.helpers['Appium'];
    const isDisplayed = await helper.isElementDisplayed(locator);
    
    expect(isDisplayed).to.be.true(`Element ${locator} is not visible on screen`);
  }
  
  // Performance assertions
  async seePageLoadTimeBelow(maxTime) {
    const helper = this.helpers['Playwright'];
    const performanceEntries = await helper.executeScript(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigation = JSON.parse(performanceEntries)[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    expect(loadTime).to.be.below(maxTime, 
      `Page load time ${loadTime}ms exceeded maximum of ${maxTime}ms`);
  }
  
  // Custom business logic assertions
  async seeValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).to.be.true(`"${email}" is not a valid email format`);
  }
  
  async seeValidPhoneFormat(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    expect(phoneRegex.test(phone)).to.be.true(`"${phone}" is not a valid phone format`);
  }
  
  async seeNumberInRange(number, min, max) {
    expect(number).to.be.at.least(min, `Number ${number} is below minimum ${min}`);
    expect(number).to.be.at.most(max, `Number ${number} is above maximum ${max}`);
  }
  
  async seeArrayContains(array, expectedItem) {
    expect(array).to.include(expectedItem, 
      `Array does not contain expected item: ${expectedItem}`);
  }
  
  async seeArrayLength(array, expectedLength) {
    expect(array).to.have.lengthOf(expectedLength, 
      `Expected array length ${expectedLength}, but got ${array.length}`);
  }
}

module.exports = AssertionHelper;