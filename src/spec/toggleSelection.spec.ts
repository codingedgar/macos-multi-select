import fc from 'fast-check';
import { head } from 'ramda';
import { multiselect, Context } from '../index';

describe('Toggle Selection', () => {
  test('Should be able to add and remove a selection one key in a non empty index', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string()
        )
        .filter(index => index.length > 0)
        .chain(index =>
          fc.record({
            index: fc.constant(index),
            toSelect: fc.set(
              fc
                .integer(0, index.length-1)
                .map(i => index[i]),
            ),
          })  
        ),
        ({
          index,
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
              index,
              selected: [],
              adjacentPivot: head(index)!,
            }
          );

          expect(finalContext)
          .toEqual({
            index,
            selected: toSelect,
            adjacentPivot: toSelect.length ? toSelect[toSelect.length -1]: head(index)!,
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
            index,
            selected: [],
            adjacentPivot: head(index)!,
          })

        }
      )
    )
  });

// TODO: https://github.com/codingedgar/macos-multi-select/issues/27
  test('Should find pivot in next selection even when pivot is in the initial state due to select adjacent on initial state', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(index =>
          fc
            .nat(index.length -2)
            .chain(previousSelection => 
              fc
                .integer(previousSelection + 1, index.length - 1)
                .chain(nextPivot =>
                  fc.
                    tuple(
                      fc.constant(index.slice(0, previousSelection)),
                      fc.shuffledSubarray(index.slice(nextPivot + 1, index.length - 1))
                    )
                    .map(([left, right]) => ({
                        index,
                        previousPivot: head(index)!,
                        prevSelection: left
                          .concat([index[previousSelection]])
                          .concat([index[nextPivot]])
                          .concat(right),
                        deselectId: index[previousSelection],
                        nextPivot: index[nextPivot],
                        nextSelection: left
                          .concat([index[nextPivot]])
                          .concat(right),
                    }))
                ),
            ),
        )
        ,
        ({
          previousPivot,
          index,
          prevSelection,
          nextSelection,
          nextPivot,
          deselectId
        }) => {
          expect(
            multiselect({
              adjacentPivot: previousPivot,
              index: index,
              selected: prevSelection
            }, {
              type: "TOGGLE SELECTION",
              id: deselectId
            }
          )
          ).toEqual({
            index: index,
            adjacentPivot: nextPivot,
            selected: nextSelection
          })
        }
      )
    )
  })
})
