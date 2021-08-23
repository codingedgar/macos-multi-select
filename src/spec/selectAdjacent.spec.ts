import fc, { array } from 'fast-check';
import { take, last, head, reverse } from "ramda";
import { Context, multiselect } from '../index';
import { indexWithAdjacentConnections, takeFromTo } from './arbitraries';

describe('Select Adjacent', () => {
  test('Should select from top to bottom in an empty list', () => {

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
                adjacentPivot: head(list)!,
              },
              {
                type: "SELECT ADJACENT",
                id,
              }
            )
          )
          .toEqual({
            list,
            selected: expect.arrayContaining(selection),
            adjacentPivot: head(selection)!,
          })
        }
      )
    )
  });
  
  test('Should select from the last adjacent pivot', () => {

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
                adjacentPivot: head(list)!,
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
            selected: expect.arrayContaining(selection),
            adjacentPivot: start,
          })
        }
      )
    );
  });

  test('Should perform a minus between the old and new selection', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.set(
            fc.string(),
            { minLength: 3 }
          ),
          fc.boolean()
        )
        .chain(([list, direction]) =>
          fc
            .integer(1, list.length - 2)
            .chain(start =>
              fc
                .integer(start, list.length - 2)
                .chain(end =>
                  fc
                    .integer(
                      direction ? 0 : end + 1,
                      direction ? start - 1 : list.length - 1
                    )
                    .chain(id =>
                      fc
                        .shuffledSubarray(
                          list.slice(
                            direction ? end + 2 : 0,
                            direction ? list.length : start - 1
                          )
                        )
                    .map((otherSelection) => ({
                      list,
                      selected: list.slice(start, end + 1).concat(otherSelection),
                      adjacentPivot: list[direction ? start : end],
                      id: list[id],
                      nextSelection: otherSelection.concat(list.slice(
                        direction ? id : end,
                        (direction ? start : id) + 1
                        ))
                    }))
                  )
                )
            )
        )
        ,
        ({
          id,
          list,
          adjacentPivot,
          selected,
          nextSelection,
        }) => {

          expect(
            multiselect(
              {
                list,
                adjacentPivot,
                selected
              },
              {
                type: 'SELECT ADJACENT',
                id
              }
            )
          ).toEqual({
            list,
            selected: expect.arrayContaining(nextSelection),
            adjacentPivot
          })
        }
      ),
    )
  })

  test('Should perform a minus between the old and new end selection group, when selection is ascendent', () => {
    fc.assert(
      fc.property(
        indexWithAdjacentConnections()
        ,
        ({
          list,
          adjacentGroup1,
          adjacentGroup2,
          adjacentGroup3,
          adjacentGroup4,
          start,
          end,
        }) => {

          const expectedSelection = takeFromTo(list, start, end);

          let context: Context = {
            adjacentPivot: undefined,
            list,
            selected: []
          }

          context = [
            ...adjacentGroup1,
            ...adjacentGroup2,
            ...adjacentGroup3,
            ...adjacentGroup4,
            start
          ].reduce(
            (ctx, id) => multiselect(
              ctx,
              {
                type: "TOGGLE SELECTION",
                id
              }
            ),
            context
          );

          const result = multiselect(
            context,
            {
              type: 'SELECT ADJACENT',
              id: end
            }
          )
          expect(result).toEqual({
            list,
            adjacentPivot: start,
            selected: expectedSelection,
          })
        }
      ),
    )
  })

  test('Should perform a minus between the old and new end selection group, when selection is descendent', () => {
    fc.assert(
      fc.property(
        indexWithAdjacentConnections()
        ,
        ({
          list,
          adjacentGroup1,
          adjacentGroup2,
          adjacentGroup3,
          adjacentGroup4,
          start,
          end,
        }) => {

          const expectedSelection = reverse(takeFromTo(list, start, end));

          let context: Context = {
            adjacentPivot: undefined,
            list,
            selected: []
          }

          context = [
            ...adjacentGroup1,
            ...adjacentGroup2,
            ...adjacentGroup3,
            ...adjacentGroup4,
            end,
          ].reduce(
            (ctx, id) => multiselect(
              ctx,
              {
                type: "TOGGLE SELECTION",
                id
              }
            ),
            context
          );

          const result = multiselect(
            context,
            {
              type: 'SELECT ADJACENT',
              id: start
            }
          )
          expect(result).toEqual({
            list,
            adjacentPivot: end,
            selected: expectedSelection,
          })
        }
      ),
    )
  })
})
