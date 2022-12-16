import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

export const solvePart1 = async (filepath: string): Promise<string> => {
  let counter = 0;
  for await (const [first, second] of getAssignmentPairs(filepath)) {
    if (first.contains(second) || first.isContainedBy(second)) {
      counter = counter + 1;
    }
  }
  return counter.toString(10);
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  let counter = 0;
  for await (const [first, second] of getAssignmentPairs(filepath)) {
    if (first.overlaps(second)) {
      counter = counter + 1;
    }
  }
  return counter.toString(10);
};

async function* getAssignmentPairs(
  filepath: string
): AsyncGenerator<[Assignment, Assignment], void, unknown> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  for await (const line of reader) {
    const pair = line.split(',');
    const [first, second] = pair.map(str => new Assignment(str));
    yield [first, second];
  }
}

class Assignment {
  public readonly start: number;
  public readonly end: number;

  constructor(str: string) {
    const [start, end] = str.split('-');
    this.start = Number.parseInt(start);
    this.end = Number.parseInt(end);
  }

  contains(that: Assignment): boolean {
    return this.start <= that.start && this.end >= that.end;
  }

  isContainedBy(that: Assignment): boolean {
    return that.contains(this);
  }

  overlaps(that: Assignment): boolean {
    if (this.contains(that) || this.isContainedBy(that)) return true;
    return (
      (this.start <= that.start && this.end >= that.start) ||
      (this.start <= that.end && this.end >= that.end)
    );
  }
}
