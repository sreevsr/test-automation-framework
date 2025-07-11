// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    // Define custom steps here, they will be added to I object

    /**
     * Waits for a specified amount of time
     * @param {number} seconds - Number of seconds to wait
     */
    waitSeconds: function(seconds) {
      this.wait(seconds);
    },

    /**
     * Logs a message to console
     * @param {string} message - Message to log
     */
    logMessage: function(message) {
      console.log(`[TEST LOG] ${message}`);
    },

    /**
     * Generates a random email for testing
     * @returns {string} Random email address
     */
    generateRandomEmail: function() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `testuser${timestamp}${random}@example.com`;
    },

    /**
     * Generates a random string
     * @param {number} length - Length of the string
     * @returns {string} Random string
     */
    generateRandomString: function(length = 8) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    /**
     * Validates API response structure
     * @param {Object} response - API response to validate
     * @param {Array} requiredFields - Array of required field names
     */
    validateResponseStructure: function(response, requiredFields) {
      if (!response.data) {
        throw new Error('Response does not contain data field');
      }
      
      for (const field of requiredFields) {
        if (!response.data.hasOwnProperty(field)) {
          throw new Error(`Response missing required field: ${field}`);
        }
      }
    },

    /**
     * Sends GET request and validates response
     * @param {string} endpoint - API endpoint
     * @param {number} expectedStatus - Expected HTTP status code
     * @returns {Promise<Object>} API response
     */
    sendGetAndValidate: async function(endpoint, expectedStatus = 200) {
      const response = await this.sendGetRequest(endpoint);
      this.seeResponseCodeIs(expectedStatus);
      return response;
    },

    /**
     * Sends POST request and validates response
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {number} expectedStatus - Expected HTTP status code
     * @returns {Promise<Object>} API response
     */
    sendPostAndValidate: async function(endpoint, data, expectedStatus = 201) {
      const response = await this.sendPostRequest(endpoint, data);
      this.seeResponseCodeIs(expectedStatus);
      return response;
    }

  });
};