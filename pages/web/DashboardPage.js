const { I } = inject();

class DashboardPage {
  
  // Locators
  locators = {
    welcomeMessage: '.welcome-message',
    userMenu: '.user-menu',
    navigationMenu: '.main-navigation',
    searchBox: '#search',
    notificationsIcon: '.notifications-icon',
    notificationBadge: '.notification-badge',
    logoutButton: 'button[data-action="logout"]',
    profileLink: 'a[href*="profile"]',
    settingsLink: 'a[href*="settings"]',
    
    // Dashboard widgets
    statsCards: '.stats-card',
    recentActivity: '.recent-activity',
    quickActions: '.quick-actions',
    
    // Navigation items
    dashboardNav: 'a[href*="dashboard"]',
    productsNav: 'a[href*="products"]',
    ordersNav: 'a[href*="orders"]',
    customersNav: 'a[href*="customers"]',
    reportsNav: 'a[href*="reports"]'
  };
  
  // Actions
  async waitForPageToLoad() {
    I.waitForElement(this.locators.welcomeMessage, 10);
    I.waitForElement(this.locators.navigationMenu, 10);
  }
  
  async clickUserMenu() {
    I.click(this.locators.userMenu);
  }
  
  async search(query) {
    I.fillField(this.locators.searchBox, query);
    I.pressKey('Enter');
  }
  
  async clickNotifications() {
    I.click(this.locators.notificationsIcon);
  }
  
  async logout() {
    await this.clickUserMenu();
    I.click(this.locators.logoutButton);
  }
  
  async navigateToProfile() {
    await this.clickUserMenu();
    I.click(this.locators.profileLink);
  }
  
  async navigateToSettings() {
    await this.clickUserMenu();
    I.click(this.locators.settingsLink);
  }
  
  // Navigation methods
  async navigateToProducts() {
    I.click(this.locators.productsNav);
  }
  
  async navigateToOrders() {
    I.click(this.locators.ordersNav);
  }
  
  async navigateToCustomers() {
    I.click(this.locators.customersNav);
  }
  
  async navigateToReports() {
    I.click(this.locators.reportsNav);
  }
  
  // Dashboard-specific actions
  async getStatsCardValue(cardTitle) {
    const cardSelector = `${this.locators.statsCards}:has-text("${cardTitle}")`;
    return await I.grabTextFrom(`${cardSelector} .stats-value`);
  }
  
  async clickQuickAction(actionName) {
    I.click(`${this.locators.quickActions} button:has-text("${actionName}")`);
  }
  
  async getRecentActivityItems() {
    return await I.grabTextFromAll(`${this.locators.recentActivity} .activity-item`);
  }
  
  // Assertions
  async seeDashboard() {
    I.seeElement(this.locators.welcomeMessage);
    I.seeElement(this.locators.navigationMenu);
    I.seeElement(this.locators.userMenu);
  }
  
  async seeWelcomeMessage(username) {
    if (username) {
      I.see(`Welcome, ${username}`, this.locators.welcomeMessage);
    } else {
      I.seeElement(this.locators.welcomeMessage);
    }
  }
  
  async seeNavigationItems() {
    I.seeElement(this.locators.dashboardNav);
    I.seeElement(this.locators.productsNav);
    I.seeElement(this.locators.ordersNav);
    I.seeElement(this.locators.customersNav);
  }
  
  async seeStatsCards() {
    I.seeElement(this.locators.statsCards);
  }
  
  async seeNotificationBadge(count) {
    I.seeElement(this.locators.notificationBadge);
    if (count) {
      I.see(count.toString(), this.locators.notificationBadge);
    }
  }
  
  async seeSearchBox() {
    I.seeElement(this.locators.searchBox);
  }
  
  // Validation methods
  async validateDashboardLayout() {
    await this.seeDashboard();
    await this.seeNavigationItems();
    await this.seeStatsCards();
    await this.seeSearchBox();
  }
  
  async validateUserAccess(userRole) {
    switch (userRole) {
      case 'admin':
        await this.seeNavigationItems();
        I.seeElement(this.locators.reportsNav);
        break;
      case 'standard':
        I.seeElement(this.locators.dashboardNav);
        I.seeElement(this.locators.productsNav);
        // Standard users shouldn't see admin-only sections
        I.dontSeeElement(this.locators.reportsNav);
        break;
    }
  }
  
  // Dashboard data validation
  async validateStatsData() {
    const totalUsers = await this.getStatsCardValue('Total Users');
    const totalOrders = await this.getStatsCardValue('Total Orders');
    const revenue = await this.getStatsCardValue('Revenue');
    
    // Basic validation that stats are present and numeric
    I.assertTrue(parseInt(totalUsers) >= 0, 'Total users should be a positive number');
    I.assertTrue(parseInt(totalOrders) >= 0, 'Total orders should be a positive number');
    I.assertTrue(parseFloat(revenue.replace(/[$,]/g, '')) >= 0, 'Revenue should be a positive number');
  }
  
  // Performance checks
  async validatePageLoadPerformance() {
    const loadTime = await I.executeScript(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return navigation.loadEventEnd - navigation.fetchStart;
    });
    
    I.assertTrue(loadTime < 3000, `Dashboard load time ${loadTime}ms exceeds 3 seconds`);
  }
}

module.exports = new DashboardPage();
module.exports.DashboardPage = DashboardPage;