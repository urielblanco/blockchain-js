import { Blockchain } from '@blockchain';
import { Wallet, INITIAL_BALANCE } from './wallet';

describe('Wallet', () => {
  let blockchain;
  let wallet;

  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
  });

  it('it is a healthy wallet', () => {
    expect(wallet.balance).toEqual(INITIAL_BALANCE);
    expect(typeof wallet.keyPair).toEqual('object');
    expect(typeof wallet.publicKey).toEqual('string');
    expect(wallet.publicKey.length).toEqual(130);
  });

  it('use sign()', () => {
    const signature = wallet.sign('h3ll0');

    expect(typeof signature).toEqual('object');
    expect(signature).toEqual(wallet.sign('h3ll0'));
  });

  describe('creating a transaction', () => {
    let tx;
    let recipientAddress;
    let amount;

    beforeEach(() => {
      recipientAddress = 'r4nd0m-addr3355';
      amount = 5;
      tx = wallet.createTransaction(recipientAddress, amount);
    });

    describe('doing the same transaction', () => {
      beforeEach(() => {
        tx = wallet.createTransaction(recipientAddress, amount);
      });

      it('double the `amount` subtracted from the wallet balance', () => {
        const output = tx.outputs.find(
          ({ address }) => address === wallet.publicKey
        );

        expect(output.amount).toEqual(wallet.balance - amount * 2);
      });

      it('clones the `amount` output for the recipient', () => {
        const amounts = tx.outputs
          .filter(({ address }) => address === recipientAddress)
          .map((output) => output.amount);

        expect(amounts).toEqual([amount, amount]);
      });
    });
  });

  describe('calculating a balance', () => {
    let addBalance;
    let times;
    let senderWallet;

    beforeEach(() => {
      addBalance = 16;
      times = 3;
      senderWallet = new Wallet(blockchain);

      for (let i = 0; i < times; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance);
      }

      blockchain.addBlock(blockchain.memoryPool.transactions);
    });

    it('calculates the balance for blockchain txs matching the recipient', () => {
      expect(wallet.currentBalance).toEqual(
        INITIAL_BALANCE + addBalance * times
      );
    });

    it('calculates the balance for blockchain txs matching the sender', () => {
      expect(senderWallet.currentBalance).toEqual(
        INITIAL_BALANCE - addBalance * times
      );
    });

    describe('the recipient conducts a transaction', () => {
      let subtractedBalance;
      let recipientBalance;

      beforeEach(() => {
        blockchain.memoryPool.wipe();
        subtractedBalance = 64;
        recipientBalance = wallet.currentBalance;

        wallet.createTransaction(senderWallet.publicKey, addBalance);

        blockchain.addBlock(blockchain.memoryPool.transactions);
      });

      describe('the senders send another transaction to the recipient', () => {
        beforeEach(() => {
          blockchain.memoryPool.wipe();
          senderWallet.createTransaction(wallet.publicKey, addBalance);

          blockchain.addBlock(blockchain.memoryPool.transactions);
        });

        it('calculates the recipient balance only using txs since its most recent one', () => {
          expect(wallet.currentBalance).toEqual(
            recipientBalance - subtractedBalance + addBalance
          );
        });
      });
    });
  });
});
