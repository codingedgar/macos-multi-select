import fc from 'fast-check';
import { head, last } from 'ramda';
import { Context, multiselect } from '../index';
import { nonEmptySubsequentSubarray } from './arbitraries';

describe('Select Next Item', () => {
  test('should do nothing if no items', () => {
    const initialContext: Context = {
      adjacentPivot: undefined,
      list: [],
      selected: []
    };

    expect(multiselect(initialContext, {
      type: "SELECT NEXT",
    }))
      .toEqual(initialContext)

  });

  test('should start from the top', () => {

    fc.assert(
      fc.property(
        fc.tuple(
          fc.set(fc.string(), { minLength: 1 }),
          fc.boolean()
        ),
        ([list, undefOrTop]) => {
          expect(multiselect({
            adjacentPivot: undefOrTop ? undefined : head(list),
            list,
            selected: []
          }, {
            type: "SELECT NEXT",
          }))
            .toEqual({
              list,
              selected: [list[0]],
              adjacentPivot: list[0],
            })
        }
      )
    )

  });

  test('should never select beyond last item', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer(1, 20),
          fc.set(
            fc.string(), { minLength: 1 }
          )
        )
        .chain(([extra, list]) =>
          nonEmptySubsequentSubarray(list)
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

          const startOn = list.indexOf(last(selected)!) + 1

          for (let index = startOn; index < list.length + extra; index++) {
            
            const nextContext = multiselect(prevContext, {
              type: "SELECT NEXT",
            });

            const selected = [index < list.length - 1 ? list[index]: last(list)];

            expect(nextContext)
            .toEqual({
              list,
              selected,
              adjacentPivot: last(selected),
            })
            
            prevContext = nextContext;
            
          }

        }
      )
    )
  });

  test('Should select next from the last selected (not the pivot) given the last command were select adjacent', () => {
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
          const nextSelection = currentSelectionPivot < list.length - 1
            ? currentSelectionPivot + 1
            : list.length - 1;

          const nextPivot = list[nextSelection];

          expect(
            multiselect(
              prevContext,
              {
                type: "SELECT NEXT",
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

})
