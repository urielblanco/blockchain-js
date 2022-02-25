"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryPool = void 0;

var _transaction = require("../wallet/transaction.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var MemoryPool = /*#__PURE__*/function () {
  function MemoryPool() {
    _classCallCheck(this, MemoryPool);

    this.transactions = [];
  }

  _createClass(MemoryPool, [{
    key: "addOrUpdate",
    value: function addOrUpdate(transaction) {
      var input = transaction.input,
          _transaction$outputs = transaction.outputs,
          outputs = _transaction$outputs === void 0 ? [] : _transaction$outputs;
      var outputTotal = outputs.reduce(function (acc, cur) {
        return acc + cur.amount;
      }, 0);

      if (input.amount !== outputTotal) {
        throw Error("Invalid transaction from ".concat(input.address));
      }

      if (!_transaction.Transaction.verify(transaction)) {
        throw Error("Invalid signature from ".concat(input.address));
      }

      var txIndex = this.transactions.findIndex(function (_ref) {
        var id = _ref.id;
        return id === transaction.id;
      });
      if (txIndex >= 0) this.transactions[txIndex] = transaction;else this.transactions.push(transaction);
    }
  }, {
    key: "find",
    value: function find(address) {
      return this.transactions.find(function (_ref2) {
        var input = _ref2.input;
        return input.address === address;
      });
    }
  }, {
    key: "wipe",
    value: function wipe() {
      this.transactions = [];
    }
  }]);

  return MemoryPool;
}();

exports.MemoryPool = MemoryPool;