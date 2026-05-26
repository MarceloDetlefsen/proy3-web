import type { OutputLine } from "./index"

export function cmdWhoami(_args: string[]): OutputLine[] {
  return [
    { text: "Marcelo Detlefsen", bold: true },
    { text: "Portafolio de sistemas y tecnologías web." },
    { text: "GitHub: github.com/marcelo-detlefsen" },
    { text: "LinkedIn: linkedin.com/in/marcelo-detlefsen" },
  ]
}
