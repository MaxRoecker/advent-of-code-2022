export interface Solution {
  solvePart1(filepath: string): Promise<string>;
  solvePart2(filepath: string): Promise<string>;
}
