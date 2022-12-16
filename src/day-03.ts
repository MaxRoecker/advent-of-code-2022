import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

export const solvePart1 = async (filepath: string): Promise<string> => {
  let sum = 0;

  for await (const group of getGroups(filepath, 1)) {
    const [rucksack] = group;
    const mid = Math.floor(rucksack.length / 2);
    const compartment1 = new Set(rucksack.slice(0, mid));
    const compartment2 = new Set(rucksack.slice(mid));
    for (const item of rucksack) {
      if (compartment1.has(item) && compartment2.has(item)) {
        sum = sum + priorityByChar[item];
        break;
      }
    }
  }

  return sum.toString(10);
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  let sum = 0;

  for await (const group of getGroups(filepath, 3)) {
    const groupset = group.map(rucksack => new Set(rucksack));
    const items = new Set(groupset.flatMap(group => [...group]));
    for (const item of items) {
      if (groupset.every(group => group.has(item))) {
        sum = sum + priorityByChar[item];
        break;
      }
    }
  }

  return sum.toString(10);
};

const priorityByChar = Object.fromEntries([
  ...Array.from('abcdefghijklmnopqrstuvwxyz').map(char => {
    const priority = char.charCodeAt(0) - 96;
    return [char, priority] as const;
  }),
  ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(char => {
    const priority = char.charCodeAt(0) - 38;
    return [char, priority] as const;
  }),
]);

async function* getGroups(
  filepath: string,
  size = 1
): AsyncGenerator<string[], void, unknown> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  let group: Array<string> = [];

  for await (const line of reader) {
    group.push(line);
    if (group.length === size) {
      yield group;
      group = [];
    }
  }
}
