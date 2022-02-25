"use strict";

var _blockchain = require("../blockchain");

var _validate = require("./validate");

describe('validate()', function () {
  var blockchain;
  beforeEach(function () {
    blockchain = new _blockchain.Blockchain();
  });
  it('validate a valid chain', function () {
    blockchain.addBlock('bl4ck-1');
    blockchain.addBlock('bl4ck-2');
    expect((0, _validate.validate)(blockchain.blocks)).toBe(true);
  });
  it('invalidates a chain with a corrupt genesis block', function () {
    blockchain.blocks[0].data = 'b4d d4t4';
    expect(function () {
      (0, _validate.validate)(blockchain.blocks);
    }).toThrowError('Invalid genesis block.');
  });
  it('invalidates a chain with a corrupt previousHash within a block', function () {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].previousHash = 'h4ck';
    expect(function () {
      (0, _validate.validate)(blockchain.blocks);
    }).toThrowError('Invalid previous hash.');
  });
  it('invalidates a chain with a corrupt hash within a block', function () {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].hash = 'h4ck';
    expect(function () {
      (0, _validate.validate)(blockchain.blocks);
    }).toThrowError('Invalid hash.');
  });
});