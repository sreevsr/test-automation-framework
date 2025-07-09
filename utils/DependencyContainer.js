/**
 * Dependency Injection Container
 * 
 * Provides dependency injection capabilities for better testability and loose coupling.
 * Supports singleton and transient instances, factory functions, and lifecycle management.
 * 
 * @class DependencyContainer
 * @example
 * const container = new DependencyContainer();
 * container.register('userService', () => new UserService());
 * const userService = container.resolve('userService');
 */
class DependencyContainer {
  
  /**
   * Creates a new DependencyContainer instance
   * @constructor
   */
  constructor() {
    /** @type {Map} Registered services */
    this._services = new Map();
    /** @type {Map} Singleton instances */
    this._singletons = new Map();
    /** @type {Map} Service configurations */
    this._configurations = new Map();
  }
  
  /**
   * Service lifecycle types
   * @readonly
   * @enum {string}
   */
  static get LIFECYCLE() {
    return {
      SINGLETON: 'singleton',
      TRANSIENT: 'transient',
      SCOPED: 'scoped'
    };
  }
  
  /**
   * Registers a service with the container
   * @param {string} name - Service name
   * @param {Function|Object} factory - Factory function or instance
   * @param {Object} [options] - Registration options
   * @param {string} [options.lifecycle='singleton'] - Service lifecycle
   * @param {Array<string>} [options.dependencies=[]] - Service dependencies
   * @returns {DependencyContainer} Container instance for chaining
   */
  register(name, factory, options = {}) {
    const config = {
      factory: factory,
      lifecycle: options.lifecycle || DependencyContainer.LIFECYCLE.SINGLETON,
      dependencies: options.dependencies || [],
      ...options
    };
    
    this._services.set(name, config);
    this._configurations.set(name, config);
    
    return this;
  }
  
  /**
   * Registers a singleton service
   * @param {string} name - Service name
   * @param {Function|Object} factory - Factory function or instance
   * @param {Array<string>} [dependencies=[]] - Service dependencies
   * @returns {DependencyContainer} Container instance for chaining
   */
  registerSingleton(name, factory, dependencies = []) {
    return this.register(name, factory, {
      lifecycle: DependencyContainer.LIFECYCLE.SINGLETON,
      dependencies: dependencies
    });
  }
  
  /**
   * Registers a transient service
   * @param {string} name - Service name
   * @param {Function|Object} factory - Factory function or instance
   * @param {Array<string>} [dependencies=[]] - Service dependencies
   * @returns {DependencyContainer} Container instance for chaining
   */
  registerTransient(name, factory, dependencies = []) {
    return this.register(name, factory, {
      lifecycle: DependencyContainer.LIFECYCLE.TRANSIENT,
      dependencies: dependencies
    });
  }
  
  /**
   * Registers a value as a singleton
   * @param {string} name - Service name
   * @param {*} value - Value to register
   * @returns {DependencyContainer} Container instance for chaining
   */
  registerValue(name, value) {
    this._singletons.set(name, value);
    return this.register(name, () => value, {
      lifecycle: DependencyContainer.LIFECYCLE.SINGLETON
    });
  }
  
  /**
   * Resolves a service from the container
   * @param {string} name - Service name
   * @returns {*} Service instance
   * @throws {Error} If service is not registered
   */
  resolve(name) {
    const config = this._services.get(name);
    
    if (!config) {
      throw new Error(`Service '${name}' is not registered`);
    }
    
    return this._createInstance(name, config);
  }
  
  /**
   * Resolves multiple services
   * @param {Array<string>} names - Array of service names
   * @returns {Array} Array of resolved services
   */
  resolveAll(names) {
    return names.map(name => this.resolve(name));
  }
  
  /**
   * Checks if a service is registered
   * @param {string} name - Service name
   * @returns {boolean} True if service is registered
   */
  isRegistered(name) {
    return this._services.has(name);
  }
  
  /**
   * Gets all registered service names
   * @returns {Array<string>} Array of service names
   */
  getRegisteredServices() {
    return Array.from(this._services.keys());
  }
  
  /**
   * Unregisters a service
   * @param {string} name - Service name
   * @returns {boolean} True if service was unregistered
   */
  unregister(name) {
    this._singletons.delete(name);
    this._configurations.delete(name);
    return this._services.delete(name);
  }
  
  /**
   * Clears all registered services
   */
  clear() {
    this._services.clear();
    this._singletons.clear();
    this._configurations.clear();
  }
  
  /**
   * Creates a child container with inherited services
   * @returns {DependencyContainer} New child container
   */
  createChild() {
    const child = new DependencyContainer();
    
    // Copy parent services
    for (const [name, config] of this._services) {
      child._services.set(name, config);
      child._configurations.set(name, config);
    }
    
    // Copy parent singletons
    for (const [name, instance] of this._singletons) {
      child._singletons.set(name, instance);
    }
    
    return child;
  }
  
  /**
   * Gets service configuration
   * @param {string} name - Service name
   * @returns {Object|null} Service configuration or null if not found
   */
  getConfiguration(name) {
    return this._configurations.get(name) || null;
  }
  
  /**
   * Creates an instance of a service
   * @private
   * @param {string} name - Service name
   * @param {Object} config - Service configuration
   * @returns {*} Service instance
   */
  _createInstance(name, config) {
    // Check for circular dependencies
    if (this._circularDependencyCheck && this._circularDependencyCheck.has(name)) {
      throw new Error(`Circular dependency detected for service '${name}'`);
    }
    
    // Handle singleton lifecycle
    if (config.lifecycle === DependencyContainer.LIFECYCLE.SINGLETON) {
      if (this._singletons.has(name)) {
        return this._singletons.get(name);
      }
    }
    
    // Resolve dependencies
    const dependencies = this._resolveDependencies(config.dependencies, name);
    
    // Create instance
    let instance;
    if (typeof config.factory === 'function') {
      instance = config.factory(...dependencies);
    } else {
      instance = config.factory;
    }
    
    // Store singleton
    if (config.lifecycle === DependencyContainer.LIFECYCLE.SINGLETON) {
      this._singletons.set(name, instance);
    }
    
    return instance;
  }
  
  /**
   * Resolves service dependencies
   * @private
   * @param {Array<string>} dependencies - Dependency names
   * @param {string} currentService - Current service name (for circular dependency detection)
   * @returns {Array} Resolved dependencies
   */
  _resolveDependencies(dependencies, currentService) {
    if (!dependencies || dependencies.length === 0) {
      return [];
    }
    
    // Initialize circular dependency tracking
    if (!this._circularDependencyCheck) {
      this._circularDependencyCheck = new Set();
    }
    
    this._circularDependencyCheck.add(currentService);
    
    try {
      const resolved = dependencies.map(dep => this.resolve(dep));
      return resolved;
    } finally {
      this._circularDependencyCheck.delete(currentService);
    }
  }
  
  /**
   * Disposes of all singleton instances that have a dispose method
   */
  dispose() {
    for (const [name, instance] of this._singletons) {
      if (instance && typeof instance.dispose === 'function') {
        try {
          instance.dispose();
        } catch (error) {
          console.error(`Error disposing service '${name}':`, error);
        }
      }
    }
    
    this.clear();
  }
}

/**
 * Default container instance
 * @type {DependencyContainer}
 */
const defaultContainer = new DependencyContainer();

module.exports = {
  DependencyContainer,
  container: defaultContainer
};