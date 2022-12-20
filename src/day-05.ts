import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

type Move = {
  count: number;
  from: number;
  to: number;
};

export const solvePart1 = async (filepath: string): Promise<string> => {
  const stacks: Array<Array<string>> = [
    [...'PZMTRCN'],
    [...'ZBSTND'],
    [...'GTCFRQHM'],
    [...'ZRG'],
    [...'HRNZ'],
    [...'DLZPWSHF'],
    [...'MGCRZDW'],
    [...'QZWHLFJS'],
    [...'NWPQS'],
  ];
  for await (const move of getMoves(filepath)) {
    const {count, from, to} = move;
    const substack = stacks[from].splice(0, count).reverse();
    stacks[to].splice(0, 0, ...substack);
  }
  return stacks.map(stack => stack[0]).join('');
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  const stacks: Array<Array<string>> = [
    [...'PZMTRCN'],
    [...'ZBSTND'],
    [...'GTCFRQHM'],
    [...'ZRG'],
    [...'HRNZ'],
    [...'DLZPWSHF'],
    [...'MGCRZDW'],
    [...'QZWHLFJS'],
    [...'NWPQS'],
  ];
  for await (const move of getMoves(filepath)) {
    const {count, from, to} = move;
    const substack = stacks[from].splice(0, count);
    stacks[to].splice(0, 0, ...substack);
  }
  return stacks.map(stack => stack[0]).join('');
};

async function* getMoves(
  filepath: string
): AsyncGenerator<Move, void, unknown> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const iterator = reader[Symbol.asyncIterator]();
  let result = await iterator.next();
  while (!result.done && result.value !== '') {
    result = await iterator.next();
  }
  result = await iterator.next();
  while (!result.done) {
    const regexp = /^move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)$/;
    const matchResult = result.value.match(regexp);
    if (matchResult != null) {
      const matches = matchResult.slice(1).map(v => Number.parseInt(v, 10));
      const [count, from, to] = matches;
      yield {count, from: from - 1, to: to - 1};
    }
    result = await iterator.next();
  }
}
