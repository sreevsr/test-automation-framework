const fs = require('fs');
const path = require('path');

/**
 * Structured Logger
 * 
 * Provides structured logging capabilities with different log levels,
 * formatters, and output destinations. Supports console and file logging.
 * 
 * @class Logger
 * @example
 * const logger = new Logger('TestRunner');
 * logger.info('Test started', { testName: 'login_test' });
 * logger.error('Test failed', { error: 'Authentication failed' });
 */
class Logger {
  
  /**
   * Log levels
   * @readonly
   * @enum {string}
   */
  static get LEVELS() {
    return {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug',
      TRACE: 'trace'
    };
  }
  
  /**
   * Log level priorities (higher number = higher priority)
   * @readonly
   * @enum {number}
   */
  static get LEVEL_PRIORITIES() {
    return {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
  }
  
  /**
   * Creates a new Logger instance
   * @constructor
   * @param {string} [name='Logger'] - Logger name
   * @param {Object} [options] - Logger options
   * @param {string} [options.level='info'] - Minimum log level
   * @param {boolean} [options.enableConsole=true] - Enable console output
   * @param {boolean} [options.enableFile=false] - Enable file output
   * @param {string} [options.logDirectory='./logs'] - Log file directory
   * @param {string} [options.logFile] - Log file name
   * @param {boolean} [options.timestamp=true] - Include timestamp
   * @param {boolean} [options.colorize=true] - Colorize console output
   */
  constructor(name = 'Logger', options = {}) {
    this.name = name;
    this.level = options.level || Logger.LEVELS.INFO;
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile || false;
    this.logDirectory = options.logDirectory || './logs';
    this.logFile = options.logFile || `${name.toLowerCase()}.log`;
    this.timestamp = options.timestamp !== false;
    this.colorize = options.colorize !== false;
    
    // Initialize file logging if enabled
    if (this.enableFile) {
      this._initializeFileLogging();
    }
  }
  
  /**
   * Logs an error message
   * @param {string} message - Log message
   * @param {Object} [context] - Additional context data
   * @param {Error} [error] - Error object
   */
  error(message, context = {}, error = null) {
    this._log(Logger.LEVELS.ERROR, message, context, error);
  }
  
  /**
   * Logs a warning message
   * @param {string} message - Log message
   * @param {Object} [context] - Additional context data
   */
  warn(message, context = {}) {
    this._log(Logger.LEVELS.WARN, message, context);
  }
  
  /**
   * Logs an info message
   * @param {string} message - Log message
   * @param {Object} [context] - Additional context data
   */
  info(message, context = {}) {
    this._log(Logger.LEVELS.INFO, message, context);
  }
  
  /**
   * Logs a debug message
   * @param {string} message - Log message
   * @param {Object} [context] - Additional context data
   */
  debug(message, context = {}) {
    this._log(Logger.LEVELS.DEBUG, message, context);
  }
  
  /**
   * Logs a trace message
   * @param {string} message - Log message
   * @param {Object} [context] - Additional context data
   */
  trace(message, context = {}) {
    this._log(Logger.LEVELS.TRACE, message, context);
  }
  
  /**
   * Logs test start
   * @param {string} testName - Test name
   * @param {Object} [context] - Test context
   */
  testStart(testName, context = {}) {
    this.info(`🧪 Test Started: ${testName}`, {
      testName,
      type: 'test_start',
      ...context
    });
  }
  
  /**
   * Logs test completion
   * @param {string} testName - Test name
   * @param {string} result - Test result (passed/failed)
   * @param {number} [duration] - Test duration in milliseconds
   * @param {Object} [context] - Test context
   */
  testEnd(testName, result, duration = null, context = {}) {
    const emoji = result === 'passed' ? '✅' : '❌';
    const durationText = duration ? ` (${duration}ms)` : '';
    
    this.info(`${emoji} Test ${result}: ${testName}${durationText}`, {
      testName,
      result,
      duration,
      type: 'test_end',
      ...context
    });
  }
  
  /**
   * Logs API request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} [context] - Request context
   */
  apiRequest(method, url, context = {}) {
    this.debug(`🌐 API Request: ${method.toUpperCase()} ${url}`, {
      method,
      url,
      type: 'api_request',
      ...context
    });
  }
  
  /**
   * Logs API response
   * @param {number} statusCode - HTTP status code
   * @param {string} url - Request URL
   * @param {number} [duration] - Response time in milliseconds
   * @param {Object} [context] - Response context
   */
  apiResponse(statusCode, url, duration = null, context = {}) {
    const emoji = statusCode >= 200 && statusCode < 300 ? '✅' : '❌';
    const durationText = duration ? ` (${duration}ms)` : '';
    
    this.debug(`${emoji} API Response: ${statusCode} ${url}${durationText}`, {
      statusCode,
      url,
      duration,
      type: 'api_response',
      ...context
    });
  }
  
  /**
   * Logs step execution
   * @param {string} stepName - Step name
   * @param {string} action - Action being performed
   * @param {Object} [context] - Step context
   */
  step(stepName, action, context = {}) {
    this.debug(`📋 Step: ${stepName} - ${action}`, {
      stepName,
      action,
      type: 'step',
      ...context
    });
  }
  
  /**
   * Logs assertion
   * @param {string} assertion - Assertion description
   * @param {boolean} passed - Whether assertion passed
   * @param {Object} [context] - Assertion context
   */
  assertion(assertion, passed, context = {}) {
    const emoji = passed ? '✅' : '❌';
    const level = passed ? Logger.LEVELS.DEBUG : Logger.LEVELS.ERROR;
    
    this._log(level, `${emoji} Assertion: ${assertion}`, {
      assertion,
      passed,
      type: 'assertion',
      ...context
    });
  }
  
  /**
   * Creates a child logger with additional context
   * @param {Object} context - Additional context for child logger
   * @returns {Logger} Child logger instance
   */
  child(context) {
    const childLogger = Object.create(this);
    childLogger.defaultContext = { ...this.defaultContext, ...context };
    return childLogger;
  }
  
  /**
   * Sets the log level
   * @param {string} level - Log level
   */
  setLevel(level) {
    if (Object.values(Logger.LEVELS).includes(level)) {
      this.level = level;
    } else {
      throw new Error(`Invalid log level: ${level}`);
    }
  }
  
  /**
   * Gets the current log level
   * @returns {string} Current log level
   */
  getLevel() {
    return this.level;
  }
  
  /**
   * Main logging method
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} context - Context data
   * @param {Error} [error] - Error object
   */
  _log(level, message, context = {}, error = null) {
    // Check if level should be logged
    if (!this._shouldLog(level)) {
      return;
    }
    
    // Create log entry
    const logEntry = this._createLogEntry(level, message, context, error);
    
    // Output to console
    if (this.enableConsole) {
      this._logToConsole(logEntry);
    }
    
    // Output to file
    if (this.enableFile) {
      this._logToFile(logEntry);
    }
  }
  
  /**
   * Checks if a log level should be logged
   * @private
   * @param {string} level - Log level to check
   * @returns {boolean} True if should log
   */
  _shouldLog(level) {
    const currentLevelPriority = Logger.LEVEL_PRIORITIES[this.level];
    const logLevelPriority = Logger.LEVEL_PRIORITIES[level];
    return logLevelPriority <= currentLevelPriority;
  }
  
  /**
   * Creates a log entry object
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} context - Context data
   * @param {Error} [error] - Error object
   * @returns {Object} Log entry
   */
  _createLogEntry(level, message, context, error) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      logger: this.name,
      message,
      ...this.defaultContext,
      ...context
    };
    
    // Add error details if present
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    
    return entry;
  }
  
  /**
   * Logs to console with formatting
   * @private
   * @param {Object} logEntry - Log entry object
   */
  _logToConsole(logEntry) {
    const { timestamp, level, logger, message, ...context } = logEntry;
    
    // Format timestamp
    const timeStr = this.timestamp ? `[${timestamp}] ` : '';
    
    // Format level with color
    const levelStr = this.colorize ? this._colorizeLevel(level) : level;
    
    // Format logger name
    const loggerStr = `[${logger}]`;
    
    // Create base message
    let output = `${timeStr}${levelStr} ${loggerStr} ${message}`;
    
    // Add context if present
    const contextKeys = Object.keys(context);
    if (contextKeys.length > 0) {
      const contextStr = JSON.stringify(context, null, 2);
      output += `\n${contextStr}`;
    }
    
    // Output to appropriate console method
    switch (level) {
      case 'ERROR':
        console.error(output);
        break;
      case 'WARN':
        console.warn(output);
        break;
      case 'DEBUG':
      case 'TRACE':
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }
  
  /**
   * Logs to file
   * @private
   * @param {Object} logEntry - Log entry object
   */
  _logToFile(logEntry) {
    const logLine = JSON.stringify(logEntry) + '\n';
    const logFilePath = path.join(this.logDirectory, this.logFile);
    
    try {
      fs.appendFileSync(logFilePath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  /**
   * Colorizes log level for console output
   * @private
   * @param {string} level - Log level
   * @returns {string} Colorized level string
   */
  _colorizeLevel(level) {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[32m',  // Green
      DEBUG: '\x1b[36m', // Cyan
      TRACE: '\x1b[35m'  // Magenta
    };
    
    const reset = '\x1b[0m';
    const color = colors[level] || '';
    
    return `${color}${level}${reset}`;
  }
  
  /**
   * Initializes file logging
   * @private
   */
  _initializeFileLogging() {
    try {
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error);
      this.enableFile = false;
    }
  }
}

// Create default logger instance
const defaultLogger = new Logger('Framework');

module.exports = {
  Logger,
  logger: defaultLogger
};