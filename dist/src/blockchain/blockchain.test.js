"use strict";

var _ = require("./");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

describe('Blockchain', function () {
  var blockchain;
  var blockchainLonger;
  beforeEach(function () {
    blockchain = new _.Blockchain();
    blockchainLonger = new _.Blockchain();
  });
  it('every blockchain has a genesis block', function () {
    var _blockchain$blocks = _slicedToArray(blockchain.blocks, 1),
        genesisBlock = _blockchain$blocks[0];

    expect(genesisBlock).toEqual(_.Block.genesis);
    expect(blockchain.blocks.length).toEqual(1);
  });
  it('use addBlock()', function () {
    var data = 'd4t4';
    blockchain.addBlock(data);

    var _blockchain$blocks2 = _slicedToArray(blockchain.blocks, 2),
        lastBlock = _blockchain$blocks2[1];

    expect(lastBlock.data).toEqual(data);
    expect(blockchain.blocks.length).toEqual(2);
  });
  it('replaces the chain with a valid chain', function () {
    blockchainLonger.addBlock('bl4ck-1');
    blockchain.replace(blockchainLonger.blocks);
    expect(blockchain.blocks).toEqual(blockchainLonger.blocks);
  });
  it('does not replace the chain with one with less blocks', function () {
    blockchain.addBlock('bl4ck-1');
    expect(function () {
      blockchain.replace(blockchainLonger.blocks);
    }).toThrowError('Received chain is not longer than the current chain.');
  });
  it('not replace the chain with one that is not valid', function () {
    blockchainLonger.addBlock('bl4ck-1');
    blockchainLonger.blocks[1].data = 'h4ck';
    expect(function () {
      blockchain.replace(blockchainLonger.blocks);
    }).toThrowError('Received chain is invalid.');
  });
});