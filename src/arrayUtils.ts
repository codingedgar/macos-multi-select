import { head, init, last, tail } from "ramda";

export function findNextPivot<T extends string>(
  sortedIndex: T[],
  subarray: T[],
  previousPivot: T
): T {
  const previous = sortedIndex.indexOf(previousPivot);
  let next = previous + 1;

  while (next <= sortedIndex.length - 1) {
    const nextKey = sortedIndex[next];
    if (subarray.includes(nextKey)){
      return nextKey;
    }
    next++;
  }

  next = previous - 1;
    
  while (next >= 0) {
    const prevKey = sortedIndex[next];
    if (subarray.includes(prevKey)) {
      return prevKey;
    }
    next--;
  }

  return head(sortedIndex)!;
}

export function findAdjacentToKeyInIndex<T extends string>(
  sortedIndex: T[],
  subarray: T[],
  key: T
): T[] {
  const indexOfKey = sortedIndex.indexOf(key);
  let leftIndex = indexOfKey;
  let rightIndex = indexOfKey;
  let hasLeftAdjacent = leftIndex > 0;
  let hasRightAdjacent = rightIndex < sortedIndex.length - 1;
  while ((hasLeftAdjacent || hasRightAdjacent)) {
    if (leftIndex > 0) {
      const nextLeft = sortedIndex[leftIndex - 1];
      hasLeftAdjacent = subarray.includes(nextLeft);
      leftIndex = hasLeftAdjacent ? leftIndex - 1 : leftIndex;
    } else {
      hasLeftAdjacent = false;
    }
      
    if (rightIndex < sortedIndex.length - 1) {
      const nextRight = sortedIndex[rightIndex + 1];
      hasRightAdjacent = subarray.includes(nextRight);
      rightIndex = hasRightAdjacent ? rightIndex + 1 : rightIndex;
    } else {
      hasRightAdjacent = false;
    }
  }

  return sortedIndex.slice(leftIndex, rightIndex + 1);
}

export function groupAdjacentIsDescending(group: string[], index: string[]): boolean {
  const ultimate = group[group.length - 1];
  const penultimate = group[group.length - 2];

  return index.indexOf(ultimate) === index.indexOf(penultimate) - 1;
}

export function groupAdjacentIsAscending(group: string[], index: string[]): boolean {
  const ultimate = group[group.length - 1];
  const penultimate = group[group.length - 2];

  return index.indexOf(ultimate) === index.indexOf(penultimate) + 1;
}

export function partitionHeadAndTail<T>(nonEmptyArray: T[]): [T, T[]] {
  return [head(nonEmptyArray)!, tail(nonEmptyArray)];
}

export function partitionInitAndLast<T>(nonEmptyArray: T[]): [T[], T] {
  return [init(nonEmptyArray), last(nonEmptyArray)!];
}

export function isSubset(superset: string[], subset: string[]): boolean {
  return subset.every(x => superset.includes(x));
}
