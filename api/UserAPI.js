const { I } = inject();

class UserAPI {
  
  constructor() {
    this.endpoint = '/users';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  // Authentication
  async authenticate(email, password) {
    const response = await I.sendPostRequest('/auth/login', {
      email: email,
      password: password
    });
    
    if (response.data && response.data.token) {
      this.headers['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response;
  }
  
  async logout() {
    const response = await I.sendPostRequest('/auth/logout', {}, this.headers);
    delete this.headers['Authorization'];
    return response;
  }
  
  // User CRUD operations
  async createUser(userData) {
    return await I.sendPostRequest(this.endpoint, userData, this.headers);
  }
  
  async getUserById(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}`, this.headers);
  }
  
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return await I.sendGetRequest(url, this.headers);
  }
  
  async updateUser(userId, userData) {
    return await I.sendPutRequest(`${this.endpoint}/${userId}`, userData, this.headers);
  }
  
  async partialUpdateUser(userId, userData) {
    return await I.sendPatchRequest(`${this.endpoint}/${userId}`, userData, this.headers);
  }
  
  async deleteUser(userId) {
    return await I.sendDeleteRequest(`${this.endpoint}/${userId}`, this.headers);
  }
  
  // User search and filtering
  async searchUsers(searchQuery) {
    return await I.sendGetRequest(`${this.endpoint}/search?q=${encodeURIComponent(searchQuery)}`, this.headers);
  }
  
  async getUsersByRole(role) {
    return await I.sendGetRequest(`${this.endpoint}?role=${role}`, this.headers);
  }
  
  async getUsersByStatus(status) {
    return await I.sendGetRequest(`${this.endpoint}?status=${status}`, this.headers);
  }
  
  // User profile operations
  async getUserProfile(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/profile`, this.headers);
  }
  
  async updateUserProfile(userId, profileData) {
    return await I.sendPutRequest(`${this.endpoint}/${userId}/profile`, profileData, this.headers);
  }
  
  async uploadUserAvatar(userId, avatarFile) {
    return await I.sendPostRequest(
      `${this.endpoint}/${userId}/avatar`,
      { avatar: avatarFile },
      { ...this.headers, 'Content-Type': 'multipart/form-data' }
    );
  }
  
  // Password management
  async changePassword(userId, oldPassword, newPassword) {
    return await I.sendPostRequest(`${this.endpoint}/${userId}/change-password`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    }, this.headers);
  }
  
  async resetPassword(email) {
    return await I.sendPostRequest('/auth/reset-password', {
      email: email
    });
  }
  
  async verifyPasswordReset(token, newPassword) {
    return await I.sendPostRequest('/auth/verify-reset', {
      token: token,
      newPassword: newPassword
    });
  }
  
  // User permissions and roles
  async getUserPermissions(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/permissions`, this.headers);
  }
  
  async assignRoleToUser(userId, roleId) {
    return await I.sendPostRequest(`${this.endpoint}/${userId}/roles`, {
      roleId: roleId
    }, this.headers);
  }
  
  async removeRoleFromUser(userId, roleId) {
    return await I.sendDeleteRequest(`${this.endpoint}/${userId}/roles/${roleId}`, this.headers);
  }
  
  // User activity and audit
  async getUserActivity(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.endpoint}/${userId}/activity?${queryString}` 
      : `${this.endpoint}/${userId}/activity`;
    return await I.sendGetRequest(url, this.headers);
  }
  
  async getUserLoginHistory(userId) {
    return await I.sendGetRequest(`${this.endpoint}/${userId}/login-history`, this.headers);
  }
  
  // Bulk operations
  async bulkCreateUsers(usersArray) {
    return await I.sendPostRequest(`${this.endpoint}/bulk`, {
      users: usersArray
    }, this.headers);
  }
  
  async bulkUpdateUsers(updates) {
    return await I.sendPatchRequest(`${this.endpoint}/bulk`, {
      updates: updates
    }, this.headers);
  }
  
  async bulkDeleteUsers(userIds) {
    return await I.sendDeleteRequest(`${this.endpoint}/bulk`, {
      userIds: userIds
    }, this.headers);
  }
  
  // Validation helpers
  async validateUserCreation(userData) {
    const response = await this.createUser(userData);
    
    I.seeResponseCodeIs(201);
    I.seeResponseContainsJson({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    
    return response;
  }
  
  async validateUserNotFound(userId) {
    const response = await this.getUserById(userId);
    I.seeResponseCodeIs(404);
    return response;
  }
  
  async validateUnauthorizedAccess() {
    const originalHeaders = { ...this.headers };
    delete this.headers['Authorization'];
    
    const response = await this.getAllUsers();
    I.seeResponseCodeIs(401);
    
    this.headers = originalHeaders;
    return response;
  }
  
  // Test data generators
  generateUserData(overrides = {}) {
    return {
      firstName: global.testUtils.generateRandomName().split(' ')[0],
      lastName: global.testUtils.generateRandomName().split(' ')[1],
      email: global.testUtils.generateRandomEmail(),
      password: 'Test123!',
      role: 'user',
      status: 'active',
      ...overrides
    };
  }
  
  generateBulkUsers(count = 5) {
    return Array.from({ length: count }, () => this.generateUserData());
  }
  
  // Cleanup helpers
  async cleanupTestUsers(testEmails = []) {
    for (const email of testEmails) {
      try {
        const users = await this.searchUsers(email);
        if (users.data && users.data.length > 0) {
          await this.deleteUser(users.data[0].id);
        }
      } catch (error) {
        console.log(`Failed to cleanup user ${email}: ${error.message}`);
      }
    }
  }
}

module.exports = new UserAPI();
module.exports.UserAPI = UserAPI;