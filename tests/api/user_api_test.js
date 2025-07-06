Feature('API User Management Tests');

const { UserAPI } = inject();

let testUserId;
let testUserData;
let authToken;

BeforeSuite(async () => {
  console.log('🚀 Starting API User Management Tests Suite');
  
  // Authenticate for tests that require authorization
  const authResponse = await UserAPI.authenticate('admin@example.com', 'admin123');
  if (authResponse.status === 200) {
    authToken = authResponse.data.token;
    console.log('✅ Authentication successful');
  }
});

AfterSuite(async () => {
  // Cleanup test data
  if (testUserId) {
    try {
      await UserAPI.deleteUser(testUserId);
      console.log('✅ Test user cleaned up');
    } catch (e) {
      console.log('⚠️ Could not cleanup test user');
    }
  }
  
  console.log('✅ API User Management Tests Suite Completed');
});

Before(async () => {
  // Generate fresh test data for each test
  testUserData = UserAPI.generateUserData({
    email: `test-${Date.now()}@example.com`
  });
});

Scenario('Create new user via API @api @smoke @crud', async () => {
  // Act
  const response = await UserAPI.createUser(testUserData);
  
  // Assert
  I.seeResponseCodeIs(201);
  I.seeResponseContainsJson({
    email: testUserData.email,
    firstName: testUserData.firstName,
    lastName: testUserData.lastName,
    role: testUserData.role,
    status: testUserData.status
  });
  
  // Verify response structure
  I.seeResponseJsonMatchesSchema({
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    createdAt: { type: 'string' }
  });
  
  testUserId = response.data.id;
}).tag('@api').tag('@smoke').tag('@crud');

Scenario('Get user by ID @api @smoke @crud', async () => {
  // Arrange - Create a user first
  const createResponse = await UserAPI.createUser(testUserData);
  testUserId = createResponse.data.id;
  
  // Act
  const response = await UserAPI.getUserById(testUserId);
  
  // Assert
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    id: testUserId,
    email: testUserData.email,
    firstName: testUserData.firstName
  });
}).tag('@api').tag('@smoke').tag('@crud');

Scenario('Get all users with pagination @api @regression @pagination', async () => {
  // Act
  const response = await UserAPI.getAllUsers({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Assert
  I.seeResponseCodeIs(200);
  I.seeResponseJsonMatchesSchema({
    data: { type: 'array' },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        limit: { type: 'number' },
        total: { type: 'number' },
        totalPages: { type: 'number' }
      }
    }
  });
  
  // Verify pagination limits
  const users = response.data.data;
  I.assertTrue(users.length <= 10, 'Should not exceed page limit');
}).tag('@api').tag('@regression').tag('@pagination');

Scenario('Update user information @api @regression @crud', async () => {
  // Arrange - Create a user first
  const createResponse = await UserAPI.createUser(testUserData);
  testUserId = createResponse.data.id;
  
  const updateData = {
    firstName: 'UpdatedFirstName',
    lastName: 'UpdatedLastName',
    role: 'admin'
  };
  
  // Act
  const response = await UserAPI.updateUser(testUserId, updateData);
  
  // Assert
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson(updateData);
  
  // Verify changes persisted
  const getResponse = await UserAPI.getUserById(testUserId);
  I.seeResponseContainsJson(updateData);
}).tag('@api').tag('@regression').tag('@crud');

Scenario('Delete user @api @regression @crud', async () => {
  // Arrange - Create a user first
  const createResponse = await UserAPI.createUser(testUserData);
  const userIdToDelete = createResponse.data.id;
  
  // Act
  const response = await UserAPI.deleteUser(userIdToDelete);
  
  // Assert
  I.seeResponseCodeIs(204);
  
  // Verify user is deleted
  await UserAPI.validateUserNotFound(userIdToDelete);
}).tag('@api').tag('@regression').tag('@crud');

Scenario('Search users by email @api @regression @search', async () => {
  // Arrange - Create a user with unique email
  const uniqueEmail = `search-test-${Date.now()}@example.com`;
  testUserData.email = uniqueEmail;
  const createResponse = await UserAPI.createUser(testUserData);
  testUserId = createResponse.data.id;
  
  // Act
  const response = await UserAPI.searchUsers(uniqueEmail);
  
  // Assert
  I.seeResponseCodeIs(200);
  I.assertTrue(response.data.length >= 1, 'Should find at least one user');
  
  const foundUser = response.data.find(user => user.email === uniqueEmail);
  I.assertNotNull(foundUser, 'Should find user with exact email');
}).tag('@api').tag('@regression').tag('@search');

Scenario('Filter users by role @api @regression @filter', async () => {
  // Act
  const response = await UserAPI.getUsersByRole('admin');
  
  // Assert
  I.seeResponseCodeIs(200);
  
  // Verify all returned users have admin role
  response.data.forEach(user => {
    I.assertEqual(user.role, 'admin', 'All users should have admin role');
  });
}).tag('@api').tag('@regression').tag('@filter');

Scenario('User creation validation @api @regression @validation', async () => {
  const invalidUserData = [
    { ...testUserData, email: '' }, // Missing email
    { ...testUserData, email: 'invalid-email' }, // Invalid email format
    { ...testUserData, firstName: '' }, // Missing firstName
    { ...testUserData, password: '123' }, // Weak password
  ];
  
  for (const invalidData of invalidUserData) {
    const response = await UserAPI.createUser(invalidData);
    I.seeResponseCodeIs(400);
    I.seeResponseContainsJson({
      error: 'Validation failed'
    });
  }
}).tag('@api').tag('@regression').tag('@validation');

Scenario('Unauthorized access handling @api @security @auth', async () => {
  // Test without authentication
  await UserAPI.validateUnauthorizedAccess();
}).tag('@api').tag('@security').tag('@auth');

Scenario('Rate limiting test @api @security @ratelimit', async () => {
  const requests = [];
  
  // Send multiple rapid requests
  for (let i = 0; i < 10; i++) {
    requests.push(UserAPI.getAllUsers());
  }
  
  const responses = await Promise.all(requests);
  
  // Check if any responses indicate rate limiting (status 429)
  const rateLimitedResponses = responses.filter(r => r.status === 429);
  
  if (rateLimitedResponses.length > 0) {
    console.log(`✅ Rate limiting is working: ${rateLimitedResponses.length} requests were rate limited`);
  }
}).tag('@api').tag('@security').tag('@ratelimit');

Scenario('API response time performance @api @performance', async () => {
  const startTime = Date.now();
  
  // Act
  await UserAPI.getAllUsers();
  
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  // Assert
  I.assertTrue(responseTime < 2000, `API response time ${responseTime}ms should be under 2 seconds`);
}).tag('@api').tag('@performance');

Scenario('Bulk user operations @api @regression @bulk', async () => {
  // Generate multiple users
  const bulkUsers = UserAPI.generateBulkUsers(5);
  
  // Act - Create multiple users
  const createResponse = await UserAPI.bulkCreateUsers(bulkUsers);
  
  // Assert
  I.seeResponseCodeIs(201);
  I.assertTrue(createResponse.data.created.length === 5, 'Should create 5 users');
  
  // Cleanup
  const userIds = createResponse.data.created.map(user => user.id);
  await UserAPI.bulkDeleteUsers(userIds);
}).tag('@api').tag('@regression').tag('@bulk');

Scenario('User password management @api @regression @password', async () => {
  // Arrange - Create a user first
  const createResponse = await UserAPI.createUser(testUserData);
  testUserId = createResponse.data.id;
  
  // Act - Change password
  const response = await UserAPI.changePassword(testUserId, testUserData.password, 'NewPassword123!');
  
  // Assert
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    message: 'Password updated successfully'
  });
}).tag('@api').tag('@regression').tag('@password');