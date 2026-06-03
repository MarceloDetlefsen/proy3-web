export type OutputLine = {
  text: string
  color?: "green" | "cyan" | "yellow" | "red" | "magenta" | "blue" | "white" | "dim"
  bold?: boolean
}

export type Command = {
  description: string
  run: (args: string[]) => OutputLine[]
}

export type CommandRegistry = Record<string, Command>

import { cmdCd } from "./cd"
import { cmdClear } from "./clear"
import { cmdContact } from "./contact"
import { cmdFastfetch } from "./fastfetch"
import { cmdEvents } from "./events"
import { cmdGui } from "./gui"
import { cmdHelp } from "./help"
import { cmdHobbies } from "./hobbies"
import { cmdLs } from "./ls"
import { cmdStack } from "./stack"
import { cmdWhoami } from "./whoami"

export const registry: CommandRegistry = {
  help: { description: "Lista todos los comandos disponibles", run: cmdHelp },
  whoami: { description: "Bio y enlaces personales", run: cmdWhoami },
  ls: { description: "Lista proyectos", run: cmdLs },
  cd: { description: "Entra a un proyecto", run: cmdCd },
  stack: { description: "Stack técnico", run: cmdStack },
  hobbies: { description: "Hobbies personales", run: cmdHobbies },
  fastfetch: { description: "Info estilo sistema", run: cmdFastfetch },
  events: { description: "Participaciones en eventos CS", run: cmdEvents },
  contact: { description: "Contacto", run: cmdContact },
  open: { description: "Activa modo GUI", run: cmdGui },
  clear: { description: "Limpia la terminal", run: cmdClear },
}
