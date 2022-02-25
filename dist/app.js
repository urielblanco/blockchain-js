"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.p2pservice = exports.app = void 0;

var _blockchain = require("./src/blockchain");

var _wallet = require("./src/wallet/wallet.js");

var _p2p = require("./src/services/p2p");

var _miner = require("./src/miner");

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
exports.app = app;
var blockchain = new _blockchain.Blockchain();
var wallet = new _wallet.Wallet(blockchain);
var walletMiner = new _wallet.Wallet(blockchain, 0);
var p2pservice = new _p2p.P2PService(blockchain);
exports.p2pservice = p2pservice;
var miner = new _miner.Miner(blockchain, p2pservice, walletMiner);
app.use(_express["default"].json());
app.get('/wallet', function (req, res) {
  var _Wallet = new _wallet.Wallet(blockchain),
      publicKey = _Wallet.publicKey;

  res.status(200).json({
    publicKey: publicKey
  });
});
app.get('/blocks', function (req, res) {
  res.status(200).json(blockchain.blocks);
});
app.get('/transactions', function (req, res) {
  var transactions = blockchain.memoryPool.transactions;
  res.status(200).json(transactions);
});
app.post('/transactions', function (req, res) {
  var _req$body = req.body,
      recipient = _req$body.recipient,
      amount = _req$body.amount;

  try {
    var tx = wallet.createTransaction(recipient, amount);
    p2pservice.broadcast(_p2p.MESSAGES.TX, tx);
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/mine/transactions', function (req, res) {
  try {
    miner.mine();
    res.redirect('/blocks');
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});