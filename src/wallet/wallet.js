import Elliptic from 'elliptic';

const ec = new Elliptic.ec('secp256k1');
const INITIAL_BALANCE = 100;

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    const { publicKey, balance } = this;

    return `Wallet
      publicKey       : ${publicKey.toString()}
      balance         : ${balance}`;
  }
}

export { Wallet, INITIAL_BALANCE };
