import fc from 'fast-check';
import { head, last, reverse, tail } from 'ramda';
import { multiselect } from '../index';
import {
  indexMin3WithOneAdjacentAscendingSelectionLessThanIndexLast,
  indexWithOneAdjacentAscendingSelection,
  indexWithOneAdjacentDescendingSelection
 } from './arbitraries';

describe("Select Previous Adjacent Key", () => {

  test("In the initial state the user starts from the bottom", () => {

    fc.assert(
      fc.property(
        fc.set(fc.string(), { minLength: 1 })
        ,
        (index) => {
          expect(multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT PREVIOUS ADJACENT",
          }))
            .toEqual({
              index,
              selected: [last(index)!],
              adjacentPivot: last(index),
            })
        }
      )
    )

  });

  test("When the last selected group is descending then it selects the previous key", () => {

    fc.assert(
      fc.property(
        indexWithOneAdjacentDescendingSelection()
        ,
        ({
          index,
          subArray,
        }) => {
          
          const headSubArray = head(subArray)!;

          let context = multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT ONE",
            id: headSubArray,
          })
          
          for (let i = 0; i < subArray.length - 1; i++) {
            context = multiselect(
              context,
              {
                type: "SELECT PREVIOUS ADJACENT",
              }
              );
          }

          expect(context)
            .toEqual({
              index,
              selected: subArray,
              adjacentPivot: headSubArray,
            })
        }
      ),
    )
  });

  test("When the selected group is ascending then it deselects the previous key", () => {

    fc.assert(
      fc.property(
        indexWithOneAdjacentAscendingSelection()
        ,
        ({
          index,
          subArray,
        }) => {
          
          const headSubArray = head(subArray)!;
          const lastSubArray = last(subArray)!;

          let context = multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT ONE",
            id: headSubArray,
          });
          
          context = multiselect(
            context,
            {
              type: "SELECT ADJACENT",
              id: lastSubArray,
            }
          );

          const tailSubArray = tail(subArray);

          for (let i = 0; i < tailSubArray.length; i++) {
            context = multiselect(
              context,
              {
                type: "SELECT PREVIOUS ADJACENT",
              }
            );
          }

          expect(context)
            .toEqual({
              index,
              selected: [headSubArray],
              adjacentPivot: headSubArray,
            })
        }
      ),
    )

  });

  test("Ignores the adjacent pivot key (adjacent pivot is always selected)", () => {

    fc.assert(
      fc.property(
        fc
          .tuple(
            fc.oneof(
              indexWithOneAdjacentDescendingSelection(),
              indexWithOneAdjacentAscendingSelection()
            ),
            fc.nat(200),
          )
        ,
        ([
          {
            index,
            subArray,
          },
          tries,
        ]) => {
          
          const headSubArray = head(subArray)!;
          const lastSubArray = last(subArray)!;

          let context = multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT ONE",
            id: headSubArray,
          });
          
          context = multiselect(
            context,
            {
              type: "SELECT ADJACENT",
              id: lastSubArray,
            }
          );

          for (let i = 0; i < tries; i++) {
            context = multiselect(
              context,
              {
                type: "SELECT PREVIOUS ADJACENT",
              }
            );
          }

          expect(context.selected)
            .toContain(headSubArray);
        }
      ),
    )

  });
  
  test("Adjacent group union", () => {

    fc.assert(
      fc.property(
        fc
          .tuple(
            indexMin3WithOneAdjacentAscendingSelectionLessThanIndexLast(),
            fc.boolean()
          )
          .map(([a,b])=>({
            ...a,
            adjacentGroup: b ? a.adjacentGroup : reverse(a.adjacentGroup),
          }))
        ,
        ({
          index,
          adjacentGroup,
          afterSelection,
          beforeSelection,
        }) => {

          const headSubArray = head(adjacentGroup)!;
          const lastSubArray = last(adjacentGroup)!;

          let context = multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT ONE",
            id: headSubArray,
          });
          
          context = multiselect(
            context,
            {
              type: "SELECT ADJACENT",
              id: lastSubArray,
            }
          );
          
          context = multiselect(
            context,
            {
              type: "TOGGLE SELECTION",
              id: afterSelection,
            }
          );

          expect(multiselect(
            context,
            {
              type: "SELECT PREVIOUS ADJACENT",
            }
          ))
            .toEqual({
              index,
              adjacentPivot: afterSelection,
              selected: adjacentGroup.concat([afterSelection]).concat([beforeSelection]),
            });

        }
      ),
    )

  });

  test("Limit head index", () => {

    fc.assert(
      fc.property(
        fc
          .tuple(
            fc.oneof(
              indexWithOneAdjacentDescendingSelection(),
              indexWithOneAdjacentAscendingSelection()
            ),
            fc.nat(200),
          )
        ,
        ([
          {
            index,
            subArray,
          },
          tries,
        ]) => {
          
          const headSubArray = head(subArray)!;
          const headSubArrayIndex = index.indexOf(headSubArray);

          const lastSubArray = last(subArray)!;

          let context = multiselect({
            adjacentPivot: undefined,
            index,
            selected: []
          }, {
            type: "SELECT ONE",
            id: headSubArray,
          });
          
          context = multiselect(
            context,
            {
              type: "SELECT ADJACENT",
              id: lastSubArray,
            }
          );

          for (let i = 0; i < index.length + tries; i++) {
            context = multiselect(
              context,
              {
                type: "SELECT PREVIOUS ADJACENT",
              }
            );
          }

          expect(context)
            .toEqual({
              index,
              adjacentPivot: headSubArray,
              selected: reverse(index.slice(0, headSubArrayIndex + 1)),
            });

        }
      ),
    )
  });

});
