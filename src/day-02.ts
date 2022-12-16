import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

type OpponentMove = 'A' | 'B' | 'C';

type YourMove = 'X' | 'Y' | 'Z';

const LUT: Record<OpponentMove, Record<YourMove, number>> = {
  A: {X: 1 + 3, Y: 2 + 6, Z: 3 + 0},
  B: {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
  C: {X: 1 + 6, Y: 2 + 0, Z: 3 + 3},
};

export const solve = async (filepath: string): Promise<string> => {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  let sum = 0;

  for await (const line of reader) {
    const [opponent, you] = line.split(' ') as [OpponentMove, YourMove];
    const points = LUT[opponent][you];
    sum = sum + points;
  }

  return sum.toString(10);
};
