import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

export const solve = async (filepath: string): Promise<string> => {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  let max = 0;
  let sum = 0;

  for await (const line of reader) {
    if (line === '') {
      if (sum > max) {
        max = sum;
      }
      sum = 0;
    } else {
      const current = Number.parseInt(line, 10);
      sum = sum + current;
    }
  }

  return max.toString(10);
};
