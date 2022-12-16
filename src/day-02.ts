import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

type OpponentMove = 'A' | 'B' | 'C';

type YourMove = 'X' | 'Y' | 'Z';

type MoveLUT = Readonly<
  Record<OpponentMove, Readonly<Record<YourMove, number>>>
>;

const solve = async (filepath: string, lut: MoveLUT): Promise<number> => {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  let sum = 0;

  for await (const line of reader) {
    const [opponent, you] = line.split(' ') as [OpponentMove, YourMove];
    const points = lut[opponent][you];
    sum = sum + points;
  }

  return sum;
};

export const solvePart1 = async (filepath: string): Promise<string> => {
  const lut: MoveLUT = {
    A: {X: 1 + 3, Y: 2 + 6, Z: 3 + 0},
    B: {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
    C: {X: 1 + 6, Y: 2 + 0, Z: 3 + 3},
  };
  const sum = await solve(filepath, lut);
  return sum.toString(10);
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  const lut: MoveLUT = {
    A: {X: 3 + 0, Y: 1 + 3, Z: 2 + 6},
    B: {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
    C: {X: 2 + 0, Y: 3 + 3, Z: 1 + 6},
  };
  const sum = await solve(filepath, lut);
  return sum.toString(10);
};
