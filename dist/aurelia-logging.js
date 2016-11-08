
/**
* Specifies the available logging levels.
*/
interface LogLevel {
  /**
  * No logging.
  */
  none: number,
  /**
  * Log only error messages.
  */
  error: number,
  /**
  * Log warnings messages or above.
  */
  warn: number,
  /**
  * Log informational messages or above.
  */
  info: number,
  /**
  * Log all messages.
  */
  debug: number
}

/**
* Specifies the available logging levels.
*/
export const logLevel: LogLevel = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

let loggers = {};
let appenders = [];
let slice = Array.prototype.slice;
let loggerConstructionKey = {};
let globalDefaultLevel = logLevel.none;

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
  if (this.level < 4) {
    return;
  }

  log(this, 'debug', arguments);
}

function info() {
  if (this.level < 3) {
    return;
  }

  log(this, 'info', arguments);
}

function warn() {
  if (this.level < 2) {
    return;
  }

  log(this, 'warn', arguments);
}

function error() {
  if (this.level < 1) {
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
  logger.setLevel(globalDefaultLevel);

  if (appenders.length) {
    connectLogger(logger);
  }

  return logger;
}

/**
* Gets the instance of a logger associated with a particular id (or creates one if it doesn't already exist).
*
* @param id The id of the logger you wish to get an instance of.
* @return The instance of the logger, or creates a new logger if none exists for that id.
*/
export function getLogger(id: string): Logger {
  return loggers[id] || (loggers[id] = createLogger(id));
}

/**
* Implemented by classes which wish to append log data to a target data store.
*/
interface Appender {
  /**
  * Appends a debug log.
  *
  * @param logger The source logger.
  * @param rest The data to log.
  */
  debug(logger: Logger, ...rest: any[]): void;

  /**
  * Appends an info log.
  *
  * @param logger The source logger.
  * @param rest The data to log.
  */
  info(logger: Logger, ...rest: any[]): void;

  /**
  * Appends a warning log.
  *
  * @param logger The source logger.
  * @param rest The data to log.
  */
  warn(logger: Logger, ...rest: any[]): void;

  /**
  * Appends an error log.
  *
  * @param logger The source logger.
  * @param rest The data to log.
  */
  error(logger: Logger, ...rest: any[]): void;
}

/**
* Adds an appender capable of processing logs and channeling them to an output.
*
* @param appender An appender instance to begin processing logs with.
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
* Sets the level of logging for ALL the application loggers.
*
* @param level Matches a value of logLevel specifying the level of logging.
*/
export function setLevel(level: number): void {
  globalDefaultLevel = level;
  for (let key in loggers) {
    loggers[key].setLevel(level);
  }
}

/**
* A logger logs messages to a set of appenders, depending on the log level that is set.
*/
export class Logger {
  /**
  * The id that the logger was created with.
  */
  id: string;

  /**
   * The logging severity level for this logger
   */
  level: number = logLevel.none;

  /**
  * You cannot instantiate the logger directly - you must use the getLogger method instead.
  */
  constructor(id: string, key: Object) {
    if (key !== loggerConstructionKey) {
      throw new Error('Cannot instantiate "Logger". Use "getLogger" instead.');
    }

    this.id = id;
  }

  /**
   * Logs a debug message.
   *
   * @param message The message to log.
   * @param rest The data to log.
   */
  debug(message: string, ...rest: any[]): void {}

  /**
   * Logs info.
   *
   * @param message The message to log.
   * @param rest The data to log.
   */
  info(message: string, ...rest: any[]): void {}

  /**
   * Logs a warning.
   *
   * @param message The message to log.
   * @param rest The data to log.
   */
  warn(message: string, ...rest: any[]): void {}

  /**
   * Logs an error.
   *
   * @param message The message to log.
   * @param rest The data to log.
   */
  error(message: string, ...rest: any[]): void {}

  /**
   * Sets the level of logging for this logger instance
   *
   * @param level Matches a value of logLevel specifying the level of logging.
   */
  setLevel(level: number): void {
    this.level = level;
  }
}
