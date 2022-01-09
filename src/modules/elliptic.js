import Elliptic from 'elliptic';
import { hash } from '@modules';

const ec = new Elliptic.ec('secp256k1');

const elliptic = {
  createKeyPair: () => ec.genKeyPair(),
  verifySignature: (publickey, signature, data) => {
    return ec.keyFromPublic(publickey, 'hex').verify(hash(data), signature);
  },
};
export { elliptic };
