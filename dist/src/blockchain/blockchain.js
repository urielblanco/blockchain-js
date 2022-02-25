"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockchain = void 0;

var _validate = require("./modules/validate");

var _block = require("./block");

var _memoryPool = require("./memoryPool");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Blockchain = /*#__PURE__*/function () {
  function Blockchain() {
    _classCallCheck(this, Blockchain);

    this.blocks = [_block.Block.genesis];
    this.memoryPool = new _memoryPool.MemoryPool();
  }

  _createClass(Blockchain, [{
    key: "addBlock",
    value: function addBlock(data) {
      var previousBlock = this.blocks[this.blocks.length - 1];

      var block = _block.Block.mine(previousBlock, data);

      this.blocks.push(block);
      return block;
    }
  }, {
    key: "replace",
    value: function replace() {
      var newBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (newBlocks.length < this.blocks.length) {
        throw Error('Received chain is not longer than the current chain.');
      }

      try {
        (0, _validate.validate)(newBlocks);
      } catch (error) {
        throw Error('Received chain is invalid.');
      }

      this.blocks = newBlocks;
      return this.blocks;
    }
  }]);

  return Blockchain;
}();

exports.Blockchain = Blockchain;