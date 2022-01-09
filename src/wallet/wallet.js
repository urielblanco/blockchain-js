import { hash, elliptic } from '@modules';
const INITIAL_BALANCE = 100;

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    const { publicKey, balance } = this;

    return `Wallet
      publicKey       : ${publicKey.toString()}
      balance         : ${balance}`;
  }

  sign(data) {
    return this.keyPair.sign(hash(data));
  }
}

export { Wallet, INITIAL_BALANCE };
