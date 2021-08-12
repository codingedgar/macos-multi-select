import fc from 'fast-check';
import { head } from 'ramda';
import { multiselect, Context } from '../index';

describe('Toggle Selection', () => {
  test('should be able to add and remove a selection one item in a non empty list', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string()
        )
        .filter(list => list.length > 0)
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            toSelect: fc.set(
              fc.integer(0, list.length-1)
              .map(index => list[index]),
            ),
          })  
        ),
        ({
          list,
          toSelect,
        }) => {
          
          const finalContext = toSelect.reduce(
            (context: Context, id) =>
              multiselect(
                context,
                {
                  type: "TOGGLE SELECTION",
                  id,
                }
              ),
            {
              list,
              selected: [],
              adjacentPivot: head(list)!,
            }
          );

          expect(finalContext)
          .toEqual({
            list,
            selected: toSelect,
            adjacentPivot: toSelect.length ? toSelect[toSelect.length -1]: head(list)!,
          })
          
          expect(
            toSelect.reduce(
              (context: Context, id) =>
                multiselect(
                  context,
                  {
                    type: "TOGGLE SELECTION",
                    id,
                  }
                ),
              finalContext
            )
          )
          .toEqual({
            list,
            selected: [],
            adjacentPivot: head(list)!,
          })

        }
      )
    )
  });


  test('should find pivot in next selection even when pivot is in the initial state due to select adjacent on initial state', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(sortedArray =>
          fc
            .nat(sortedArray.length -2)
            .chain(previousSelection => 
              fc
                .integer(previousSelection + 1, sortedArray.length - 1)
                .chain(nextPivot =>
                  fc.
                    tuple(
                      fc.constant(sortedArray.slice(0, previousSelection)),
                      fc.shuffledSubarray(sortedArray.slice(nextPivot + 1, sortedArray.length - 1))
                    )
                    .map(([left, right]) => ({
                        sortedArray: sortedArray,
                        previousPivot: head(sortedArray)!,
                        prevSelection: left
                          .concat([sortedArray[previousSelection]])
                          .concat([sortedArray[nextPivot]])
                          .concat(right),
                        deselectId: sortedArray[previousSelection],
                        nextPivot: sortedArray[nextPivot],
                        nextSelection: left
                          .concat([sortedArray[nextPivot]])
                          .concat(right),
                    }))
                ),
            ),
        )
        ,
        ({
          previousPivot,
          sortedArray,
          prevSelection,
          nextSelection,
          nextPivot,
          deselectId
        }) => {
          expect(
            multiselect({
              adjacentPivot: previousPivot,
              list: sortedArray,
              selected: prevSelection
            }, {
              type: "TOGGLE SELECTION",
              id: deselectId
            }
          )
          ).toEqual({
            list: sortedArray,
            adjacentPivot: nextPivot,
            selected: nextSelection
          })
        }
      )
    )
  })
})
