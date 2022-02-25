"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.P2PService = exports.MESSAGES = void 0;

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var _process$env = process.env,
    _process$env$P2P_PORT = _process$env.P2P_PORT,
    P2P_PORT = _process$env$P2P_PORT === void 0 ? 5001 : _process$env$P2P_PORT,
    PEERS = _process$env.PEERS;
var peers = PEERS ? PEERS.split(',') : [];
var MESSAGES = {
  BLOCKS: 'blocks',
  TX: 'transactions',
  WIPE: 'wipe_memotypool'
};
exports.MESSAGES = MESSAGES;

var P2PService = /*#__PURE__*/function () {
  function P2PService(blockchain) {
    _classCallCheck(this, P2PService);

    this.blockchain = blockchain;
    this.sockets = [];
  }

  _createClass(P2PService, [{
    key: "listen",
    value: function listen() {
      var _this = this;

      var server = new _ws["default"].Server({
        port: P2P_PORT
      });
      server.on('connection', function (socket) {
        return _this.onConnection(socket);
      });
      peers.forEach(function (peer) {
        var socket = new _ws["default"](peer);
        socket.on('open', function () {
          return _this.onConnection(socket);
        });
      });
      console.log("Service ws: ".concat(P2P_PORT, " listening..."));
    }
  }, {
    key: "onConnection",
    value: function onConnection(socket) {
      var blockchain = this.blockchain;
      console.log('[ws:socket] connected.');
      this.sockets.push(socket);
      socket.on('message', function (message) {
        var _JSON$parse = JSON.parse(message),
            type = _JSON$parse.type,
            value = _JSON$parse.value;

        try {
          // eslint-disable-next-line default-case
          switch (type) {
            case MESSAGES.BLOCKS:
              blockchain.replace(value);
              break;

            case MESSAGES.TX:
              blockchain.memoryPool.addOrUpdate(value);
              break;

            case MESSAGES.WIPE:
              blockchain.memoryPool.wipe();
              break;
          }
        } catch (error) {
          console.log("[ws:message] error ".concat(error));
          throw Error(error);
        }
      });
      socket.send(JSON.stringify({
        type: MESSAGES.BLOCKS,
        value: blockchain.blocks
      }));
    }
  }, {
    key: "sync",
    value: function sync() {
      var blocks = this.blockchain.blocks;
      this.broadcast(MESSAGES.BLOCKS, blocks);
    }
  }, {
    key: "broadcast",
    value: function broadcast(type, value) {
      console.log("[ws:broadcast] ".concat(type, "..."));
      var message = JSON.stringify({
        type: type,
        value: value
      });
      this.sockets.forEach(function (socket) {
        socket.send(message);
      });
    }
  }]);

  return P2PService;
}();

exports.P2PService = P2PService;