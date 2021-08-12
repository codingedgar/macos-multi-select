import { difference, head, take, union, without } from "ramda";
import { findAdjacentToPivotInSortedArray, findNextPivot } from "./arrayUtils";

export type Context = {
  list: string[],
  selected: string[],
  adjacentPivot: string,
}

type Command =
  | { type: "SELECT ONE", id: string }
  | { type: "TOGGLE SELECTION", id: string }
  | { type: "DESELECT ALL" }
  | { type: "SELECT ADJACENT", id: string }

function listIncludesAndIsNotEmpty(list: string[], item: string) {
  return list.length > 0 && list.includes(item)
}

export function multiselect(context: Context, command: Command): Context {

  if (
    command.type === "SELECT ONE" &&
    listIncludesAndIsNotEmpty(context.list, command.id)
  ) {
    return {
      ...context,
      selected: [command.id],
      adjacentPivot: command.id,
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      listIncludesAndIsNotEmpty(context.list, command.id) &&
      context.selected.includes(command.id) &&
      context.selected.length === 1
  ) {
    const index = context.selected.indexOf(command.id)
    return {
      ...context,
      selected: [],
      adjacentPivot: head(context.list)!,
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      listIncludesAndIsNotEmpty(context.list, command.id) &&
      context.selected.includes(command.id)
  ) {
    const selected = context.selected.filter(x => x !== command.id);
    const adjacentPivot = findNextPivot(
      context.list,
      selected,
      context.adjacentPivot
    );

    return {
      ...context,
      selected,
      adjacentPivot,
    };
  } else if (
    command.type === 'TOGGLE SELECTION' &&
    context.list.includes(command.id)
  ) {
    return {
      ...context,
      selected: context.selected.concat([command.id]),
      adjacentPivot: command.id,
    };
  } else if (command.type === "DESELECT ALL") {
    return {
      ...context,
      selected: [],
      adjacentPivot: head(context.list)!,
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.list, command.id) &&
    context.selected.length === 0
  ) {
    const n = context.list.indexOf(command.id) + 1;
    return {
      ...context,
      selected: take(n, context.list),
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.list, command.id)
  ) {

    const pivotIndex = context.list.indexOf(context.adjacentPivot);
    const selectionIndex = context.list.indexOf(command.id);

    const adjacent = findAdjacentToPivotInSortedArray(
      context.list,
      context.selected,
      context.adjacentPivot
    );
    
    const nextSelection = context.list.slice(
      Math.min(pivotIndex, selectionIndex),
      Math.max(pivotIndex, selectionIndex) + 1
    );

    const toRemove = difference(adjacent, nextSelection);

    return {
      ...context,
      selected: union(without(toRemove, context.selected), nextSelection)
    }
  } else {
    return context;
  }
}
