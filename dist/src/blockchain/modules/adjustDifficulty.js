"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustDifficulty = void 0;
var RATE_RANGE = [1000, 3000];

var adjustDifficulty = function adjustDifficulty(previousBlock, startsMined, timestamp) {
  var difficulty = previousBlock.difficulty;
  var MIN_RATE = RATE_RANGE[0],
      MAX_RATE = RATE_RANGE[1];
  var diff = timestamp - startsMined;
  if (diff < MIN_RATE) return difficulty + 1;
  if (diff > MAX_RATE) return difficulty - 1;
  return difficulty;
};

exports.adjustDifficulty = adjustDifficulty;