type Context = {
  list: string[],
  selected: string[],
}

type Command =
  | {type: "SINGLE SELECT", id: string}

export function multiselect(context: Context, command: Command): Context {
  if (command.type === 'SINGLE SELECT' && context.list.includes(command.id)) {
    return {
      ...context,
      selected: [command.id]
    };
  } else {
    return context;
  }
}
