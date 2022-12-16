import {strict as assert} from 'node:assert';
// eslint-disable-next-line node/no-unpublished-import
import {describe, it} from 'mocha';
import {solve} from '../src/day-01';

describe('for Advent of Code Day#1', () => {
  it('should get the correct response', async () => {
    const filepath = './inputs/day-01.txt';
    const answer = '67016';
    const response = await solve(filepath);
    assert.equal(response, answer);
  });
});
