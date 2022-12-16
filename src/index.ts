import * as Day01 from './day-01';

export interface Solution {
  solve(filepath: string): Promise<string>;
}

export type Day = '01';

export const solutionByDay: ReadonlyMap<Day, Solution> = new Map([
  ['01', Day01],
]);
