import {createReadStream} from 'node:fs';

export const solvePart1 = async (filepath: string): Promise<string> => {
  let counter = 0;
  const chunk: Array<string> = [];
  for await (const char of getChars(filepath)) {
    counter += 1;
    chunk.push(char);
    if (chunk.length === 4) {
      if (hasNoRepeatedElements(chunk)) return counter.toString();
      chunk.shift();
    }
  }
  return '';
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  let counter = 0;
  const chunk: Array<string> = [];
  for await (const char of getChars(filepath)) {
    counter += 1;
    chunk.push(char);
    if (chunk.length === 14) {
      if (hasNoRepeatedElements(chunk)) return counter.toString();
      chunk.shift();
    }
  }
  return '';
};

function hasNoRepeatedElements(array: string[]): boolean {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) return false;
    }
  }
  return true;
}

async function* getChars(
  filepath: string
): AsyncGenerator<string, void, unknown> {
  const reader = createReadStream(filepath, {flags: 'r', encoding: 'utf-8'});
  for await (const chunk of reader) {
    for (const char of chunk) {
      yield char as string;
    }
  }
}
