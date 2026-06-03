import type { OutputLine } from "./index";

export function cmdGui(args: string[]): OutputLine[] {
  if (!args.includes("--gui")) {
    return [
      { text: "usage: open --gui", color: "dim" },
      { text: "  Activa el modo visual con cards sobre la terminal.", color: "dim" },
    ];
  }

  // terminal.ts intercepts 'open --gui' before calling this and mounts the GUI.
  // These lines are only rendered as a fallback if the overlay fails.
  return [
    { text: "Abriendo modo visual…", color: "cyan" },
    { text: "Presiona Esc o el botón × para volver a la terminal.", color: "dim" },
  ];
}