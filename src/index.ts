import { head, last, take, union, without } from "ramda";
import { findAdjacentToKeyInIndex, findNextPivot } from "./arrayUtils";

export type Context = {
  index: string[],
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
  | { type: "SELECT NEXT ADJACENT" }

function listIncludesAndIsNotEmpty(index: string[], key: string) {
  return index.length > 0 && index.includes(key)
}

export function multiselect(context: Context, command: Command): Context {

  if (
    command.type === "SELECT ONE" &&
    listIncludesAndIsNotEmpty(context.index, command.id)
  ) {
    return {
      ...context,
      selected: [command.id],
      adjacentPivot: command.id,
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      listIncludesAndIsNotEmpty(context.index, command.id) &&
      context.selected.includes(command.id) &&
      context.selected.length === 1
  ) {
    return {
      ...context,
      selected: [],
      adjacentPivot: head(context.index),
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      listIncludesAndIsNotEmpty(context.index, command.id) &&
      context.selected.includes(command.id)
  ) {
    const selected = context.selected.filter(x => x !== command.id);
    const adjacentPivot = findNextPivot(
      context.index,
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
    context.index.includes(command.id)
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
      adjacentPivot: head(context.index)!,
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.index, command.id) &&
    context.selected.length === 0
  ) {
    const n = context.index.indexOf(command.id) + 1;
    return {
      ...context,
      selected: take(n, context.index),
      adjacentPivot: head(context.index),
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.index, command.id)  &&
    context.adjacentPivot !== undefined
  ) {

    const pivotIndex = context.index.indexOf(context.adjacentPivot);
    const selectionIndex = context.index.indexOf(command.id);

    const adjacentToStart = findAdjacentToKeyInIndex(
      context.index,
      context.selected,
      context.adjacentPivot
    );
    
    const adjacentToEnd = findAdjacentToKeyInIndex(
      context.index,
      context.selected,
      command.id,
    );
    
    const nextSelection = context.index.slice(
      Math.min(pivotIndex, selectionIndex),
      Math.max(pivotIndex, selectionIndex) + 1
    );

    if (pivotIndex > selectionIndex){
      nextSelection.reverse()
    }

    const toRemove = union(adjacentToStart, adjacentToEnd);

    return {
      ...context,
      selected: union(without(toRemove, context.selected), nextSelection)
    }
  } else if(
    command.type === "SELECT NEXT" &&
    context.index.length &&
    context.selected.length === 0
  ) {
    return {
      ...context,
      selected: [context.index[0]],
      adjacentPivot: context.index[0],
    }
  } else if (
    command.type === "SELECT NEXT" &&
    context.index.length &&
    context.selected.length
  ) {
    const pivotIndex = context.index.indexOf(last(context.selected)!)

    if (pivotIndex < context.index.length - 1) {
      const nextKey = context.index[pivotIndex + 1];

      return {
        ...context,
        selected: [nextKey],
        adjacentPivot: nextKey
      }
    } else if (
      !(
        context.selected.length === 1 &&
        context.selected[0] === last(context.index)
      )
    ) {
      const pivot = context.index[pivotIndex];
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
    context.index.length &&
    context.selected.length === 0
  ) {
    const pivot = last(context.index)!;
    return {
      ...context,
      selected: [pivot],
      adjacentPivot: pivot,
    }
  } else if (
    command.type === "SELECT PREVIOUS" &&
    context.index.length &&
    context.selected.length
  ) {
    const pivotIndex = context.index.indexOf(last(context.selected)!)

    if (pivotIndex > 0) {
      const prevKey = context.index[pivotIndex - 1];
      return {
        ...context,
        selected: [prevKey],
        adjacentPivot: prevKey
      }
    } else if (
      !(
        context.selected.length === 1 &&
        context.selected[0] === head(context.index)
      )
    ) {
      const pivot = head(context.index)!;
      return {
        ...context,
        selected: [pivot],
        adjacentPivot: pivot
      }
    } else {
      return context;
    }
  } else if (
    command.type === "SELECT NEXT ADJACENT" &&
    context.index.length > 0 &&
    context.selected.length === 0
  ) {
    const pivot =  head(context.index)!;
    return {
      ...context,
      selected: [pivot],
      adjacentPivot: pivot
    }
  } else if (
    command.type === "SELECT NEXT ADJACENT" &&
    context.index.length > 0
  ) {
    const lastSelected = last(context.selected)!;
    const lastSelectedIndex = context.index.indexOf(lastSelected);

    return {
      ...context,
      selected: context.selected.concat([context.index[lastSelectedIndex + 1]])
    }
  } else {
    return context;
  }
}
