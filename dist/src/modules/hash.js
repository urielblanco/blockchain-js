"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = void 0;

var _cryptoJs = require("crypto-js");

var hash = function hash(data) {
  return (0, _cryptoJs.SHA256)(JSON.stringify(data)).toString();
};

exports.hash = hash;