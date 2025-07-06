Feature('Mobile Web Responsive Tests');

const { LoginPage, DashboardPage } = inject();

const mobileDevices = [
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 }
];

BeforeSuite(async () => {
  console.log('🚀 Starting Mobile Web Responsive Tests Suite');
});

AfterSuite(async () => {
  console.log('✅ Mobile Web Responsive Tests Suite Completed');
});

Before(async () => {
  // Reset to mobile view
  I.resizeWindow(375, 667); // iPhone SE size
});

After(async () => {
  // Reset window size
  I.resizeWindow(1920, 1080);
});

Scenario('Login form responsiveness across mobile devices @mobile-web @smoke @responsive', async () => {
  for (const device of mobileDevices) {
    console.log(`Testing on ${device.name} (${device.width}x${device.height})`);
    
    // Set viewport size
    I.resizeWindow(device.width, device.height);
    
    // Navigate and test
    await LoginPage.open();
    await LoginPage.seeLoginForm();
    
    // Check if elements are visible and properly sized
    I.seeElement(LoginPage.locators.emailField);
    I.seeElement(LoginPage.locators.passwordField);
    I.seeElement(LoginPage.locators.loginButton);
    
    // Verify form is usable (can fill fields)
    await LoginPage.fillEmail('test@example.com');
    await LoginPage.fillPassword('password123');
    
    // Check button is clickable
    const buttonLocation = await I.grabElementBoundingRect(LoginPage.locators.loginButton);
    I.assertTrue(buttonLocation.width > 0 && buttonLocation.height > 0, 'Login button should be visible');
  }
}).tag('@mobile-web').tag('@smoke').tag('@responsive');

Scenario('Navigation menu on mobile devices @mobile-web @regression @navigation', async () => {
  I.resizeWindow(375, 667); // Mobile size
  
  await LoginPage.open();
  await LoginPage.loginAsStandardUser();
  await DashboardPage.waitForPageToLoad();
  
  // Check if mobile navigation is present
  I.dontSeeElement(DashboardPage.locators.navigationMenu + ':not(.mobile)');
  I.seeElement('.mobile-menu-toggle, .hamburger-menu, [data-mobile-menu]');
  
  // Test mobile menu functionality
  I.click('.mobile-menu-toggle, .hamburger-menu, [data-mobile-menu]');
  I.seeElement('.mobile-menu, .nav-drawer, [data-mobile-nav]');
}).tag('@mobile-web').tag('@regression').tag('@navigation');

Scenario('Touch interactions on mobile @mobile-web @regression @touch', async () => {
  I.resizeWindow(375, 667);
  
  await LoginPage.open();
  
  // Test touch targets are appropriately sized (minimum 44px)
  const buttonRect = await I.grabElementBoundingRect(LoginPage.locators.loginButton);
  I.assertTrue(buttonRect.height >= 44, 'Touch targets should be at least 44px high');
  I.assertTrue(buttonRect.width >= 44, 'Touch targets should be at least 44px wide');
  
  // Test swipe gestures if supported
  try {
    I.swipeLeft();
    I.swipeRight();
  } catch (e) {
    console.log('Swipe gestures not supported in this browser');
  }
}).tag('@mobile-web').tag('@regression').tag('@touch');

Scenario('Mobile form validation and keyboard handling @mobile-web @regression @forms', async () => {
  I.resizeWindow(375, 667);
  
  await LoginPage.open();
  
  // Test input field behavior on mobile
  I.click(LoginPage.locators.emailField);
  
  // Check if virtual keyboard appears (browser-dependent)
  const emailField = await I.grabElementBoundingRect(LoginPage.locators.emailField);
  I.assertTrue(emailField.height > 0, 'Email field should be visible');
  
  // Test proper input types
  I.seeElementAttribute(LoginPage.locators.emailField, 'type', 'email');
  I.seeElementAttribute(LoginPage.locators.passwordField, 'type', 'password');
  
  // Test form submission on mobile
  await LoginPage.fillEmail('test@example.com');
  await LoginPage.fillPassword('password123');
  
  // Submit form
  I.pressKey('Enter');
}).tag('@mobile-web').tag('@regression').tag('@forms');

Scenario('Mobile performance and loading @mobile-web @performance', async () => {
  I.resizeWindow(375, 667);
  
  const startTime = Date.now();
  
  await LoginPage.open();
  await LoginPage.waitForPageToLoad();
  
  const loadTime = Date.now() - startTime;
  
  // Mobile should load reasonably fast
  I.assertTrue(loadTime < 5000, `Mobile page load time ${loadTime}ms should be under 5 seconds`);
  
  // Check for mobile-optimized resources
  const images = await I.executeScript(() => {
    return Array.from(document.images).map(img => ({
      src: img.src,
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
  });
  
  // Verify images are reasonably sized for mobile
  images.forEach(img => {
    if (img.width > 800) {
      console.warn(`Large image detected: ${img.src} (${img.width}x${img.height})`);
    }
  });
}).tag('@mobile-web').tag('@performance');

Scenario('Orientation change handling @mobile-web @regression @orientation', async () => {
  // Portrait mode
  I.resizeWindow(375, 667);
  await LoginPage.open();
  await LoginPage.seeLoginForm();
  
  // Test portrait login
  await LoginPage.fillEmail('test@example.com');
  await LoginPage.fillPassword('password123');
  
  // Landscape mode
  I.resizeWindow(667, 375);
  
  // Verify form is still visible and functional
  await LoginPage.seeLoginForm();
  
  // Verify data is preserved
  const emailValue = await I.grabValueFrom(LoginPage.locators.emailField);
  I.assertEqual(emailValue, 'test@example.com', 'Form data should be preserved on orientation change');
  
  // Test login in landscape
  await LoginPage.clickLogin();
}).tag('@mobile-web').tag('@regression').tag('@orientation');

Scenario('Mobile accessibility features @mobile-web @accessibility', async () => {
  I.resizeWindow(375, 667);
  
  await LoginPage.open();
  
  // Check for proper mobile accessibility
  I.seeElementAttribute(LoginPage.locators.emailField, 'autocomplete', 'email');
  I.seeElementAttribute(LoginPage.locators.passwordField, 'autocomplete', 'current-password');
  
  // Check for proper labeling
  I.seeElement('label[for="email"]');
  I.seeElement('label[for="password"]');
  
  // Check touch target sizes
  const elements = [LoginPage.locators.emailField, LoginPage.locators.passwordField, LoginPage.locators.loginButton];
  
  for (const element of elements) {
    const rect = await I.grabElementBoundingRect(element);
    I.assertTrue(rect.height >= 44, `Element ${element} should have minimum touch target height of 44px`);
  }
}).tag('@mobile-web').tag('@accessibility');

Scenario('Mobile scroll behavior @mobile-web @regression @scroll', async () => {
  I.resizeWindow(375, 667);
  
  await LoginPage.open();
  await LoginPage.loginAsStandardUser();
  await DashboardPage.waitForPageToLoad();
  
  // Test smooth scrolling
  I.scrollTo('.footer, [data-footer]');
  I.wait(1); // Allow scroll animation
  
  I.scrollTo('body');
  I.wait(1);
  
  // Test scroll position is maintained during interactions
  I.scrollTo('.middle-section, .content-area');
  I.click('.some-button, .interactive-element');
  
  // Verify scroll position wasn't reset
  const scrollPosition = await I.executeScript(() => window.pageYOffset);
  I.assertTrue(scrollPosition > 0, 'Scroll position should be maintained');
}).tag('@mobile-web').tag('@regression').tag('@scroll');

Scenario('Mobile zoom behavior @mobile-web @regression @zoom', async () => {
  I.resizeWindow(375, 667);
  
  await LoginPage.open();
  
  // Check viewport meta tag for proper zoom behavior
  const viewportContent = await I.executeScript(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    return viewport ? viewport.getAttribute('content') : null;
  });
  
  I.assertNotNull(viewportContent, 'Viewport meta tag should be present');
  I.assertTrue(
    viewportContent.includes('width=device-width'),
    'Viewport should include width=device-width'
  );
  
  // Test double-tap zoom is disabled for form elements (if desired)
  I.doubleClick(LoginPage.locators.emailField);
  // Implementation would need to check if unwanted zoom occurred
}).tag('@mobile-web').tag('@regression').tag('@zoom');

// Data-driven test for different mobile screen sizes
Data(mobileDevices).Scenario('Cross-device compatibility test @mobile-web @regression @cross-device', async ({ current }) => {
  I.resizeWindow(current.width, current.height);
  
  await LoginPage.open();
  await LoginPage.seeLoginForm();
  
  // Test basic functionality on each device
  await LoginPage.fillEmail('test@example.com');
  await LoginPage.fillPassword('password123');
  await LoginPage.clickLogin();
  
  // Verify the page responds appropriately
  I.waitForNavigation();
}).tag('@mobile-web').tag('@regression').tag('@cross-device');