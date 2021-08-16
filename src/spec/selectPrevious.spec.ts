import fc from 'fast-check';
import { head, last } from 'ramda';
import { Context, multiselect } from '../index';

describe('Select Previous Item', () => {
  test('should do nothing if the list is empty', () => {

    const initialContext: Context = {
      adjacentPivot: undefined,
      list: [],
      selected: []
    };

    expect(multiselect(initialContext, {
      type: "SELECT PREVIOUS",
    }))
      .toEqual(initialContext)

  });

  test('should start from the bottom', () => {

    fc.assert(
      fc.property(
        fc.tuple(
          fc.set(fc.string(), { minLength: 1 }),
          fc.boolean()
        )
        .map(([list, undefOrTop]) => ({
          list,
          adjacentPivot: undefOrTop ? undefined : head(list),
          selected: [],
        })),
        (initialContext) => {
          const nextAdjacentPivot = last(initialContext.list)!;
          
          expect(multiselect(initialContext, {
            type: "SELECT PREVIOUS",
          }))
            .toEqual({
              list: initialContext.list,
              selected: [nextAdjacentPivot],
              adjacentPivot: nextAdjacentPivot,
            })
        }
      )
    )

  });


  test('should never select beyond first item', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer(1, 20),
          fc.set(
            fc.string(), { minLength: 1 }
          )
        )
        .chain(([extra, list]) =>
          fc.shuffledSubarray(list)
          .map(selected => ({
            list,
            selected,
            adjacentPivot: last(selected),
            extra
          }))
        )
        ,
        ({
          adjacentPivot,
          list,
          selected,
          extra
        }) => {

          let prevContext: Context = {
            adjacentPivot,
            list,
            selected
          }

          const lastSelected = last(selected);
          const startOn = lastSelected !== undefined
            ? list.indexOf(lastSelected) - 1
            : list.length - 1

          for (let index = startOn; index > -list.length - extra; index--) {
            
            const nextContext = multiselect(prevContext, {
              type: "SELECT PREVIOUS",
            });
            
            const pivot = index >= 0 ? list[index]: head(list);
            
            expect(nextContext)
            .toEqual({
              list,
              selected: [pivot],
              adjacentPivot: pivot,
            })
            
            prevContext = nextContext;
            
          }

        }
      )
    )
  })

  test('Should select previous from the last selected (not the pivot) given the last command were select adjacent', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.boolean(),
          fc.set(
            fc.string(), { minLength: 1 }
            )
        )
        .chain(([undefOrTop, list]) =>
          fc.nat(list.length - 1)
          .map(id => ({
            list,
            adjacentPivot: undefOrTop ? undefined : head(list),
            id: list[id],
          }))
        )
        ,
        ({
          adjacentPivot,
          list,
          id,
        }) => {

          const prevContext = multiselect(
            {
              list,
              adjacentPivot: adjacentPivot,
              selected: []
            },
            {
              type: "SELECT ADJACENT",
              id,
            }
          )

          const currentSelectionPivot = list.indexOf(id)
          const nextSelection = currentSelectionPivot > 0 ? currentSelectionPivot - 1 : 0
          const nextPivot = list[nextSelection];

          expect(
            multiselect(
              prevContext,
              {
                type: "SELECT PREVIOUS",
              }
            )
          )
          .toEqual({
            list,
            selected: [nextPivot],
            adjacentPivot: nextPivot,
          })

        }
      )
    )
  })

});
