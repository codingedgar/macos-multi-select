export type Context = {
  list: string[],
  selected: string[],
}

type Command =
  | { type: "SELECT ONE", id: string }
  | { type: "TOGGLE SELECTION", id: string }

export function multiselect(context: Context, command: Command): Context {
  if (command.type === "SELECT ONE" && context.list.includes(command.id)) {
    return {
      ...context,
      selected: [command.id]
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      context.list.includes(command.id) &&
      context.selected.includes(command.id)
    ) {
    return {
      ...context,
      selected: context.selected.filter(x => x !== command.id),
    };
  } else if (
      command.type === 'TOGGLE SELECTION' &&
      context.list.includes(command.id)
    ) {
    return {
      ...context,
      selected: context.selected.concat([command.id])
    };
  } else {
    return context;
  }
}
