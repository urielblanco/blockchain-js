"use strict";

var _modules = require("../modules");

var _block = require("./block");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

describe('Block', function () {
  var timestamp;
  var previousBlock;
  var hash;
  var data;
  var nonce;
  beforeEach(function () {
    timestamp = new Date(2000, 0, 1).getTime();
    previousBlock = _block.Block.genesis;
    hash = 'h4sh';
    data = 't3st d4t4';
    nonce = 128;
  });
  it('create an instance with parameters', function () {
    var block = new _block.Block(timestamp, previousBlock.hash, hash, data, nonce);
    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
  });
  it('use static mine()', function () {
    var block = _block.Block.mine(previousBlock, data);

    var difficulty = block.difficulty;
    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.nonce).not.toEqual(0);
    expect(block.data).toEqual(data);
  });
  it('use static hash()', function () {
    var hashActual = _block.Block.hash(timestamp, previousBlock.hash, data, nonce, _block.DIFFICULTY);

    var hashExpected = (0, _modules.hash)("".concat(timestamp).concat(previousBlock.hash).concat(data).concat(nonce).concat(_block.DIFFICULTY));
    expect(hashActual).toEqual(hashExpected);
  });
  it('use toString()', function () {
    var block = _block.Block.mine(previousBlock, data);

    expect(_typeof(block.toString())).toEqual('string');
  });
});