 /**
 * Creates an instance of Error that aggregates and preserves an innerError.
 */
export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    if (innerError.stack) {
      message += `\n------------------------------------------------\ninner error: ${innerError.stack}`;
    }
  }

  let e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

 /**
 * Enum specifying the levels of the logger
 *
 * @property logLevel
 * @type Enum
 * @for export
 */
export const logLevel = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

let loggers = {};
let currentLevel = logLevel.none;
let appenders = [];
let slice = Array.prototype.slice;
let loggerConstructionKey = {};

function log(logger, level, args) {
  let i = appenders.length;
  let current;

  args = slice.call(args);
  args.unshift(logger);

  while (i--) {
    current = appenders[i];
    current[level].apply(current, args);
  }
}

function debug() {
  if (currentLevel < 4) {
    return;
  }

  log(this, 'debug', arguments);
}

function info() {
  if (currentLevel < 3) {
    return;
  }

  log(this, 'info', arguments);
}

function warn() {
  if (currentLevel < 2) {
    return;
  }

  log(this, 'warn', arguments);
}

function error() {
  if (currentLevel < 1) {
    return;
  }

  log(this, 'error', arguments);
}

function connectLogger(logger) {
  logger.debug = debug;
  logger.info = info;
  logger.warn = warn;
  logger.error = error;
}

function createLogger(id) {
  let logger = new Logger(id, loggerConstructionKey);

  if (appenders.length) {
    connectLogger(logger);
  }

  return logger;
}

/**
* Gets an instance of a logger by the Id used when creating.
*
* @method getLogger
* @param {string} id The id of the logger you wish to get an instance of.
* @return {Logger} The instance of the logger, or creates a new logger if none exists for that Id.
*/
export function getLogger(id: string): Logger {
  return loggers[id] || (loggers[id] = createLogger(id));
}

interface Appender {
  debug(logger: Logger, ...rest: any[]): void;
  info(logger: Logger, ...rest: any[]): void;
  warn(logger: Logger, ...rest: any[]): void;
  error(logger: Logger, ...rest: any[]): void;
}

/**
* Adds an appender capable of processing logs and channeling them to an output.
*
* @method addAppender
* @param {Object} appender An appender instance to begin processing logs with.
*/
export function addAppender(appender: Appender): void {
  appenders.push(appender);

  if (appenders.length === 1) {
    for (let key in loggers) {
      connectLogger(loggers[key]);
    }
  }
}

/**
* Sets the level of the logging for the application loggers
*
* @method setLevel
* @param {Number} level Matches an enum specifying the level of logging.
*/
export function setLevel(level : number): void {
  currentLevel = level;
}

/**
* The logger is essentially responsible for having log statements that appear during debugging but are squelched
* when using the build tools, depending on the log level that is set.  The available levels are -
* 1. none
* 2. error
* 3. warn
* 4. info
* 5. debug
*
* You cannot instantiate the logger directly - you must use the getLogger method instead.
*
* @class Logger
* @constructor
*/
export class Logger {
  constructor(id: string, key: Object) {
    if (key !== loggerConstructionKey) {
      throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
    }

    this.id = id;
  }

  /**
   * Logs a debug message.
   *
   * @method debug
   * @param {string} message The message to log
   */
  debug(message: string): void {}

  /**
   * Logs info.
   *
   * @method info
   * @param {string} message The message to log
   */
  info(message: string): void {}

  /**
   * Logs a warning.
   *
   * @method warn
   * @param {string} message The message to log
   */
  warn(message: string): void {}

  /**
   * Logs an error.
   *
   * @method error
   * @param {string} message The message to log
   */
  error(message: string): void {}
}
