import fc from "fast-check";
import { head, last } from "ramda";
import { Context, multiselect } from "../index";
import { nonEmptySubsequentSubarray } from "./arbitraries";

describe("Select Next Key", () => {
  test("Should do nothing if no keys selected", () => {
    const initialContext: Context = {
      adjacentPivot: undefined,
      index: [],
      selected: []
    };

    expect(multiselect(initialContext, {
      type: "SELECT NEXT",
    }))
      .toEqual(initialContext);

  });

  test("Should start from the top", () => {

    fc.assert(
      fc.property(
        fc.tuple(
          fc.set(fc.string(), { minLength: 1 }),
          fc.boolean()
        ),
        ([index, undefOrTop]) => {
          expect(multiselect({
            adjacentPivot: undefOrTop ? undefined : head(index),
            index,
            selected: []
          }, {
            type: "SELECT NEXT",
          }))
            .toEqual({
              index,
              selected: [index[0]],
              adjacentPivot: index[0],
            });
        }
      )
    );

  });

  test("Should never select beyond last key", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer(1, 20),
          fc.set(
            fc.string(), { minLength: 1 }
          )
        )
          .chain(([extra, index]) =>
            nonEmptySubsequentSubarray(index)
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
          };

          const startOn = index.indexOf(last(selected)!) + 1;

          for (let i = startOn; i < index.length + extra; i++) {
            
            const nextContext = multiselect(prevContext, {
              type: "SELECT NEXT",
            });

            const selected = [i < index.length - 1 ? index[i]: last(index)];

            expect(nextContext)
              .toEqual({
                index,
                selected,
                adjacentPivot: last(selected),
              });
            
            prevContext = nextContext;
            
          }

        }
      )
    );
  });

  test("Should select next from the last selected (not the pivot) given the last command were select adjacent", () => {
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
          );

          const currentSelectionPivot = index.indexOf(id);
          const nextSelection = currentSelectionPivot < index.length - 1
            ? currentSelectionPivot + 1
            : index.length - 1;

          const nextPivot = index[nextSelection];

          expect(
            multiselect(
              prevContext,
              {
                type: "SELECT NEXT",
              }
            )
          )
            .toEqual({
              index,
              selected: [nextPivot],
              adjacentPivot: nextPivot,
            });

        }
      )
    );
  });
  
  test("Should select next from the last selected even when the selection is bottom to top", () => {
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
          );
          
          const context2 = multiselect(
            context1,
            {
              type: "SELECT ADJACENT",
              id: second,
            }
          );

          const currentSelectionPivot = index.indexOf(second);
          const nextSelection = currentSelectionPivot < index.length - 1
            ? currentSelectionPivot + 1
            : index.length - 1;

          const nextPivot = index[nextSelection];

          expect(
            multiselect(
              context2,
              {
                type: "SELECT NEXT",
              }
            )
          )
            .toEqual({
              index,
              selected: [nextPivot],
              adjacentPivot: nextPivot,
            });

        }
      ),
    );
  });

});
