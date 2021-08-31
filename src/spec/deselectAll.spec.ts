import fc from "fast-check";
import { head } from "ramda";
import { multiselect } from "../index";

describe("Deselect All", () => {
  test("should deselect all", () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
          .chain(index =>
            fc.record({
              index: fc.constant(index),
              selected: fc.set(
                fc
                  .integer(0, index.length - 1)
                  .map(i => index[i]),
              ),
            })  
          ),
        ({
          index,
          selected
        }) => {

          expect(
            multiselect(
              {
                index,
                selected,
                adjacentPivot: (selected.length) ? selected[selected.length - 1] : head(index)!,
              },
              {
                type: "DESELECT ALL",
              }
            )
          )
            .toEqual({
              index,
              selected: [],
              adjacentPivot: head(index),
            });
        }
      )
    );
  });
});
