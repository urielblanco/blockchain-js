import { SHA256 } from 'crypto-js';
import { Block } from './block';

describe('Block', () => {
  let timestamp;
  let previousBlock;
  let hash;
  let data;

  beforeEach(() => {
    timestamp = new Date(2000, 0, 1).getTime();
    previousBlock = Block.genesis;
    hash = 'h4sh';
    data = 't3st d4t4';
  });

  it('create an instance with parameters', () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  it('use static mine()', () => {
    const block = Block.mine(previousBlock, data);

    expect(block.hash.length).toEqual(64);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.data).toEqual(data);
  });

  it('use static hash()', () => {
    const hashActual = Block.hash(timestamp, previousBlock.hash, data);
    const hashExpected = SHA256(
      `${timestamp}${previousBlock.hash}${data}`
    ).toString();

    expect(hashActual).toEqual(hashExpected);
  });

  it('use toString()', () => {
    const block = Block.mine(previousBlock, data);

    expect(typeof block.toString()).toEqual('string');
  });
});
