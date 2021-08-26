import fc, { context, subarray } from 'fast-check';
import { head, last, tail } from 'ramda';
import { Context, multiselect } from '../index';
import { indexWithOneAdjacentAscendingSelection, nonEmptySubsequentSubarray } from './arbitraries';

describe("Select Next Adjacent Key", () => {

  test("In the initial state the user starts from the top", () => {

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
            type: "SELECT NEXT ADJACENT",
          }))
            .toEqual({
              index,
              selected: [index[0]],
              adjacentPivot: index[0],
            })
        }
      )
    )

  });

  test("When the last selected group is ascending then it selects the next key", () => {

    fc.assert(
      fc.property(
        indexWithOneAdjacentAscendingSelection()
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

          const tailSubArray = tail(subArray);

          for (let i = 0; i < tailSubArray.length; i++) {
            context = multiselect(
              context,
              {
                type: "SELECT NEXT ADJACENT",
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
      )
    )

  });

});
