import { Block } from '../block';

export const validate = (blockchain) => {
  const [genesisBlock, ...blocks] = blockchain;

  if (JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis))
    throw Error('Invalid genesis block.');

  for (let i = 0; i < blocks.length; i++) {
    const { timestamp, previousHash, hash, data } = blocks[i];
    const previousBlock = blockchain[i];

    if (previousHash !== previousBlock.hash)
      throw Error('Invalid previous hash.');

    if (hash !== Block.hash(timestamp, previousHash, data))
      throw Error('Invalid hash.');
  }
  return true;
};
