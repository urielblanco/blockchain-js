"use strict";

var _wallet = require("./wallet.js");

var _blockchainWallet = require("./blockchainWallet.js");

var _transaction = require("./transaction.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

describe('Transaction', function () {
  var wallet;
  var transaction;
  var amount;
  var recipientAdress;
  beforeEach(function () {
    wallet = new _wallet.Wallet();
    recipientAdress = 'r3c1p13nt';
    amount = 5;
    transaction = _transaction.Transaction.create(wallet, recipientAdress, amount);
  });
  it('outputs the `amount` subtracted from the wallet balance', function () {
    var output = transaction.outputs.find(function (_ref) {
      var address = _ref.address;
      return address === wallet.publicKey;
    });
    expect(output.amount).toEqual(wallet.balance - amount);
  });
  it('outputs the `amount` added to the recipient', function () {
    var output = transaction.outputs.find(function (_ref2) {
      var address = _ref2.address;
      return address === recipientAdress;
    });
    expect(output.amount).toEqual(amount);
  });
  describe('transacting  with an amount that exceeds the balance', function () {
    beforeEach(function () {
      amount = 500;
      transaction = undefined;
    });
    it('does not create the transaction', function () {
      expect(function () {
        transaction = _transaction.Transaction.create(wallet, recipientAdress, amount);
      }).toThrowError("Amount: ".concat(amount, " exceeds balance."));
    });
  });
  it('inputs the balance of the wallet', function () {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });
  it('inputs the sender address of the wallet', function () {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });
  it('inputs has a signature using the wallet', function () {
    expect(_typeof(transaction.input.signature)).toEqual('object');
    expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
  });
  it('validates a valid transaction', function () {
    expect(_transaction.Transaction.verify(transaction)).toBe(true);
  });
  it('validates a corrupt transaction', function () {
    transaction.outputs[0].amount = 500;
    expect(_transaction.Transaction.verify(transaction)).toBe(false);
  });
  describe('updating a transaction', function () {
    var nextAmount;
    var nextRecipient;
    beforeEach(function () {
      nextAmount = 10;
      nextRecipient = 'n3xt-rec1p13nt';
      transaction.update(wallet, nextRecipient, nextAmount);
    });
    it('subtracts the next amount from the senders wallet', function () {
      var output = transaction.outputs.find(function (_ref3) {
        var address = _ref3.address;
        return address === wallet.publicKey;
      });
      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });
    it('outputs an amount for the next recipient', function () {
      var output = transaction.outputs.find(function (_ref4) {
        var address = _ref4.address;
        return address === nextRecipient;
      });
      expect(output.amount).toEqual(nextAmount);
    });
  });
  describe('creating a reward transaction', function () {
    beforeEach(function () {
      transaction = _transaction.Transaction.reward(wallet, _blockchainWallet.blockchainWallet);
    });
    it('reward the miners wallet', function () {
      expect(transaction.outputs.length).toEqual(2);
      var output = transaction.outputs.find(function (_ref5) {
        var address = _ref5.address;
        return address === wallet.publicKey;
      });
      expect(output.amount).toEqual(_transaction.REWARD);
      output = transaction.outputs.find(function (_ref6) {
        var address = _ref6.address;
        return address === _blockchainWallet.blockchainWallet.publicKey;
      });
      expect(output.amount).toEqual(_blockchainWallet.blockchainWallet.balance - _transaction.REWARD);
    });
  });
});