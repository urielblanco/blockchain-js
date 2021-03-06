import { Transaction } from '@transaction';

class MemoryPool {
  constructor() {
    this.transactions = [];
  }

  addOrUpdate(transaction) {
    const { input, outputs = [] } = transaction;
    const outputTotal = outputs.reduce((acc, cur) => acc + cur.amount, 0);

    if (input.amount !== outputTotal) {
      throw Error(`Invalid transaction from ${input.address}`);
    }
    if (!Transaction.verify(transaction)) {
      throw Error(`Invalid signature from ${input.address}`);
    }

    const txIndex = this.transactions.findIndex(
      ({ id }) => id === transaction.id
    );

    if (txIndex >= 0) this.transactions[txIndex] = transaction;
    else this.transactions.push(transaction);
  }

  find(address) {
    return this.transactions.find(({ input }) => input.address === address);
  }

  wipe() {
    this.transactions = [];
  }
}

export { MemoryPool };
