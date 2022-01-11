import { Blockchain } from '@blockchain';
import { Wallet } from '@wallet';
import { P2PService, MESSAGES } from '@p2p';
import { Miner } from '@miner';

import express from 'express';

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const p2pservice = new P2PService(blockchain);
const miner = new Miner(blockchain, p2pservice, walletMiner);

app.use(express.json());

app.get('/wallet', (req, res) => {
  const { publicKey } = new Wallet(blockchain);

  res.status(200).json({ publicKey });
});

app.get('/blocks', (req, res) => {
  res.status(200).json(blockchain.blocks);
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

app.get('/mine/transactions', (req, res) => {
  try {
    miner.mine();
    res.redirect('/blocks');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { app, p2pservice };
