import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

const solve = async (filepath: string): Promise<Array<number>> => {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  const counter: Array<number> = [0];
  let index = 0;

  for await (const line of reader) {
    if (line === '') {
      index = index + 1;
      counter.push(0);
    } else {
      const sum = counter[index];
      const current = Number.parseInt(line, 10);
      counter[index] = sum + current;
    }
  }

  return counter;
};

export const solvePart1 = async (filepath: string): Promise<string> => {
  const counter = await solve(filepath);
  const max = Math.max(...counter);
  return max.toString(10);
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  const counter = await solve(filepath);
  const inverse = counter.sort((a, b) => b - a);
  const top3 = inverse.slice(0, 3);
  const sum = top3.reduce((acc, value) => acc + value, 0);
  return sum.toString(10);
};
