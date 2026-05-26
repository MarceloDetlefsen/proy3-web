export type Command = {
  description: string
  run: (args: string[]) => string[]
}

export type CommandRegistry = Record<string, Command>

export const registry: CommandRegistry = {}
