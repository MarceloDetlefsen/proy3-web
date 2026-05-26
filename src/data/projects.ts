export type Project = {
  name: string
  description: string
  stack: string[]
  repo: string
}

export const projects: Project[] = [
  {
    name: "hypr-folio",
    description: "Portafolio personal en terminal inspirado en Hyprland.",
    stack: ["TypeScript", "Vite", "xterm.js"],
    repo: "https://github.com/marcelo-detlefsen/hypr-folio",
  },
  {
    name: "task-scope",
    description: "Gestor simple de tareas con foco en accesibilidad.",
    stack: ["TypeScript", "CSS", "Bun"],
    repo: "https://github.com/marcelo-detlefsen/task-scope",
  },
]
