"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Miner = void 0;

var _transaction = require("../wallet/transaction.js");

var _blockchainWallet = require("../wallet/blockchainWallet.js");

var _p2p = require("../services/p2p");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Miner = /*#__PURE__*/function () {
  function Miner(blockchain, p2pService, wallet) {
    _classCallCheck(this, Miner);

    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  _createClass(Miner, [{
    key: "mine",
    value: function mine() {
      var memoryPool = this.blockchain.memoryPool,
          p2pService = this.p2pService,
          wallet = this.wallet;

      if (memoryPool.transactions.length === 0) {
        throw Error('There are no unconfirmed transactions');
      }

      memoryPool.transactions.push(_transaction.Transaction.reward(wallet, _blockchainWallet.blockchainWallet));
      var block = this.blockchain.addBlock(memoryPool.transactions);
      p2pService.sync();
      memoryPool.wipe();
      p2pService.broadcast(_p2p.MESSAGES.WIPE);
      return block;
    }
  }]);

  return Miner;
}();

exports.Miner = Miner;