export async function asyncGeneratorToArray<T>(
  gen: AsyncIterable<T>
): Promise<Array<T>> {
  const result: Array<T> = [];
  for await (const item of gen) {
    result.push(item);
  }
  return result;
}
