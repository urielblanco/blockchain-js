import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '@modules';

const REWARD = 1;
class Transaction {
  constructor() {
    this.id = uuidv1();
    this.input = null;
    this.outputs = [];
  }

  static create(senderWallet, recipientAdress, amount) {
    const { balance, publicKey } = senderWallet;

    if (amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);

    const transaction = new Transaction();
    transaction.outputs.push(
      ...[
        { amount: balance - amount, address: publicKey },
        { amount, address: recipientAdress },
      ]
    );

    transaction.input = Transaction.sign(transaction, senderWallet);

    return transaction;
  }

  static sign(transaction, senderWallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(transaction.outputs),
    };
  }

  static reward(minerWallet, blockchainWallet) {
    return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
  }

  static verify(transaction) {
    const {
      input: { address, signature },
      outputs,
    } = transaction;

    return elliptic.verifySignature(address, signature, outputs);
  }

  update(senderWallet, recipientAddress, amount) {
    const senderOutput = this.outputs.find(
      ({ address }) => address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      throw Error(`Amount: ${amount} exceeds balance.`);
    }

    senderOutput.amount -= amount;

    this.outputs.push({ amount, address: recipientAddress });
    this.input = Transaction.sign(this, senderWallet);

    return this;
  }
}

export { Transaction, REWARD };
