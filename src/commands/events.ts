import type { OutputLine } from "./index";

export function cmdEvents(_args: string[]): OutputLine[] {
  return [
    { text: "Participaciones en eventos de CS:", bold: true, color: "cyan" },
  ];
}
