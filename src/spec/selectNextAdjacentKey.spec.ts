import fc from 'fast-check';
import { head, last, tail } from 'ramda';
import { multiselect } from '../index';
import { indexWithOneAdjacentAscendingSelection, indexWithOneAdjacentDescendingSelection } from './arbitraries';

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
      ),
      // { seed: -221655216, path: "1:1:2:5:4:4:5:8:7:7:11:10:10:12:11:11:11:13:12:14:14:15:2:2:2:5:2:20:2:2:5", endOnFailure: true }
    )

  });

  test("When the selected group is ascending then it deselects the next key", () => {

    fc.assert(
      fc.property(
        indexWithOneAdjacentDescendingSelection()
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
                type: "SELECT NEXT ADJACENT",
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

});
