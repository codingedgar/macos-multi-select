import fc from 'fast-check';
import { multiselect, Context } from '../index';

describe('Toggle Selection', () => {
  test('should be able to add to selection one item in a non empty list', () => {

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
                  {
                    list,
                    selected: []
                  }
                )
            )
              .toEqual({
                list,
                selected: toSelect
              })
          }
        )
    )

  });
})
