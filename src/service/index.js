import { Block, Blockchain } from '@blockchain';
import { P2PService } from './p2p';

import express from 'express';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const p2pservice = new P2PService(blockchain);

app.use(express.json());

app.get('/blocks', (req, res) => {
  res.status(200).json(blockchain.blocks);
});

app.post('/mine', (req, res) => {
  const {
    body: { data },
  } = req;
  const block = blockchain.addBlock(data);

  p2pservice.sync();

  res.status(201).json({
    blocks: blockchain.blocks.length,
    block,
  });
});

app.listen(HTTP_PORT, () => {
  console.log(`Service HTTP: ${HTTP_PORT} listening...`);
  p2pservice.listen();
});
