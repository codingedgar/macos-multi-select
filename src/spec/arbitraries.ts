import fc from 'fast-check';
import { sort } from 'ramda';

export function subsequentSubarray(arr: string[]) {
  return fc.tuple(fc.nat(arr.length), fc.nat(arr.length))
  .map(([a, b]) => a < b ? [a, b] : [b, a])
  .map(([from, to]) => arr.slice(from, to));
}

export function nonEmptySubsequentSubarray(nonEmptyArray: string[]) {
  return fc.tuple(fc.nat(nonEmptyArray.length), fc.nat(nonEmptyArray.length))
  .map(([a, b]) => a < b ? [a, b + 1] : [b, a + 1])
  .map(([from, to]) => nonEmptyArray.slice(from, to));
}

export function list() {
  return fc.set(fc.string())
}

export function ascending (a: number, b:number): number {
  return a - b;
}

export function descending (a:number, b:number): number {
  return b - a;
}

export function takeFromTo<T>(array: T[], start: T, end: T) {
  const startIndex = array.indexOf(start);
  const endIndex = array.indexOf(end) + 1;

  return array.slice(startIndex, endIndex);
}

export function indexWithAdjacentConnections() {
  return fc
    .tuple(
      fc.set(
        fc.string(),
        { minLength: 1 }
      ),
      fc.nat(),
      fc.nat(),
      fc.nat(),
      fc.nat(),
      fc.nat(),
      fc.nat(),
    )
    .map(([list, startStart, startEnd, endStart, endEnd, start, end]) =>
        [
          list,
          ...sort(ascending, [
            startStart % list.length,
            startEnd % list.length,
            endStart % list.length,
            endEnd % list.length,
          ]),
          start,
          end,
        ] as const
    )
    .map(([list, startStart, startEnd, endStart, endEnd, start, end]) =>
        [
          list,
          startStart,
          startEnd,
          endStart,
          endEnd,
          (start % (startEnd - startStart + 1)) + startStart,
          (end % (endEnd - endStart + 1)) + endStart,
        ] as const
    )
    .map(([list, startStart, startEnd, endStart, endEnd, start, end]) => ({
        list,
        adjacentGroup1: list.slice(startStart, start),
        adjacentGroup2: list.slice(start + 1, startEnd),
        // if startEnd is the same as endStart
        // end can be a member of group3
        adjacentGroup3: list.slice(endStart + ((startEnd === endStart) ? 1 : 0), end),
        adjacentGroup4: list.slice(end + 1, endEnd),
        end: list[end],
        start: list[start],
      })
  )
}
