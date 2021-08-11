import fc from 'fast-check';
import { multiselect } from '../index';

describe('Select an Item', () => {
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
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                list,
                selected: [id]
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
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                list,
                selected: [id]
              })
          }
        )
    )
  });
})
