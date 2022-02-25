"use strict";

var _blockchain = require("../blockchain");

var _wallet = require("./wallet");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

describe('Wallet', function () {
  var blockchain;
  var wallet;
  beforeEach(function () {
    blockchain = new _blockchain.Blockchain();
    wallet = new _wallet.Wallet(blockchain);
  });
  it('it is a healthy wallet', function () {
    expect(wallet.balance).toEqual(_wallet.INITIAL_BALANCE);
    expect(_typeof(wallet.keyPair)).toEqual('object');
    expect(_typeof(wallet.publicKey)).toEqual('string');
    expect(wallet.publicKey.length).toEqual(130);
  });
  it('use sign()', function () {
    var signature = wallet.sign('h3ll0');
    expect(_typeof(signature)).toEqual('object');
    expect(signature).toEqual(wallet.sign('h3ll0'));
  });
  describe('creating a transaction', function () {
    var tx;
    var recipientAddress;
    var amount;
    beforeEach(function () {
      recipientAddress = 'r4nd0m-addr3355';
      amount = 5;
      tx = wallet.createTransaction(recipientAddress, amount);
    });
    describe('doing the same transaction', function () {
      beforeEach(function () {
        tx = wallet.createTransaction(recipientAddress, amount);
      });
      it('double the `amount` subtracted from the wallet balance', function () {
        var output = tx.outputs.find(function (_ref) {
          var address = _ref.address;
          return address === wallet.publicKey;
        });
        expect(output.amount).toEqual(wallet.balance - amount * 2);
      });
      it('clones the `amount` output for the recipient', function () {
        var amounts = tx.outputs.filter(function (_ref2) {
          var address = _ref2.address;
          return address === recipientAddress;
        }).map(function (output) {
          return output.amount;
        });
        expect(amounts).toEqual([amount, amount]);
      });
    });
  });
  describe('calculating a balance', function () {
    var addBalance;
    var times;
    var senderWallet;
    beforeEach(function () {
      addBalance = 16;
      times = 3;
      senderWallet = new _wallet.Wallet(blockchain);

      for (var i = 0; i < times; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance);
      }

      blockchain.addBlock(blockchain.memoryPool.transactions);
    });
    it('calculates the balance for blockchain txs matching the recipient', function () {
      expect(wallet.currentBalance).toEqual(_wallet.INITIAL_BALANCE + addBalance * times);
    });
    it('calculates the balance for blockchain txs matching the sender', function () {
      expect(senderWallet.currentBalance).toEqual(_wallet.INITIAL_BALANCE - addBalance * times);
    });
    describe('the recipient conducts a transaction', function () {
      var subtractedBalance;
      var recipientBalance;
      beforeEach(function () {
        blockchain.memoryPool.wipe();
        subtractedBalance = 64;
        recipientBalance = wallet.currentBalance;
        wallet.createTransaction(senderWallet.publicKey, addBalance);
        blockchain.addBlock(blockchain.memoryPool.transactions);
      });
      describe('the senders send another transaction to the recipient', function () {
        beforeEach(function () {
          blockchain.memoryPool.wipe();
          senderWallet.createTransaction(wallet.publicKey, addBalance);
          blockchain.addBlock(blockchain.memoryPool.transactions);
        });
        it('calculates the recipient balance only using txs since its most recent one', function () {
          expect(wallet.currentBalance).toEqual(recipientBalance - subtractedBalance + addBalance);
        });
      });
    });
  });
});