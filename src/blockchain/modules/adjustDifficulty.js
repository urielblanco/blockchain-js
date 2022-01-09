const RATE_RANGE = [1000, 3000];

const adjustDifficulty = (previousBlock, startsMined, timestamp) => {
  const { difficulty } = previousBlock;
  const [MIN_RATE, MAX_RATE] = RATE_RANGE;

  const diff = timestamp - startsMined;

  return diff < MIN_RATE
    ? difficulty + 1
    : diff > MAX_RATE
    ? difficulty - 1
    : difficulty;
};

export { adjustDifficulty };
