"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DIFFICULTY = exports.Block = void 0;

var _modules = require("../modules");

var _adjustDifficulty = require("./modules/adjustDifficulty");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var DIFFICULTY = 3;
exports.DIFFICULTY = DIFFICULTY;

var Block = /*#__PURE__*/function () {
  function Block(timestamp, previousHash, hash, data, nonce, difficulty) {
    _classCallCheck(this, Block);

    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  _createClass(Block, [{
    key: "toString",
    value: function toString() {
      var timestamp = this.timestamp,
          previousHash = this.previousHash,
          hash = this.hash,
          data = this.data,
          nonce = this.nonce,
          difficulty = this.difficulty;
      return "Block\n      timestamp      : ".concat(timestamp, "\n      previousHash   : ").concat(previousHash, "\n      hash           : ").concat(hash, "\n      data           : ").concat(data, "\n      nonce          : ").concat(nonce, "\n      difficulty     : ").concat(difficulty, "\n    ");
    }
  }], [{
    key: "genesis",
    get: function get() {
      var timestamp = new Date(2000, 0, 1).getTime();
      return new Block(timestamp, undefined, 'g3n3s1s-h4sh', 'init', 0, DIFFICULTY);
    }
  }, {
    key: "mine",
    value: function mine(previousBlock, data) {
      var previousHash = previousBlock.hash;
      var hash;
      var nonce = 0;
      var timestamp;
      var difficulty = previousBlock.difficulty;
      var startsMined = Date.now();

      do {
        timestamp = Date.now();
        nonce += 1;
        difficulty = (0, _adjustDifficulty.adjustDifficulty)(previousBlock, startsMined, timestamp);
        hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);
      } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

      return new this(timestamp, previousHash, hash, data, nonce, difficulty);
    }
  }, {
    key: "hash",
    value: function hash(timestamp, previousHash, data, nonce, difficulty) {
      return (0, _modules.hash)("".concat(timestamp).concat(previousHash).concat(data).concat(nonce).concat(difficulty));
    }
  }]);

  return Block;
}();

exports.Block = Block;