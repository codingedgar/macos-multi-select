import fc from 'fast-check';
import { multiselect, Context } from '../index';

describe('Deselect All', () => {
  test('should deselect all', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string()
        )
        .filter(list => list.length > 0)
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            selected: fc.set(
              fc.integer(0, list.length-1)
              .map(index => list[index]),
            ),
          })  
        ),
        ({
          list,
          selected
        }) => {
          const context = (selected.length)
            ? {
              list,
              selected,
              adjacentPivot: selected[selected.length - 1],
              lastSelected: selected[selected.length - 1], 
            }
            : {
              list,
              selected,
              adjacentPivot: undefined,
              lastSelected: undefined,
            }
          expect(
            multiselect(
              context,
              {
                type: "DESELECT ALL",
              }
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
