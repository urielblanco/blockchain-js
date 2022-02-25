import WebSocket from 'ws';

const { P2P_PORT = 5001, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGES = {
  BLOCKS: 'blocks',
  TX: 'transactions',
  WIPE: 'wipe_memotypool',
};

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`Service ws: ${P2P_PORT} listening...`);
  }

  onConnection(socket) {
    const { blockchain } = this;

    console.log('[ws:socket] connected.');
    this.sockets.push(socket);
    console.log(this.sockets);
    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);

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
        console.log(`[ws:message] error ${error}`);
        throw Error(error);
      }
    });

    socket.send(
      JSON.stringify({ type: MESSAGES.BLOCKS, value: blockchain.blocks })
    );
  }

  sync() {
    const {
      blockchain: { blocks },
    } = this;

    this.broadcast(MESSAGES.BLOCKS, blocks);
  }

  broadcast(type, value) {
    console.log(`[ws:broadcast] ${type}...`);
    const message = JSON.stringify({ type, value });

    this.sockets.forEach((socket) => {
      socket.send(message);
    });
  }
}

export { P2PService, MESSAGES };
