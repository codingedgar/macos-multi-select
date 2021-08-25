import fc from 'fast-check';
import { head, last } from 'ramda';
import { Context, multiselect } from '../index';

describe('Select Previous Key', () => {
  test('should do nothing if the index is empty', () => {

    const initialContext: Context = {
      adjacentPivot: undefined,
      index: [],
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
        .map(([index, undefOrTop]) => ({
          index,
          adjacentPivot: undefOrTop ? undefined : head(index),
          selected: [],
        })),
        (initialContext) => {
          const nextAdjacentPivot = last(initialContext.index)!;
          
          expect(multiselect(initialContext, {
            type: "SELECT PREVIOUS",
          }))
            .toEqual({
              index: initialContext.index,
              selected: [nextAdjacentPivot],
              adjacentPivot: nextAdjacentPivot,
            })
        }
      )
    )

  });


  test('should never select beyond first key', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer(1, 20),
          fc.set(
            fc.string(), { minLength: 1 }
          )
        )
        .chain(([extra, index]) =>
          fc.shuffledSubarray(index)
          .map(selected => ({
            index,
            selected,
            adjacentPivot: last(selected),
            extra
          }))
        )
        ,
        ({
          adjacentPivot,
          index,
          selected,
          extra
        }) => {

          let prevContext: Context = {
            adjacentPivot,
            index,
            selected
          }

          const lastSelected = last(selected);
          const startOn = lastSelected !== undefined
            ? index.indexOf(lastSelected) - 1
            : index.length - 1

          for (let i = startOn; i > -index.length - extra; i--) {
            
            const nextContext = multiselect(prevContext, {
              type: "SELECT PREVIOUS",
            });
            
            const pivot = i >= 0 ? index[i]: head(index);
            
            expect(nextContext)
            .toEqual({
              index,
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
        .chain(([undefOrTop, index]) =>
          fc.nat(index.length - 1)
          .map(id => ({
            index,
            adjacentPivot: undefOrTop ? undefined : head(index),
            id: index[id],
          }))
        )
        ,
        ({
          adjacentPivot,
          index,
          id,
        }) => {

          const prevContext = multiselect(
            {
              index,
              adjacentPivot: adjacentPivot,
              selected: []
            },
            {
              type: "SELECT ADJACENT",
              id,
            }
          )

          const currentSelectionPivot = index.indexOf(id)
          const nextSelection = currentSelectionPivot > 0 ? currentSelectionPivot - 1 : 0
          const nextPivot = index[nextSelection];

          expect(
            multiselect(
              prevContext,
              {
                type: "SELECT PREVIOUS",
              }
            )
          )
          .toEqual({
            index,
            selected: [nextPivot],
            adjacentPivot: nextPivot,
          })

        }
      )
    )
  })

  test('Should select previous from the last selected even when the selection is bottom to top', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(index =>
          fc.tuple(
            fc.nat(index.length - 1),
            fc.nat(index.length - 1),
          )
          .map(([first, second]) => ({
            index,
            adjacentPivot: undefined,
            first: index[first],
            second: index[second],
          }))
        )
        ,
        ({
          adjacentPivot,
          index,
          first,
          second
        }) => {

          const context1 = multiselect(
            {
              index,
              adjacentPivot: adjacentPivot,
              selected: []
            },
            {
              type: "SELECT ONE",
              id: first,
            }
          )
          
          const context2 = multiselect(
            context1,
            {
              type: "SELECT ADJACENT",
              id: second,
            }
          )

          const currentSelectionPivot = index.indexOf(second)
          const nextSelection = currentSelectionPivot > 0
            ? currentSelectionPivot - 1
            : 0;
          const nextPivot = index[nextSelection];

          expect(
            multiselect(
              context2,
              {
                type: "SELECT PREVIOUS",
              }
            )
          )
          .toEqual({
            index,
            selected: [nextPivot],
            adjacentPivot: nextPivot,
          })

        }
      ),
    )
  })

});
