"use strict";

var _adjustDifficulty = require("./adjustDifficulty");

describe('adjustDifficulty()', function () {
  var block;
  var startsMined;
  beforeEach(function () {
    startsMined = Date.now();
    block = {
      difficulty: 3
    };
  });
  it('same difficulty if the blocks timestamp is between the rate range', function () {
    expect((0, _adjustDifficulty.adjustDifficulty)(block, startsMined, startsMined + 1500)).toEqual(block.difficulty);
  });
  it('lowers the difficulty for slowly mined blocks', function () {
    expect((0, _adjustDifficulty.adjustDifficulty)(block, startsMined, startsMined + 6500)).toEqual(block.difficulty - 1);
  });
  it('incresed the difficulty for quick mined blocks', function () {
    expect((0, _adjustDifficulty.adjustDifficulty)(block, startsMined, startsMined + 500)).toEqual(block.difficulty + 1);
  });
});