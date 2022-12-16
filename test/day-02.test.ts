import {strict as assert} from 'node:assert';
// eslint-disable-next-line node/no-unpublished-import
import {describe, it} from 'mocha';
import {solve} from '../src/day-02';

describe('for Advent of Code Day#2', () => {
  it('should get the correct response', async () => {
    const filepath = './inputs/day-02.txt';
    const answer = '10624';
    const response = await solve(filepath);
    assert.equal(response, answer);
  });
});
