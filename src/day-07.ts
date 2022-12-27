import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

export const solvePart1 = async (filepath: string): Promise<string> => {
  const root = await getDirectoryTree(filepath);
  const directories = root.findDirectoriesSizeUntil(100_000);
  const sum = directories.reduce((acc, d) => d.size + acc, 0);
  return sum.toString();
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  const root = await getDirectoryTree(filepath);
  const availableSpace = 70_000_000;
  const requiredSpace = 30_000_000;
  const freeSpace = availableSpace - root.size;
  const neededSpace = requiredSpace - freeSpace;
  const directories = root.findDirectoriesSizedFrom(neededSpace);
  const smallest = directories.reduce((smallest, current) => {
    return smallest.size > current.size ? current : smallest;
  });
  return smallest.size.toString();
};

class Directory {
  readonly name: string;
  readonly parent: Directory;
  #dirsByName: Map<string, Directory>;
  #filesByName: Map<string, File>;
  #size: number;

  constructor(name: string, parent?: Directory) {
    this.parent = parent == null ? this : parent;
    this.name = name;
    this.#dirsByName = new Map();
    this.#filesByName = new Map();
    this.#size = Number.NaN;
  }

  getDirectory(name: string): Directory | undefined {
    return this.#dirsByName.get(name);
  }

  addDirectory(directory: Directory): void {
    const key = directory.name;
    this.#dirsByName.set(key, directory);
  }

  getFile(name: string): File | undefined {
    return this.#filesByName.get(name);
  }

  addFile(file: File): void {
    const key = file.name;
    this.#filesByName.set(key, file);
  }

  get size(): number {
    if (Number.isNaN(this.#size)) {
      let sum = 0;
      for (const directory of this.#dirsByName.values()) {
        sum = sum + directory.size;
      }
      for (const file of this.#filesByName.values()) {
        sum = sum + file.size;
      }
      this.#size = sum;
    }
    return this.#size;
  }

  findDirectoriesSizeUntil(max: number): Array<Directory> {
    const result: Array<Directory> = [];
    if (this.size <= max) result.push(this);
    for (const directory of this.#dirsByName.values()) {
      result.push(...directory.findDirectoriesSizeUntil(max));
    }
    return result;
  }

  findDirectoriesSizedFrom(min: number): Array<Directory> {
    const result: Array<Directory> = [];
    if (this.size >= min) result.push(this);
    for (const directory of this.#dirsByName.values()) {
      result.push(...directory.findDirectoriesSizedFrom(min));
    }
    return result;
  }
}

class File {
  public readonly name: string;
  public readonly size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

async function getDirectoryTree(filepath: string): Promise<Directory> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const iterator = reader[Symbol.asyncIterator]();
  await Promise.all([iterator.next(), iterator.next()]);
  const root = new Directory('/');
  let cwd = root;
  let result: IteratorResult<string, unknown> = await iterator.next();
  while (!result.done) {
    let match: RegExpMatchArray | null = null;
    match = result.value.match(/^\$ cd (\w+|\.\.)$/);
    if (match != null) {
      const [, name] = match;
      cwd = name === '..' ? cwd.parent : cwd.getDirectory(name)!;
    }
    match = result.value.match(/^dir (\w+)$/);
    if (match != null) {
      const [, name] = match;
      const dir = cwd.getDirectory(name);
      if (dir == null) {
        cwd.addDirectory(new Directory(name, cwd));
      }
    }
    match = result.value.match(/^(\d+) (\w+\.\w+|\w+)$/);
    if (match != null) {
      const [, sizeStr, name] = match;
      const file = cwd.getFile(name);
      if (file == null) {
        const size = Number.parseInt(sizeStr);
        cwd.addFile(new File(name, size));
      }
    }
    result = await iterator.next();
  }
  return root;
}
