const { DependencyContainer } = require('../utils/DependencyContainer');
const { Logger } = require('../utils/Logger');
const AuthenticationService = require('../api/services/AuthenticationService');
const UserRepository = require('../api/services/UserRepository');
const UserSearchService = require('../api/services/UserSearchService');
const UserAPI = require('../api/UserAPI');
const UserFactory = require('../factories/UserFactory');
const TestDataFactory = require('../factories/TestDataFactory');

/**
 * Service Container Configuration
 * 
 * Configures dependency injection container with all framework services.
 * Provides centralized service registration and resolution.
 */

/**
 * Creates and configures the dependency injection container
 * @returns {DependencyContainer} Configured container
 */
function createContainer() {
  const container = new DependencyContainer();
  
  // Register core services
  container.registerSingleton('logger', () => new Logger('Framework', {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: process.env.NODE_ENV !== 'test',
    logDirectory: './logs'
  }));
  
  // Register authentication service
  container.registerSingleton('authService', () => new AuthenticationService());
  
  // Register user repository with authentication dependency
  container.registerSingleton('userRepository', (authService) => {
    return new UserRepository(authService);
  }, ['authService']);
  
  // Register user search service with authentication dependency
  container.registerSingleton('userSearchService', (authService) => {
    return new UserSearchService(authService);
  }, ['authService']);
  
  // Register UserAPI with all dependencies
  container.registerSingleton('userAPI', (authService, userRepository, userSearchService, logger) => {
    return new UserAPI({
      authService,
      userRepository,
      searchService: userSearchService,
      logger: logger.child({ component: 'UserAPI' })
    });
  }, ['authService', 'userRepository', 'userSearchService', 'logger']);
  
  // Register factory services
  container.registerSingleton('userFactory', () => new UserFactory());
  container.registerSingleton('testDataFactory', () => new TestDataFactory());
  
  // Register specialized loggers
  container.registerTransient('apiLogger', (logger) => {
    return logger.child({ component: 'API' });
  }, ['logger']);
  
  container.registerTransient('testLogger', (logger) => {
    return logger.child({ component: 'Test' });
  }, ['logger']);
  
  container.registerTransient('stepLogger', (logger) => {
    return logger.child({ component: 'Step' });
  }, ['logger']);
  
  return container;
}

/**
 * Default container instance
 */
const container = createContainer();

module.exports = {
  container,
  createContainer
};