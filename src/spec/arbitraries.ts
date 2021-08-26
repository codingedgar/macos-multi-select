import fc from 'fast-check';
import { sort, uniq, head, tail, init, last } from 'ramda';

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

export function index() {
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
    .map(([index, startStart, startEnd, endStart, endEnd, start, end]) =>
        [
          index,
          ...sort(ascending, [
            startStart % index.length,
            startEnd % index.length,
            endStart % index.length,
            endEnd % index.length,
          ]),
          start,
          end,
        ] as const
    )
    .map(([index, startStart, startEnd, endStart, endEnd, start, end]) =>
        [
          index,
          startStart,
          startEnd,
          endStart,
          endEnd,
          (start % (startEnd - startStart + 1)) + startStart,
          (end % (endEnd - endStart + 1)) + endStart,
        ] as const
    )
    .map(([index, startStart, startEnd, endStart, endEnd, start, end]) => ({
        index,
        adjacentGroup1: index.slice(startStart, start),
        adjacentGroup2: index.slice(start + 1, startEnd),
        // if startEnd is the same as endStart
        // end can be a member of group3
        adjacentGroup3: index.slice(endStart + ((startEnd === endStart) ? 1 : 0), end),
        adjacentGroup4: index.slice(end + 1, endEnd),
        end: index[end],
        start: index[start],
      })
  )
}

export function indexWithSelection() {
  return fc.tuple(
    fc.set(
      fc.string(),
      { minLength: 1 }
    ),
    fc.array(fc.nat(), { minLength: 1 }),
    fc.nat()
  )
  .map(([index, selectedIndices, selectOneIndex]) => {
    const selected = uniq(selectedIndices.map(i => index[i % index.length]));
    const selectOne = selected[selectOneIndex % selected.length];

    return {
      index,
      selected,
      selectOne
    }
  })
}

export function indexWithOneAdjacentAscendingSelection() {
  return fc
    .tuple(
      fc.set(fc.string(), { minLength: 2 }),
      fc.nat(),
      fc.nat(),
    )
    .map(([index, n1, n2]) => {
      
      
      const n1InRange = n1 % index.length;
      const n2InRange = n2 % index.length;

      const start = Math.min(n1InRange, n2InRange) - 1;
      const end = Math.max(n1InRange, n2InRange) + 1;
      const subArray =  index.slice(start, end);

      return {
        index,
        subArray,
      }
    });

}
