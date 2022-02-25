"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = void 0;

var _block = require("../block");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var validate = function validate(blockchain) {
  var _blockchain = _toArray(blockchain),
      genesisBlock = _blockchain[0],
      blocks = _blockchain.slice(1);

  if (JSON.stringify(genesisBlock) !== JSON.stringify(_block.Block.genesis)) {
    throw Error('Invalid genesis block.');
  }

  for (var i = 0; i < blocks.length; i++) {
    // eslint-disable-next-line operator-linebreak
    var _blocks$i = blocks[i],
        timestamp = _blocks$i.timestamp,
        previousHash = _blocks$i.previousHash,
        hash = _blocks$i.hash,
        data = _blocks$i.data,
        nonce = _blocks$i.nonce,
        difficulty = _blocks$i.difficulty;
    var previousBlock = blockchain[i];

    if (previousHash !== previousBlock.hash) {
      throw Error('Invalid previous hash.');
    }

    if (hash !== _block.Block.hash(timestamp, previousHash, data, nonce, difficulty)) {
      throw Error('Invalid hash.');
    }
  }

  return true;
};

exports.validate = validate;