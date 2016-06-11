'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaLogging = require('./aurelia-logging');

Object.keys(_aureliaLogging).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaLogging[key];
    }
  });
});