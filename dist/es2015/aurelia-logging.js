
export const logLevel = {
  none: 0,
  error: 10,
  warn: 20,
  info: 30,
  debug: 40
};

let loggers = {};
let appenders = [];
let globalDefaultLevel = logLevel.none;

const standardLevels = ['none', 'error', 'warn', 'info', 'debug'];
function isStandardLevel(level) {
  return standardLevels.filter(l => l === level).length > 0;
}

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

function logFactoryCustom(level) {
  const threshold = logLevel[level];
  return function () {
    if (this.level < threshold) {
      return;
    }

    const args = appendArgs.apply(this, arguments);
    let i = appenders.length;
    while (i--) {
      const appender = appenders[i];
      if (appender[level] !== undefined) {
        appender[level](...args);
      }
    }
  };
}

function connectLoggers() {
  let proto = Logger.prototype;
  for (let level in logLevel) {
    if (isStandardLevel(level)) {
      if (level !== 'none') {
        proto[level] = logFactory(level);
      }
    } else {
      proto[level] = logFactoryCustom(level);
    }
  }
}

function disconnectLoggers() {
  let proto = Logger.prototype;
  for (let level in logLevel) {
    if (level !== 'none') {
      proto[level] = function () {};
    }
  }
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

export function getAppenders() {
  return [...appenders];
}

export function clearAppenders() {
  appenders = [];
  disconnectLoggers();
}

export function addCustomLevel(name, value) {
  if (logLevel[name] !== undefined) {
    throw Error(`Log level "${name}" already exists.`);
  }

  if (isNaN(value)) {
    throw Error('Value must be a number.');
  }

  logLevel[name] = value;

  if (appenders.length > 0) {
    connectLoggers();
  } else {
    Logger.prototype[name] = function () {};
  }
}

export function removeCustomLevel(name) {
  if (logLevel[name] === undefined) {
    return;
  }

  if (isStandardLevel(name)) {
    throw Error(`Built-in log level "${name}" cannot be removed.`);
  }

  delete logLevel[name];
  delete Logger.prototype[name];
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

  isDebugEnabled() {
    return this.level === logLevel.debug;
  }
};