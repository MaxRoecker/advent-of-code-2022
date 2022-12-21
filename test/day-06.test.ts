import {strict as assert} from 'node:assert';
// eslint-disable-next-line node/no-unpublished-import
import {describe, it} from 'mocha';
import {solvePart1, solvePart2} from '../src/day-06';

describe('for Advent of Code Day#6', () => {
  it('should get the correct response for Part 1', async () => {
    const filepath = './inputs/day-06.txt';
    const answer = '1987';
    const response = await solvePart1(filepath);
    assert.equal(response, answer);
  });

  it('should get the correct response for Part 2', async () => {
    const filepath = './inputs/day-06.txt';
    const answer = '3059';
    const response = await solvePart2(filepath);
    assert.equal(response, answer);
  });
});