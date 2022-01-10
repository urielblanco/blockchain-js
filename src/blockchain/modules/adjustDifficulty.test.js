import { adjustDifficulty } from '@blockchain/modules';

describe('adjustDifficulty()', () => {
  let block;
  let startsMined;
  beforeEach(() => {
    startsMined = Date.now();
    block = { difficulty: 3 };
  });

  it('same difficulty if the blocks timestamp is between the rate range', () => {
    expect(adjustDifficulty(block, startsMined, startsMined + 1500)).toEqual(
      block.difficulty
    );
  });
  it('lowers the difficulty for slowly mined blocks', () => {
    expect(adjustDifficulty(block, startsMined, startsMined + 6500)).toEqual(
      block.difficulty - 1
    );
  });

  it('incresed the difficulty for quick mined blocks', () => {
    expect(adjustDifficulty(block, startsMined, startsMined + 500)).toEqual(
      block.difficulty + 1
    );
  });
});
