import fc from 'fast-check';
import { head } from 'ramda';
import { Context, multiselect } from '../index';
import { indexWithSelection } from './arbitraries';

describe('Select One Key', () => {
  test('should be able to select one key in a non empty index', () => {

    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 1 }
        )
        .chain(index =>
          fc.record({
            index: fc.constant(index),
            id: fc
              .integer(0, index.length-1)
              .map(i => index[i]),
          })  
        ),
          ({
            index,
            id,
          }) => {
            expect(
              multiselect({
                  index,
                  selected: [],
                  adjacentPivot: head(index)!,
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                index,
                selected: [id],
                adjacentPivot: id,
              })
          }
        )
    )

  });

  test('if another single select if performed, the previous is deselected', () => {
    fc.assert(
      fc.property(
        fc.set(
          fc.string(),
          { minLength: 2 }
        )
        .chain(index =>
          fc.record({
            index: fc.constant(index),
            selectedId: fc
              .integer(0, index.length-1)
              .map(i => index[i]),
            id: fc
              .integer(0, index.length-1)
              .map(i => index[i]),
          })  
        .filter(context => context.selectedId !== context.id)
        ),
          ({
            index,
            selectedId,
            id,
          }) => {
            expect(
              multiselect({
                  index,
                  selected: [selectedId],
                  adjacentPivot: selectedId,
                },
                {
                  type: "SELECT ONE",
                  id,
                }
              )
            )
              .toEqual({
                index,
                selected: [id],
                adjacentPivot: id,
              })
          }
        )
    )
  });

  test('Should deselect all but the selected key', () => {
    fc.assert(
      fc.property(
        indexWithSelection(),
        ({
          index,
          selected,
          selectOne,
        }) => {
          const context: Context = selected.reduce(
            (ctx, key) => 
              multiselect(
                ctx,
                {
                  type: "TOGGLE SELECTION",
                  id: key,
                }
              ),
              {
                index,
                selected: [],
                adjacentPivot: undefined,
              } as Context
          );

          expect(
            multiselect(
              context,
              {
                type: "SELECT ONE",
                id: selectOne,
              }
            )
          )
            .toEqual({
              index,
              selected: [selectOne],
              adjacentPivot: selectOne,
            })
        }
      )
    )
  });
})
