import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline/promises';

type Grid<T> = Array<Array<T>>;

export const solvePart1 = async (filepath: string): Promise<string> => {
  const heights = await getHeightGrid(filepath);
  const visibilities = getVisibilityGrid(heights);
  let count = 0;
  for (let row = 0; row < visibilities.length; row = row + 1) {
    for (let col = 0; col < visibilities[row].length; col = col + 1) {
      const visible = visibilities[row][col];
      if (visible) {
        count = count + 1;
      }
    }
  }
  return count.toString(10);
};

export const solvePart2 = async (filepath: string): Promise<string> => {
  const heights = await getHeightGrid(filepath);
  const scores = getScenicScoreGrid(heights);
  let max = -Infinity;
  for (let row = 0; row < scores.length; row = row + 1) {
    for (let col = 0; col < scores[row].length; col = col + 1) {
      const score = scores[row][col];
      if (score > max) {
        max = score;
      }
    }
  }
  return max.toString();
};

async function getHeightGrid(filepath: string): Promise<Grid<number>> {
  const reader = createInterface({
    input: createReadStream(filepath),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const heights: Grid<number> = [];
  for await (const line of reader) {
    heights.push(Array.from(line, d => Number.parseInt(d)));
  }
  return heights;
}

function getVisibilityGrid(heights: Grid<number>): Grid<boolean> {
  const rows = heights.length;

  const top = Array.from(heights, (a, row) => Array.from(a, () => row));
  for (let row = 1; row < rows; row = row + 1) {
    const cols = heights[row].length;
    for (let col = 0; col < cols; col = col + 1) {
      const current = heights[row][col];
      const maxRow = top[row - 1][col];
      const max = heights[maxRow][col];
      if (current <= max) {
        top[row][col] = maxRow;
      }
    }
  }

  const right = Array.from(heights, a => Array.from(a, (_, col) => col));
  for (let row = 0; row < rows; row = row + 1) {
    const cols = heights[row].length;
    for (let col = cols - 2; col >= 0; col = col - 1) {
      const current = heights[row][col];
      const maxCol = right[row][col + 1];
      const max = heights[row][maxCol];
      if (current <= max) {
        right[row][col] = maxCol;
      }
    }
  }

  const bottom = Array.from(heights, (a, row) => Array.from(a, () => row));
  for (let row = rows - 2; row >= 0; row = row - 1) {
    const cols = heights[row].length;
    for (let col = 0; col < cols; col = col + 1) {
      const current = heights[row][col];
      const maxRow = bottom[row + 1][col];
      const max = heights[maxRow][col];
      if (current <= max) {
        bottom[row][col] = maxRow;
      }
    }
  }

  const left = Array.from(heights, a => Array.from(a, (_, col) => col));
  for (let row = 0; row < rows; row = row + 1) {
    const cols = heights[row].length;
    for (let col = 1; col < cols; col = col + 1) {
      const current = heights[row][col];
      const maxCol = left[row][col - 1];
      const max = heights[row][maxCol];
      if (current <= max) {
        left[row][col] = maxCol;
      }
    }
  }

  const visibility = Array.from(heights, (a, row) =>
    Array.from(a, (_, col) => {
      return (
        top[row][col] === row ||
        right[row][col] === col ||
        bottom[row][col] === row ||
        left[row][col] === col
      );
    })
  );

  return visibility;
}

function getScenicScoreGrid(heights: Grid<number>): Grid<number> {
  const result = Array.from(heights, a => Array.from(a, () => 0));

  const rows = heights.length - 1;

  for (let row = 1; row < rows; row = row + 1) {
    const cols = heights[row].length - 1;
    for (let col = 1; col < cols; col = col + 1) {
      const current = heights[row][col];

      let next: number;

      let top = 1;
      next = heights[row - top][col];
      while (top < row && current > next) {
        top = top + 1;
        next = heights[row - top][col];
      }

      let right = 1;
      next = heights[row][col + right];
      while (right < cols - col && current > next) {
        right = right + 1;
        next = heights[row][col + right];
      }

      let bottom = 1;
      next = heights[row + bottom][col];
      while (bottom < rows - row && current > next) {
        bottom = bottom + 1;
        next = heights[row + bottom][col];
      }

      let left = 1;
      next = heights[row][col - left];
      while (left < col && current > next) {
        left = left + 1;
        next = heights[row][col - left];
      }

      result[row][col] = top * right * bottom * left;
    }
  }
  return result;
}
