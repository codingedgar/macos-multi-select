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
          expect(
            multiselect(
              {
                list,
                selected,
              },
              {
                type: "DESELECT ALL",
              }
            )
          )
          .toEqual({
            list,
            selected: []
          })
        }
      )
    )
  });
})
