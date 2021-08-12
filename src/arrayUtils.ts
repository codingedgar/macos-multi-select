import { head } from "ramda";

export function findNextPivot(
  sortedArray: string[],
  subarray: string[],
  previousPivot: string
): string {
    const previousIndex = sortedArray.indexOf(previousPivot);
    let nextIndex = previousIndex + 1;

    while (nextIndex <= sortedArray.length - 1) {
      const nextItem = sortedArray[nextIndex];
      if (subarray.includes(nextItem)){
        return nextItem;
      };
      nextIndex++;
    }

    nextIndex = previousIndex - 1;
    
    while (nextIndex >= 0) {
      const prevItem = sortedArray[nextIndex];
      if (subarray.includes(prevItem)) {
        return prevItem;
      }
      nextIndex--;
    }

  return head(sortedArray)!
}

export function findAdjacentToPivotInSortedArray(
  sortedArray: string[],
  subarray: string[],
  item: string): string[] {
    const indexOfItem = sortedArray.indexOf(item);
    let leftIndex = indexOfItem;
    let rightIndex = indexOfItem;
    let hasLeftAdjacent = leftIndex > 0;
    let hasRightAdjacent = rightIndex < sortedArray.length - 1;
    while ((hasLeftAdjacent || hasRightAdjacent)) {
      if (leftIndex > 0) {
        const nextLeft = sortedArray[leftIndex - 1];
        hasLeftAdjacent = subarray.includes(nextLeft);
        leftIndex = hasLeftAdjacent ? leftIndex - 1 : leftIndex;
      } else {
        hasLeftAdjacent = false
      }
      
      if (rightIndex < sortedArray.length - 1) {
        const nextRight = sortedArray[rightIndex + 1];
        hasRightAdjacent = subarray.includes(nextRight);
        rightIndex = hasRightAdjacent ? rightIndex + 1 : rightIndex;
      } else {
        hasRightAdjacent = false
      }
    }

  return sortedArray.slice(leftIndex, rightIndex + 1);
}
