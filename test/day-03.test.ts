import {strict as assert} from 'node:assert';
// eslint-disable-next-line node/no-unpublished-import
import {describe, it} from 'mocha';
import {solvePart1, solvePart2} from '../src/day-03';

describe('for Advent of Code Day#3', () => {
  it('should get the correct response for Part 1', async () => {
    const filepath = './inputs/day-03.txt';
    const answer = '8039';
    const response = await solvePart1(filepath);
    assert.equal(response, answer);
  });

  it('should get the correct response for Part 2', async () => {
    const filepath = './inputs/day-03.txt';
    const answer = '2510';
    const response = await solvePart2(filepath);
    assert.equal(response, answer);
  });
});
