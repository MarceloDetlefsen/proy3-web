import type { OutputLine } from "./index"

export function cmdContact(_args: string[]): OutputLine[] {
  return [
    { text: "Contacto", bold: true, color: "cyan" },
    { text: "Disponible en Guatemala para trabajo y colaboraciones.", color: "green" },
    { text: "", color: "dim" },
    { text: "Email", bold: true, color: "yellow" },
    { text: "  marcelodetlefsen@gmail.com", color: "white" },
    { text: "", color: "dim" },
    { text: "Enlaces profesionales", bold: true, color: "yellow" },
    { text: "  GitHub:   https://github.com/MarceloDetlefsen", color: "blue" },
    {
      text: "  LinkedIn: https://www.linkedin.com/in/marcelo-detlefsen-2b170337b/",
      color: "blue",
    },
  ]
}
