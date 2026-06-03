import type { OutputLine } from "./index";

export function cmdEvents(_args: string[]): OutputLine[] {
  return [
    { text: "Participaciones en eventos de CS:", bold: true, color: "cyan" },
    { text: "Abre la vista visual para ver la grilla 3x3 sin ampliacion.", color: "dim" },
  ];
}
