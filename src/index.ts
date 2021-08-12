import { head, take } from "ramda";

export type Context = {
  list: string[],
  selected: string[],
  adjacentPivot: undefined,
  lastSelected: undefined,
} | {
  list: string[],
  selected: string[],
  adjacentPivot: string,
  lastSelected: string,
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
      lastSelected: command.id,
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
      adjacentPivot: undefined,
      lastSelected: undefined
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      listIncludesAndIsNotEmpty(context.list, command.id) &&
      context.selected.includes(command.id)
  ) {
    const index = context.selected.indexOf(command.id);
    const adjacentPivot= (index < (context.selected.length - 1))
        ? context.selected[index + 1]
        : context.selected[index - 1];
    return {
      ...context,
      selected: context.selected.filter(x => x !== command.id),
      adjacentPivot,
      lastSelected: adjacentPivot
    };
  } else if (
    command.type === 'TOGGLE SELECTION' &&
    context.list.includes(command.id)
  ) {
    return {
      ...context,
      selected: context.selected.concat([command.id]),
      adjacentPivot: command.id,
      lastSelected: command.id
    };
  } else if (command.type === "DESELECT ALL") {
    return {
      ...context,
      selected: [],
      adjacentPivot: undefined,
      lastSelected: undefined
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
      adjacentPivot: head(context.list)!,
      lastSelected: command.id,
    }
  } else if (
    command.type === "SELECT ADJACENT" &&
    listIncludesAndIsNotEmpty(context.list, command.id) &&
    context.adjacentPivot
  ) {
    const start = context.list.indexOf(context.adjacentPivot);
    const n = context.list.indexOf(command.id);
    return {
      ...context,
      selected: context.list.slice(Math.min(start, n), Math.max(start, n) + 1),
      lastSelected: command.id
    }
  } else {
    return context;
  }
}
