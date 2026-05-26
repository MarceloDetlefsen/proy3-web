import type { OutputLine } from "./index"

export function cmdContact(_args: string[]): OutputLine[] {
  return [
    { text: "GitHub: github.com/marcelo-detlefsen" },
    { text: "LinkedIn: linkedin.com/in/marcelo-detlefsen" },
    { text: "Email: marcelo@example.com" },
  ]
}
