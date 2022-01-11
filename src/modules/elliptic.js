import Elliptic from 'elliptic';
import { hash } from './hash';

// eslint-disable-next-line new-cap
const ec = new Elliptic.ec('secp256k1');

const elliptic = {
  createKeyPair: () => ec.genKeyPair(),
  verifySignature: (publickey, signature, data) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    ec.keyFromPublic(publickey, 'hex').verify(hash(data), signature),
};
export { elliptic };
