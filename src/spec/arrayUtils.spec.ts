import fc from 'fast-check';
import { head } from 'ramda';
import { findAdjacentToPivotInSortedArray, findNextPivot } from "../arrayUtils";

describe('find adjacent to pivot', () => {
  test('should find adjacent elements', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
        .chain(sortedArray =>
          fc
            .nat(sortedArray.length -1) // pivot
            .chain(pivot =>
              fc.tuple(
                fc.nat(pivot), // adjacent left bound
                fc.integer(pivot, sortedArray.length - 1) // adjacent right bound
              )
              .chain(([adjacentLeftBound, adjacentRightBound]) =>
                fc.tuple(
                  fc.nat(
                    adjacentLeftBound > 1
                      ? adjacentLeftBound - 2
                      : 0
                  ) // left space after adjacent
                  .chain(leftSpace =>
                    fc.shuffledSubarray(sortedArray.slice(0, leftSpace))
                  ),
                  fc.integer(
                    (adjacentRightBound + 2 < sortedArray.length - 1)
                      ? adjacentRightBound + 2
                      : sortedArray.length - 1,
                    sortedArray.length - 1
                  ) // right space after adjacent
                  .chain(rightSpace =>
                    fc.shuffledSubarray(sortedArray.slice(rightSpace, sortedArray.length - 1))  
                  )
                  , // right space after adjacent
                )
                .map(([left, right]) => {
                  const adjacent = sortedArray.slice(adjacentLeftBound, adjacentRightBound + 1);
                  return {
                    sortedArray: sortedArray,
                    pivot: sortedArray[pivot],
                    subarray: [
                      ...left,
                      ...adjacent,
                      ...right,
                    ],
                    adjacent,
                  }
                })
              )
            )
        )
        ,
        ({
          pivot,
          sortedArray,
          subarray,
          adjacent
        }) => {
          expect(
            findAdjacentToPivotInSortedArray(
              sortedArray,
              subarray,
              pivot
            )
          )
          .toEqual(
            adjacent
          )
        }
      ),
      {
        verbose: true
      }
    )
  });
});

describe('find next pivot', () => {
  test('should return 0 if theres nothing else selected', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
        .chain(sortedArray =>
          fc.record({
            sortedArray: fc.constant(sortedArray),
            previousPivot: fc
              .nat(sortedArray.length - 1)
              .map(i => sortedArray[i])
          })
        )
        ,
        ({
          previousPivot,
          sortedArray
        }) => {
          expect(
            findNextPivot(
              sortedArray,
              [],
              previousPivot
            )
          ).toEqual(head(sortedArray)!)
        }
      )
    )
  });

  test('should return pivot if exits on left side', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(sortedArray =>
          fc
            .integer(1, sortedArray.length - 1)
            .chain(i =>
              fc
                .nat(i - 1)
                .chain(nextPivot =>
                  fc
                    .shuffledSubarray(sortedArray.slice(0, nextPivot))
                    .map(selection => ({
                        previousPivot: sortedArray[i],
                        sortedArray: sortedArray,
                        nextPivot: sortedArray[nextPivot],
                        selection: selection.concat([sortedArray[nextPivot]])
                    }))
                )
            ),
        )
        ,
        ({
          previousPivot,
          sortedArray,
          selection,
          nextPivot
        }) => {
          expect(
            findNextPivot(
              sortedArray,
              selection,
              previousPivot
            )
          ).toEqual(nextPivot)
        }
      )
    )
  })

  test('should return pivot if exits on right side', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(sortedArray =>
          fc
            .nat(sortedArray.length - 2)
            .chain(previousPivot =>
              fc
                .integer(previousPivot + 1, sortedArray.length - 1)
                .chain(nextPivot =>
                  fc.
                    tuple(
                      fc.shuffledSubarray(sortedArray.slice(0, previousPivot)),
                      fc.shuffledSubarray(sortedArray.slice(nextPivot + 1, sortedArray.length - 1))
                    )
                    .map(([left, right]) => ({
                        previousPivot: sortedArray[previousPivot],
                        sortedArray: sortedArray,
                        nextPivot: sortedArray[nextPivot],
                        selection: left.concat([sortedArray[nextPivot]]).concat(right)
                    }))
                )
            ),
        )
        ,
        ({
          previousPivot,
          sortedArray,
          selection,
          nextPivot
        }) => {
          expect(
            findNextPivot(
              sortedArray,
              selection,
              previousPivot
            )
          ).toEqual(nextPivot)
        }
      )
    )
  })
})
