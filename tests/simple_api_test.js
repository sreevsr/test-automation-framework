Feature('Simple API Testing');

Scenario('Test JSONPlaceholder API @api @smoke', async ({ I }) => {
  // Test GET request
  const response = await I.sendGetRequest('/posts/1');
  console.log('✅ API Response received');
  console.log('Response data:', response.data ? 'Present' : 'Missing');
  
  // Basic validation
  if (response.data && response.data.id === 1) {
    console.log('✅ Test passed: Got post with ID 1');
  } else {
    throw new Error('Test failed: Expected post with ID 1');
  }
});

Scenario('Test API POST request @api @smoke', async ({ I }) => {
  // Test POST request
  const response = await I.sendPostRequest('/posts', {
    title: 'Test Post',
    body: 'This is a test post',
    userId: 1
  });
  
  console.log('✅ POST request completed');
  console.log('Response data:', response.data ? 'Present' : 'Missing');
  
  if (response.data && response.data.title === 'Test Post') {
    console.log('✅ Test passed: Post created successfully');
  } else {
    throw new Error('Test failed: Post creation failed');
  }
});

Scenario('Test API users endpoint @api @regression', async ({ I }) => {
  // Test getting all users
  const response = await I.sendGetRequest('/users');
  console.log('✅ Users API response received');
  
  if (response.data && Array.isArray(response.data)) {
    console.log(`✅ Test passed: Found ${response.data.length} users`);
  } else {
    throw new Error('Test failed: Expected array of users');
  }
});