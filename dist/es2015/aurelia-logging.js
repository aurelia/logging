
export const logLevel = {
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

  if (appenders.length) {
    connectLogger(logger);
  }

  return logger;
}

export function getLogger(id) {
  return loggers[id] || (loggers[id] = createLogger(id));
}

export function addAppender(appender) {
  appenders.push(appender);

  if (appenders.length === 1) {
    for (let key in loggers) {
      connectLogger(loggers[key]);
    }
  }
}

export function setLevel(level) {
  for (let key in loggers) {
    loggers[key].setLevel(level);
  }
}

export let Logger = class Logger {
  constructor(id, key) {
    this.level = logLevel.none;

    if (key !== loggerConstructionKey) {
      throw new Error('Cannot instantiate "Logger". Use "getLogger" instead.');
    }

    this.id = id;
  }

  debug(message, ...rest) {}

  info(message, ...rest) {}

  warn(message, ...rest) {}

  error(message, ...rest) {}

  setLevel(level) {
    this.level = level;
  }
};