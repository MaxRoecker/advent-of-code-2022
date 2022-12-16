import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

type OpponentMove = 'A' | 'B' | 'C';

type YourMove = 'X' | 'Y' | 'Z';

type MoveLUT = Readonly<
  Record<OpponentMove, Readonly<Record<YourMove, number>>>
>;

export async function solvePart1(filepath: string): Promise<string> {
  const lut: MoveLUT = {
    A: {X: 1 + 3, Y: 2 + 6, Z: 3 + 0},
    B: {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
    C: {X: 1 + 6, Y: 2 + 0, Z: 3 + 3},
  };
  let sum = 0;
  for await (const [opponent, you] of getMoves(filepath)) {
    const points = lut[opponent][you];
    sum = sum + points;
  }
  return sum.toString(10);
}

export async function solvePart2(filepath: string): Promise<string> {
  const lut: MoveLUT = {
    A: {X: 3 + 0, Y: 1 + 3, Z: 2 + 6},
    B: {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
    C: {X: 2 + 0, Y: 3 + 3, Z: 1 + 6},
  };
  let sum = 0;
  for await (const [opponent, you] of getMoves(filepath)) {
    const points = lut[opponent][you];
    sum = sum + points;
  }
  return sum.toString(10);
}

async function* getMoves(
  filepath: string
): AsyncGenerator<[OpponentMove, YourMove], void, unknown> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  for await (const line of reader) {
    yield line.split(' ') as [OpponentMove, YourMove];
  }
}
