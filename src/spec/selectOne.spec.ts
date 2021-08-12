import fc from 'fast-check';
import { head } from 'ramda';
import { multiselect } from '../index';

describe('Select One Item', () => {
  test('should be able to select one item in a non empty list', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string()
        )
        .filter(list => list.length > 0)
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            id: fc.integer(0, list.length-1)
              .map(index => list[index]),
          })  
        ),
          ({
            list,
            id,
          }) => {
            expect(
              multiselect({
                  list,
                  selected: [],
                  adjacentPivot: head(list)!,
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                list,
                selected: [id],
                adjacentPivot: id,
              })
          }
        )
    )

  });

  test('if another single select if performed, the previous is deselected', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string()
        )
        .filter(list => list.length > 1)
        .chain(list =>
          fc.record({
            list: fc.constant(list),
            selectedId: fc.integer(0, list.length-1)
              .map(index => list[index]),
            id: fc.integer(0, list.length-1)
              .map(index => list[index]),
          })  
        .filter(context => context.selectedId !== context.id)
        ),
          ({
            list,
            selectedId,
            id,
          }) => {
            expect(
              multiselect({
                  list,
                  selected: [selectedId],
                  adjacentPivot: selectedId,
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                list,
                selected: [id],
                adjacentPivot: id,
              })
          }
        )
    )
  });
})