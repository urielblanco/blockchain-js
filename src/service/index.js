import { Blockchain } from '@blockchain';
import { Wallet } from '@wallet';

import { P2PService, MESSAGES } from './p2p';

import express from 'express';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
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

app.get('/transactions', (req, res) => {
  const {
    memoryPool: { transactions },
  } = blockchain;

  res.status(200).json(transactions);
});

app.post('/transactions', (req, res) => {
  const {
    body: { recipient, amount },
  } = req;

  try {
    const tx = wallet.createTransaction(recipient, amount);
    p2pservice.broadcast(MESSAGES.TX, tx);
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`Service HTTP: ${HTTP_PORT} listening...`);
  p2pservice.listen();
});
