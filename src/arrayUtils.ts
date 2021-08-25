import { head } from "ramda";

export function findNextPivot(
  sortedIndex: string[],
  subarray: string[],
  previousPivot: string
): string {
    const previous = sortedIndex.indexOf(previousPivot);
    let next = previous + 1;

    while (next <= sortedIndex.length - 1) {
      const nextKey = sortedIndex[next];
      if (subarray.includes(nextKey)){
        return nextKey;
      };
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

  return head(sortedIndex)!
}

export function findAdjacentToPivotInSortedArray(
  sortedIndex: string[],
  subarray: string[],
  key: string
): string[] {
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
        hasLeftAdjacent = false
      }
      
      if (rightIndex < sortedIndex.length - 1) {
        const nextRight = sortedIndex[rightIndex + 1];
        hasRightAdjacent = subarray.includes(nextRight);
        rightIndex = hasRightAdjacent ? rightIndex + 1 : rightIndex;
      } else {
        hasRightAdjacent = false
      }
    }

  return sortedIndex.slice(leftIndex, rightIndex + 1);
}
