const RATE_RANGE = [1000, 3000];

const adjustDifficulty = (previousBlock, startsMined, timestamp) => {
  const { difficulty } = previousBlock;
  const [MIN_RATE, MAX_RATE] = RATE_RANGE;

  const diff = timestamp - startsMined;

  if (diff < MIN_RATE) return difficulty + 1;

  if (diff > MAX_RATE) return difficulty - 1;

  return difficulty;
};

export { adjustDifficulty };
