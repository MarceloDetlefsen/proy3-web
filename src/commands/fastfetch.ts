import type { OutputLine } from "./index"

export function cmdFastfetch(_args: string[]): OutputLine[] {
  return [
    { text: "    ___      ", color: "cyan" },
    { text: "   (.. \\     ", color: "cyan" },
    { text: "   (<> |     ", color: "cyan" },
    { text: "  //  \\ \\    ", color: "cyan" },
    { text: " ( |  | /|    ", color: "cyan" },
    { text: "_/\\ __)/_)    ", color: "cyan" },
    { text: "\\/-____\\/     ", color: "cyan" },
    { text: "", color: "white" },
    { text: "OS: Arch Linux", color: "white" },
    { text: "WM: Hyprland", color: "white" },
    { text: "Uptime: 5+ years of experience", color: "white" },
    { text: "Shell: Bun + Vite + TypeScript", color: "white" },
  ]
}
