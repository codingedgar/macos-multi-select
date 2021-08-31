import fc, { Arbitrary } from "fast-check";
import { sort, uniq, reverse, head, last, init, tail } from "ramda";

export function subsequentSubarray(arr: string[]): Arbitrary<string[]> {
  return fc.tuple(fc.nat(arr.length), fc.nat(arr.length))
    .map(([a, b]) => a < b ? [a, b] : [b, a])
    .map(([from, to]) => arr.slice(from, to));
}

export function nonEmptySubsequentSubarray(nonEmptyArray: string[]): Arbitrary<string[]> {
  return fc.tuple(fc.nat(nonEmptyArray.length), fc.nat(nonEmptyArray.length))
    .map(([a, b]) => a < b ? [a, b + 1] : [b, a + 1])
    .map(([from, to]) => nonEmptyArray.slice(from, to));
}

export function index(): Arbitrary<string[]> {
  return fc.set(fc.string());
}

export function nonEmptyIndex(): Arbitrary<string[]> {
  return fc.set(fc.string(), { minLength: 1 });
}

export function ascending (a: number, b:number): number {
  return a - b;
}

export function ascendingString (a: string, b:string): number {
  return a > b ? 1 : -1;
}

export function descending (a:number, b:number): number {
  return b - a;
}

export function takeFromTo<T>(array: T[], start: T, end: T): T[] {
  const startIndex = array.indexOf(start);
  const endIndex = array.indexOf(end) + 1;

  return array.slice(startIndex, endIndex);
}

export function indexWithAdjacentConnections(): Arbitrary<{
  index:string[],
  adjacentGroup1: string[],
  adjacentGroup2: string[],
  adjacentGroup3: string[],
  adjacentGroup4: string[],
  end: string
  start: string
}> {
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
    );
}

export function indexWithSelection() : Arbitrary<{
  index:string[],
  selected:string[],
  selectOne:string,
}>{
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
      };
    });
}

export function indexWithOneAdjacentAscendingSelection(): Arbitrary<{
  index: string[]
  subArray: string[]
}> {
  return fc
    .tuple(
      fc.set(fc.string(), { minLength: 2 }),
      fc.nat(),
      fc.nat(),
    )
    .map(([index, n1, n2]) => {
      
      const n1InRange = n1 % index.length;
      const n2InRange = n2 % index.length;
      
      const start = Math.min(n1InRange, n2InRange, index.length - 2);
      const end = Math.max(n1InRange, n2InRange, start + 1) + 1;
      const subArray =  index.slice(start, end);
      
      return {
        index,
        subArray,
      };
    });

}

export function indexWithOneAdjacentDescendingSelection(): Arbitrary<{
  index: string[]
  subArray: string[]
}> {
  return indexWithOneAdjacentAscendingSelection()
    .map(({
      index,
      subArray
    }) => ({
      index,
      subArray: reverse(subArray)
    }));

}

/**
 * @description an index with at least 3 items,
 * a selection that is min length 1, adjacent, ascending,
 * not in the start of the index nor the end
 * and an end 1 after the selection
 */
export function indexMin3WithOneAdjacentAscendingSelectionLessThanIndexLast() : Arbitrary<{
  index: string[];
  adjacentGroup:  string[];
  beforeSelection: string;
  afterSelection:string;
}> {
  return fc
    .tuple(
      fc.set(fc.string(), { minLength: 3 }),
      fc.nat(),
      fc.nat(),
    )
    .map(([index, n1, n2]) => {
        
      const n1InRange = n1 % index.length;
      const n2InRange = n2 % index.length;
      
      const start = Math.min(n1InRange, n2InRange, index.length - 3);
      const end = Math.max(n1InRange, n2InRange, start + 2) + 1;
      const subArray =  index.slice(start, end);
      
      const beforeSelection =  head(subArray)!;
      const afterSelection =  last(subArray)!;
      
      return {
        index,
        adjacentGroup: init(tail(subArray)),
        beforeSelection,
        afterSelection,
      };
    });
}

