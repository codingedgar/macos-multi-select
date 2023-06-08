import fc from "fast-check";
import { clone, last, sort, union } from "ramda";
import { Context, multiselect } from "../index";
import { ascendingString, indexWithOneAdjacentAscendingSelection, indexWithOneAdjacentDescendingSelection, nonEmptyIndex, nonEmptyIndexes } from "./arbitraries";

describe("Merge Index", () => {

  test("When the index is exactly as the current one, there shouldn't be any change", () => {

    fc.assert(
      fc.property(
        fc.oneof(
          indexWithOneAdjacentAscendingSelection(),
          indexWithOneAdjacentDescendingSelection()
        )
        ,
        ({index, subArray}) => {

          const context: Context = {
            adjacentPivot: undefined,
            index,
            selected: subArray
          };

          expect(multiselect(context, {
            type: "MERGE INDEX",
            index: clone(index)
          }))
            .toEqual(context);
        }
      )
    );

  });
  
  test("When the index is shuffled there shouldn't be any change", () => {

    fc.assert(
      fc.property(
        fc.oneof(
          indexWithOneAdjacentAscendingSelection(),
          indexWithOneAdjacentDescendingSelection()
        )
          .map((context) => {
            return {
              context,
              index1: sort(ascendingString, context.index),
            };
          })
        ,
        ({index1, context: {index, subArray}}) => {

          const context: Context = {
            adjacentPivot: undefined,
            index,
            selected: subArray
          };

          expect(multiselect(context, {
            type: "MERGE INDEX",
            index: index1
          }))
            .toEqual({
              ...context,
              index: index1
            });
        }
      )
    );

  });
  
  test("Index has items added, does not make changes on the current selection", () => {

    fc.assert(
      fc.property(
        fc.tuple(
          nonEmptyIndex(),
          fc.oneof(
            indexWithOneAdjacentAscendingSelection(),
            indexWithOneAdjacentDescendingSelection(),
          )
        )
        ,
        (([ index1, { index, subArray } ]) => {

          const context: Context = {
            adjacentPivot: last(subArray),
            index,
            selected: subArray
          };

          expect(multiselect(context, {
            type: "MERGE INDEX",
            index: index1.concat(index)
          }))
            .toEqual(({
              ...context,
              index: index1.concat(index)
            }));
        })
      )
    );
  });
  
  test("Index has items removed, if pivot, makes pivot last selected", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          indexWithOneAdjacentAscendingSelection(),
          indexWithOneAdjacentDescendingSelection(),
        )
          .chain(({index, subArray}) => 
            fc.tuple(
              fc.shuffledSubarray(index),
              fc.shuffledSubarray(subArray)
            )
              .map(([i1, s1]) => {
                const index1 = union(i1, s1);
                const adjacentPivot = last(subArray);
                const subArray1 = subArray.filter(x => index1.includes(x));
                return {
                  index,
                  subArray,
                  adjacentPivot,
                  index1,
                  subArray1,
                  adjacentPivot1: adjacentPivot && index1.includes(adjacentPivot)
                    ? adjacentPivot
                    : last(subArray1),
                };
              })
          )
        ,
        (({
          index,
          subArray,
          adjacentPivot,
          index1,
          subArray1,
          adjacentPivot1,
        }) => {
          const context: Context = {
            adjacentPivot,
            index,
            selected: subArray
          };
          
          expect(multiselect(context, {
            type: "MERGE INDEX",
            index: index1
          }))
            .toEqual(({
              index: index1,
              adjacentPivot: adjacentPivot1,
              selected: subArray1,
            }));
        })
      )
    );
  });
  test("Completely replace Index", () => {
    fc.assert(
      fc.property(
        nonEmptyIndexes()
        ,(([index,index1]) => {
          const context: Context = {
            adjacentPivot: undefined,
            index,
            selected: []
          };
          
          expect(multiselect(context, {
            type: "MERGE INDEX",
            index: index1
          }))
            .toEqual(({
              index: index1,
              adjacentPivot: undefined,
              selected: [],
            }));
        })
      )
    );
  });
});
