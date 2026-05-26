import type { OutputLine } from "./index"

export function cmdGui(args: string[]): OutputLine[] {
  if (!args.includes("--gui")) {
    return [{ text: "usage: open --gui" }]
  }

  return [
    { text: "GUI mode enabled." },
    { text: "Projects, stack, hobbies and contact would render as cards." },
  ]
}
