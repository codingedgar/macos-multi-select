import fc from "fast-check";
import { take, last, head, reverse } from "ramda";
import { Context, multiselect } from "../index";
import { indexWithAdjacentConnections, takeFromTo } from "./arbitraries";

describe("Select Adjacent", () => {
  test("Should select from top to bottom in an empty index", () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
          .chain(index =>
            fc.record({
              index: fc.constant(index),
              selection: fc.integer(1, index.length)
                .map(n => take(n, index))
            })
          ),
        ({
          index,
          selection,
        }) => {
          const id = last(selection)!;
          expect(
            multiselect({
              index,
              selected: [],
              adjacentPivot: head(index)!,
            },
            {
              type: "SELECT ADJACENT",
              id,
            }
            )
          )
            .toEqual({
              index,
              selected: expect.arrayContaining(selection),
              adjacentPivot: head(selection)!,
            });
        }
      )
    );
  });
  
  test("Should select from the last adjacent pivot", () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
          .chain(index =>
            fc.record({
              index: fc.constant(index),
              selection: fc
                .integer(0, index.length - 1)
                .chain(start =>
                  fc
                    .integer(start + 1, index.length)
                    .map(end =>
                      index.slice(start, end)
                    )
                ),
              direction: fc.boolean(),
            })
          )
          .map(
            ({
              index,
              selection,
              direction
            }) => ({
              index,
              selection,
              start: direction ? head(selection)! : last(selection)!,
              end: direction ? last(selection)! : head(selection)!
            })
          ),
        ({
          index,
          selection,
          start,
          end
        }) => {
          expect(
            multiselect(
              multiselect({
                index,
                selected: [],
                adjacentPivot: head(index)!,
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
              index,
              selected: expect.arrayContaining(selection),
              adjacentPivot: start,
            });
        }
      )
    );
  });

  test("Should perform a minus between the old and new selection", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.set(
            fc.string(),
            { minLength: 3 }
          ),
          fc.boolean()
        )
          .chain(([index, direction]) =>
            fc
              .integer(1, index.length - 2)
              .chain(start =>
                fc
                  .integer(start, index.length - 2)
                  .chain(end =>
                    fc
                      .integer(
                        direction ? 0 : end + 1,
                        direction ? start - 1 : index.length - 1
                      )
                      .chain(id =>
                        fc
                          .shuffledSubarray(
                            index.slice(
                              direction ? end + 2 : 0,
                              direction ? index.length : start - 1
                            )
                          )
                          .map((otherSelection) => ({
                            index,
                            selected: index.slice(start, end + 1).concat(otherSelection),
                            adjacentPivot: index[direction ? start : end],
                            id: index[id],
                            nextSelection: otherSelection.concat(index.slice(
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
          index,
          adjacentPivot,
          selected,
          nextSelection,
        }) => {

          expect(
            multiselect(
              {
                index,
                adjacentPivot,
                selected
              },
              {
                type: "SELECT ADJACENT",
                id
              }
            )
          ).toEqual({
            index,
            selected: expect.arrayContaining(nextSelection),
            adjacentPivot
          });
        }
      ),
    );
  });

  test("Should perform a minus between the old and new end selection group, when selection is ascendent", () => {
    fc.assert(
      fc.property(
        indexWithAdjacentConnections()
        ,
        ({
          index,
          adjacentGroup1,
          adjacentGroup2,
          adjacentGroup3,
          adjacentGroup4,
          start,
          end,
        }) => {

          const expectedSelection = takeFromTo(index, start, end);

          let context: Context = {
            adjacentPivot: undefined,
            index,
            selected: []
          };

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
              type: "SELECT ADJACENT",
              id: end
            }
          );
          expect(result).toEqual({
            index,
            adjacentPivot: start,
            selected: expectedSelection,
          });
        }
      ),
    );
  });

  test("Should perform a minus between the old and new end selection group, when selection is descendent", () => {
    fc.assert(
      fc.property(
        indexWithAdjacentConnections()
        ,
        ({
          index,
          adjacentGroup1,
          adjacentGroup2,
          adjacentGroup3,
          adjacentGroup4,
          start,
          end,
        }) => {

          const expectedSelection = reverse(takeFromTo(index, start, end));

          let context: Context = {
            adjacentPivot: undefined,
            index,
            selected: []
          };

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
              type: "SELECT ADJACENT",
              id: start
            }
          );
          expect(result).toEqual({
            index,
            adjacentPivot: end,
            selected: expectedSelection,
          });
        }
      ),
    );
  });
});
