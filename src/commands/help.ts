import type { OutputLine } from "./index"

const commands = [
  ["help", "Lista todos los comandos disponibles"],
  ["whoami", "Bio, foto y enlaces"],
  ["ls", "Lista proyectos como carpetas"],
  ["cd", "Entra a un proyecto o vuelve con cd .."],
  ["stack", "Tecnologías y porcentajes"],
  ["hobbies", "Música, tenis, basket y videojuegos"],
  ["fastfetch", "Info estilo sistema"],
  ["contact", "Formas de contacto"],
  ["open --gui", "Activa el modo visual"],
  ["clear", "Limpia la terminal"],
] as const

export function cmdHelp(_args: string[]): OutputLine[] {
  return [
    { text: "Comandos disponibles:", bold: true },
    ...commands.map(([name, description]) => ({ text: `${name.padEnd(12)} ${description}` })),
  ]
}
