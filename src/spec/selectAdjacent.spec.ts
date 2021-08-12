import fc from 'fast-check';
import { take, last, head, startsWith } from "ramda";
import { multiselect } from '../index';

describe('Select Adjacent', () => {
  test('should select from top to bottom in an empty list', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            selection: fc.integer(1, list.length)
              .map(n => take(n, list))
          })
        ),
        ({
          list,
          selection,
        }) => {
          const id = last(selection)!;
          expect(
            multiselect({
                list,
                selected: [],
                adjacentPivot: undefined,
                lastSelected: undefined
              },
              {
                type: "SELECT ADJACENT",
                id,
              }
            )
          )
          .toEqual({
            list,
            selected: selection,
            adjacentPivot: head(selection)!,
            lastSelected: id
          })
        }
      )
    )
  });
  
  test('should select from the last adjacent pivot', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            selection: fc
              .integer(0, list.length - 1)
              .chain(start =>
                fc
                  .integer(start + 1, list.length)
                  .map(end =>
                    list.slice(start, end)
                  )
              ),
            direction: fc.boolean(),
          })
        )
        .map(
          ({
            list,
            selection,
            direction
          }) => ({
            list,
            selection,
            start: direction ? head(selection)! : last(selection)!,
            end: direction ? last(selection)! : head(selection)!
          })
        ),
        ({
          list,
          selection,
          start,
          end
        }) => {
          expect(
            multiselect(
              multiselect({
                list,
                selected: [],
                adjacentPivot: undefined,
                lastSelected: undefined
              },
              {
                type: "SELECT ONE",
                id: start,
              }
            ),
            {
              type: "SELECT ADJACENT",
              id: end
            }
            )
          )
          .toEqual({
            list,
            selected: selection,
            adjacentPivot: start,
            lastSelected: end
          })
        }
      )
    );

  });
})
