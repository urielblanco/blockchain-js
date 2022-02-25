"use strict";

var _ = require("./");

var _wallet = require("../wallet/wallet.js");

var _transaction = require("../wallet/transaction.js");

describe('MemoryPool', function () {
  var memoryPool;
  var wallet;
  var transaction;
  beforeEach(function () {
    memoryPool = new _.MemoryPool();
    wallet = new _wallet.Wallet();
    transaction = _transaction.Transaction.create(wallet, 'r4nd0m-addr355', 5);
    memoryPool.addOrUpdate(transaction);
  });
  it('has one transaction', function () {
    expect(memoryPool.transactions.length).toEqual(1);
  });
  it('adds a transaction to the memoryPool', function () {
    var found = memoryPool.transactions.find(function (_ref) {
      var id = _ref.id;
      return id === transaction.id;
    });
    expect(found).toEqual(transaction);
  });
  it('updates a transaction in the memoryPool', function () {
    var txOld = JSON.stringify(transaction);
    var txNew = transaction.update(wallet, '0th3r-addr3355', 10);
    memoryPool.addOrUpdate(txNew);
    expect(memoryPool.transactions.length).toEqual(1);
    var found = memoryPool.transactions.find(function (_ref2) {
      var id = _ref2.id;
      return id === transaction.id;
    });
    expect(JSON.stringify(found)).not.toEqual(txOld);
    expect(txNew).toEqual(found);
  });
  it('wipes transactions', function () {
    memoryPool.wipe();
    expect(memoryPool.transactions.length).toEqual(0);
  });
});