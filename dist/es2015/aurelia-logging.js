
export const logLevel = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

let loggers = {};
let appenders = [];
let globalDefaultLevel = logLevel.none;

function appendArgs() {
  return [this, ...arguments];
}

function logFactory(level) {
  const threshold = logLevel[level];
  return function () {
    if (this.level < threshold) {
      return;
    }

    const args = appendArgs.apply(this, arguments);
    let i = appenders.length;
    while (i--) {
      appenders[i][level](...args);
    }
  };
}

function connectLoggers() {
  let proto = Logger.prototype;
  proto.debug = logFactory('debug');
  proto.info = logFactory('info');
  proto.warn = logFactory('warn');
  proto.error = logFactory('error');
}

export function getLogger(id) {
  return loggers[id] || new Logger(id);
}

export function addAppender(appender) {
  if (appenders.push(appender) === 1) {
    connectLoggers();
  }
}

export function removeAppender(appender) {
  appenders = appenders.filter(a => a !== appender);
}

export function setLevel(level) {
  globalDefaultLevel = level;
  for (let key in loggers) {
    loggers[key].setLevel(level);
  }
}

export function getLevel() {
  return globalDefaultLevel;
}

export let Logger = class Logger {
  constructor(id) {
    let cached = loggers[id];
    if (cached) {
      return cached;
    }

    loggers[id] = this;
    this.id = id;
    this.level = globalDefaultLevel;
  }

  debug(message, ...rest) {}

  info(message, ...rest) {}

  warn(message, ...rest) {}

  error(message, ...rest) {}

  setLevel(level) {
    this.level = level;
  }
};