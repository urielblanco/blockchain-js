"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elliptic = void 0;

var _elliptic = _interopRequireDefault(require("elliptic"));

var _hash = require("./hash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line new-cap
var ec = new _elliptic["default"].ec('secp256k1');
var elliptic = {
  createKeyPair: function createKeyPair() {
    return ec.genKeyPair();
  },
  verifySignature: function verifySignature(publickey, signature, data) {
    return (// eslint-disable-next-line implicit-arrow-linebreak
      ec.keyFromPublic(publickey, 'hex').verify((0, _hash.hash)(data), signature)
    );
  }
};
exports.elliptic = elliptic;