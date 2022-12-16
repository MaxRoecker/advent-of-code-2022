import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {asyncGeneratorToArray} from './iterators';

export async function solvePart1(filepath: string): Promise<string> {
  const calories = await asyncGeneratorToArray(getCalories(filepath));
  const max = Math.max(...calories);
  return max.toString(10);
}

export async function solvePart2(filepath: string): Promise<string> {
  const calories = await asyncGeneratorToArray(getCalories(filepath));
  const inverse = calories.sort((a, b) => b - a);
  const top3 = inverse.slice(0, 3);
  const sum = top3.reduce((acc, value) => acc + value, 0);
  return sum.toString(10);
}

async function* getCalories(
  filepath: string
): AsyncGenerator<number, void, unknown> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  let sum = 0;
  for await (const line of reader) {
    if (line === '') {
      yield sum;
      sum = 0;
    } else {
      const current = Number.parseInt(line, 10);
      sum = current + sum;
    }
  }
}
