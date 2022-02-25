"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transaction = exports.REWARD = void 0;

var _uuid = require("uuid");

var _modules = require("../modules");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var REWARD = 1;
exports.REWARD = REWARD;

var Transaction = /*#__PURE__*/function () {
  function Transaction() {
    _classCallCheck(this, Transaction);

    this.id = (0, _uuid.v1)();
    this.input = null;
    this.outputs = [];
  }

  _createClass(Transaction, [{
    key: "update",
    value: function update(senderWallet, recipientAddress, amount) {
      var senderOutput = this.outputs.find(function (_ref) {
        var address = _ref.address;
        return address === senderWallet.publicKey;
      });

      if (amount > senderOutput.amount) {
        throw Error("Amount: ".concat(amount, " exceeds balance."));
      }

      senderOutput.amount -= amount;
      this.outputs.push({
        amount: amount,
        address: recipientAddress
      });
      this.input = Transaction.sign(this, senderWallet);
      return this;
    }
  }], [{
    key: "create",
    value: function create(senderWallet, recipientAdress, amount) {
      var _transaction$outputs;

      var balance = senderWallet.balance,
          publicKey = senderWallet.publicKey;
      if (amount > balance) throw Error("Amount: ".concat(amount, " exceeds balance."));
      var transaction = new Transaction();

      (_transaction$outputs = transaction.outputs).push.apply(_transaction$outputs, [{
        amount: balance - amount,
        address: publicKey
      }, {
        amount: amount,
        address: recipientAdress
      }]);

      transaction.input = Transaction.sign(transaction, senderWallet);
      return transaction;
    }
  }, {
    key: "sign",
    value: function sign(transaction, senderWallet) {
      return {
        timestamp: Date.now(),
        amount: senderWallet.balance,
        address: senderWallet.publicKey,
        signature: senderWallet.sign(transaction.outputs)
      };
    }
  }, {
    key: "reward",
    value: function reward(minerWallet, blockchainWallet) {
      return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
    }
  }, {
    key: "verify",
    value: function verify(transaction) {
      var _transaction$input = transaction.input,
          address = _transaction$input.address,
          signature = _transaction$input.signature,
          outputs = transaction.outputs;
      return _modules.elliptic.verifySignature(address, signature, outputs);
    }
  }]);

  return Transaction;
}();

exports.Transaction = Transaction;