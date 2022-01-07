import { Block } from './block';
import { Blockchain } from './blockchain';

describe('Blockchain', () => {
  let blockchain;
  let blockchainLonger;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchainLonger = new Blockchain();
  });

  it('every blockchain has a genesis block', () => {
    const [genesisBlock] = blockchain.blocks;

    expect(genesisBlock).toEqual(Block.genesis);
    expect(blockchain.blocks.length).toEqual(1);
  });

  it('use addBlock()', () => {
    const data = 'd4t4';
    blockchain.addBlock(data);

    const [, lastBlock] = blockchain.blocks;

    expect(lastBlock.data).toEqual(data);
    expect(blockchain.blocks.length).toEqual(2);
  });

  it('replaces the chain with a valid chain', () => {
    blockchainLonger.addBlock('bl4ck-1');

    blockchain.replace(blockchainLonger.blocks);

    expect(blockchain.blocks).toEqual(blockchainLonger.blocks);
  });

  it('does not replace the chain with one with less blocks', () => {
    blockchain.addBlock('bl4ck-1');

    expect(() => {
      blockchain.replace(blockchainLonger.blocks);
    }).toThrowError('Received chain is not longer than the current chain.');
  });

  it('not replace the chain with one that is not valid', () => {
    blockchainLonger.addBlock('bl4ck-1');

    blockchainLonger.blocks[1].data = 'h4ck';

    expect(() => {
      blockchain.replace(blockchainLonger.blocks);
    }).toThrowError('Received chain is invalid.');
  });
});
