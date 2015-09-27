/**
* Enum specifying the levels of the logger
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
* @param id The id of the logger you wish to get an instance of.
* @return The instance of the logger, or creates a new logger if none exists for that Id.
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
* Sets the level of the logging for the application loggers
*
* @param level Matches an enum specifying the level of logging.
*/
export function setLevel(level: number): void {
  currentLevel = level;
}

/**
* A logger logs messages to a set of appenders, depending on the log level that is set.
*/
export class Logger {
  /**
  * You cannot instantiate the logger directly - you must use the getLogger method instead.
  */
  constructor(id: string, key: Object) {
    if (key !== loggerConstructionKey) {
      throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
    }

    this.id = id;
  }

  /**
   * Logs a debug message.
   *
   * @param message The message to log.
   */
  debug(message: string): void {}

  /**
   * Logs info.
   *
   * @param message The message to log.
   */
  info(message: string): void {}

  /**
   * Logs a warning.
   *
   * @param message The message to log.
   */
  warn(message: string): void {}

  /**
   * Logs an error.
   *
   * @param message The message to log.
   */
  error(message: string): void {}
}
