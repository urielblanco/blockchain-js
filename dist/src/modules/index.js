"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  elliptic: true
};
Object.defineProperty(exports, "elliptic", {
  enumerable: true,
  get: function get() {
    return _elliptic.elliptic;
  }
});

var _hash = require("./hash");

Object.keys(_hash).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _hash[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _hash[key];
    }
  });
});

var _elliptic = require("./elliptic");