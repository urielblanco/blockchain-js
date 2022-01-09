import { SHA256 } from 'crypto-js';
import { Block, DIFFICULTY } from './block';

describe('Block', () => {
  let timestamp;
  let previousBlock;
  let hash;
  let data;
  let nonce;

  beforeEach(() => {
    timestamp = new Date(2000, 0, 1).getTime();
    previousBlock = Block.genesis;
    hash = 'h4sh';
    data = 't3st d4t4';
    nonce = 128;
  });

  it('create an instance with parameters', () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
  });

  it('use static mine()', () => {
    const block = Block.mine(previousBlock, data);
    const { difficulty } = block;

    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.nonce).not.toEqual(0);
    expect(block.data).toEqual(data);
  });

  it('use static hash()', () => {
    const hashActual = Block.hash(
      timestamp,
      previousBlock.hash,
      data,
      nonce,
      DIFFICULTY
    );
    const hashExpected = SHA256(
      `${timestamp}${previousBlock.hash}${data}${nonce}${DIFFICULTY}`
    ).toString();

    expect(hashActual).toEqual(hashExpected);
  });

  it('use toString()', () => {
    const block = Block.mine(previousBlock, data);

    expect(typeof block.toString()).toEqual('string');
  });
});
