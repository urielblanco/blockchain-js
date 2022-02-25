"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wallet = exports.INITIAL_BALANCE = void 0;

var _modules = require("../modules");

var _transaction = require("./transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var INITIAL_BALANCE = 100;
exports.INITIAL_BALANCE = INITIAL_BALANCE;

var Wallet = /*#__PURE__*/function () {
  function Wallet(blockchain) {
    var initialBalance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INITIAL_BALANCE;

    _classCallCheck(this, Wallet);

    this.balance = initialBalance;
    this.keyPair = _modules.elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  _createClass(Wallet, [{
    key: "toString",
    value: function toString() {
      var publicKey = this.publicKey,
          balance = this.balance;
      return "Wallet\n      publicKey       : ".concat(publicKey.toString(), "\n      balance         : ").concat(balance);
    }
  }, {
    key: "sign",
    value: function sign(data) {
      return this.keyPair.sign((0, _modules.hash)(data));
    }
  }, {
    key: "createTransaction",
    value: function createTransaction(recipientAddress, amount) {
      var currentBalance = this.currentBalance,
          memoryPool = this.blockchain.memoryPool;

      if (amount > currentBalance) {
        throw Error("Amount: ".concat(amount, " exceeds current balance: ").concat(currentBalance));
      }

      var tx = memoryPool.find(this.publicKey);

      if (tx) {
        tx.update(this, recipientAddress, amount);
      } else {
        tx = _transaction.Transaction.create(this, recipientAddress, amount);
        memoryPool.addOrUpdate(tx);
      }

      return tx;
    }
  }, {
    key: "currentBalance",
    get: function get() {
      var _this$blockchain$bloc = this.blockchain.blocks,
          blocks = _this$blockchain$bloc === void 0 ? [] : _this$blockchain$bloc,
          publicKey = this.publicKey;
      var balance = this.balance;
      var txs = [];
      blocks.forEach(function (_ref) {
        var _ref$data = _ref.data,
            data = _ref$data === void 0 ? [] : _ref$data;
        if (Array.isArray(data)) data.forEach(function (tx) {
          return txs.push(tx);
        });
      });
      var walletInputTxs = txs.filter(function (tx) {
        return tx.input.address === publicKey;
      });
      var timestamp = 0;

      if (walletInputTxs.length > 0) {
        var recentInputTx = walletInputTxs.sort(function (a, b) {
          return a.input.timestamp - b.input.timestamp;
        }).pop();
        balance = recentInputTx.outputs.find(function (_ref2) {
          var address = _ref2.address;
          return address === publicKey;
        }).amount;
        timestamp = recentInputTx.input.timestamp;
      }

      txs.filter(function (_ref3) {
        var input = _ref3.input;
        return input.timestamp > timestamp;
      }).forEach(function (_ref4) {
        var outputs = _ref4.outputs;
        outputs.forEach(function (_ref5) {
          var address = _ref5.address,
              amount = _ref5.amount;
          if (address === publicKey) balance += amount;
        });
      });
      return balance;
    }
  }]);

  return Wallet;
}();

exports.Wallet = Wallet;