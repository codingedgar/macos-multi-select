import fc from 'fast-check';
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
              adjacentPivot: undefined,
              lastSelected: undefined,
            }
          );

          const adjacentPivot = toSelect.length ? toSelect[toSelect.length -1]: undefined;
          expect(finalContext)
          .toEqual({
            list,
            selected: toSelect,
            adjacentPivot,
            lastSelected: adjacentPivot
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
            adjacentPivot: undefined,
            lastSelected: undefined
          })

        }
      )
    )
  });
})
