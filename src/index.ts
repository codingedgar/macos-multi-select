import { difference, head, last, take, union, without } from "ramda";
import { findAdjacentToPivotInSortedArray, findNextPivot } from "./arrayUtils";

export type Context = {
  list: string[],
  selected: string[],
  adjacentPivot: string | undefined,
}

export type Command =
  | { type: "SELECT ONE", id: string }
  | { type: "TOGGLE SELECTION", id: string }
  | { type: "DESELECT ALL" }
  | { type: "SELECT ADJACENT", id: string }
  | { type: "SELECT NEXT" }
  | { type: "SELECT PREVIOUS" }

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
    return {
      ...context,
      selected: [],
      adjacentPivot: head(context.list),
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
      command.id
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
      adjacentPivot: head(context.list),
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.list, command.id)  &&
    context.adjacentPivot !== undefined
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

    if (pivotIndex > selectionIndex){
      nextSelection.reverse()
    }

    const toRemove = difference(adjacent, nextSelection);

    return {
      ...context,
      selected: union(without(toRemove, context.selected), nextSelection)
    }
  } else if(
    command.type === "SELECT NEXT" &&
    context.list.length &&
    context.selected.length === 0
  ) {
    return {
      ...context,
      selected: [context.list[0]],
      adjacentPivot: context.list[0],
    }
  } else if (
    command.type === "SELECT NEXT" &&
    context.list.length &&
    context.selected.length
  ) {
    const pivotIndex = context.list.indexOf(last(context.selected)!)

    if (pivotIndex < context.list.length - 1) {
      const nextItem = context.list[pivotIndex + 1];

      return {
        ...context,
        selected: [nextItem],
        adjacentPivot: nextItem
      }
    } else if (
      !(
        context.selected.length === 1 &&
        context.selected[0] === last(context.list)
      )
    ) {
      const pivot = context.list[pivotIndex];
      return {
        ...context,
        selected: [pivot],
        adjacentPivot: pivot,
      }
    } else {
      return context;
    }
  } else if (
    command.type === "SELECT PREVIOUS" &&
    context.list.length &&
    context.selected.length === 0
  ) {
    const pivot = last(context.list)!;
    return {
      ...context,
      selected: [pivot],
      adjacentPivot: pivot,
    }
  } else if (
    command.type === "SELECT PREVIOUS" &&
    context.list.length &&
    context.selected.length
  ) {
    const pivotIndex = context.list.indexOf(last(context.selected)!)

    if (pivotIndex > 0) {
      const prevItem = context.list[pivotIndex - 1];
      return {
        ...context,
        selected: [prevItem],
        adjacentPivot: prevItem
      }
    } else if (
      !(
        context.selected.length === 1 &&
        context.selected[0] === head(context.list)
      )
    ) {
      const pivot = head(context.list)!;
      return {
        ...context,
        selected: [pivot],
        adjacentPivot: pivot
      }
    } else {
      return context;
    }
  } else {
    return context;
  }
}
