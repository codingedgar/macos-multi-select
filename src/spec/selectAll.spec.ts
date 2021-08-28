import fc from 'fast-check';
import { head, last } from 'ramda';
import { multiselect } from '../index';
import { index, nonEmptyIndex } from './arbitraries';

describe('Select All', () => {
  test('should select all', () => {

    fc.assert(
      fc.property(
        nonEmptyIndex()
        .chain(index =>
          fc.record({
            index: fc.constant(index),
            selected: fc.shuffledSubarray(index)
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
                adjacentPivot: (selected.length) ? last(selected)! : head(index)!,
              },
              {
                type: "SELECT ALL",
              }
            )
          )
          .toEqual({
            index,
            selected: index,
            adjacentPivot: last(index),
          })
        }
      )
    )
  });
})
