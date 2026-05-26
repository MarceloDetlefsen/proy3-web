import { Terminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"

export type ParsedInput = {
  cmd: string
  args: string[]
}

export function parseInput(raw: string): ParsedInput {
  const parts = raw.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return { cmd: "", args: [] }
  }

  const [cmd, ...args] = parts
  return { cmd: cmd.toLowerCase(), args }
}

type BootOptions = {
  host: HTMLElement
}

export function bootTerminal({ host }: BootOptions) {
  const terminal = new Terminal({
    cols: 82,
    rows: 22,
    cursorBlink: true,
    convertEol: true,
    scrollback: 200,
    fontFamily:
      '"JetBrains Mono", "SFMono-Regular", "SF Mono", Consolas, monospace',
    fontSize: 14,
    theme: {
      background: "#020617",
      foreground: "#e2e8f0",
      cursor: "#7dd3fc",
      selectionBackground: "rgba(125, 211, 252, 0.25)",
      black: "#0f172a",
      blue: "#38bdf8",
      cyan: "#67e8f9",
      green: "#34d399",
      magenta: "#f0abfc",
      red: "#fb7185",
      white: "#e2e8f0",
      yellow: "#fde68a",
    },
  })

  terminal.open(host)
  terminal.writeln("")
  terminal.writeln("hypr-folio boot sequence")
  terminal.writeln("initialized xterm.js runtime")
  terminal.writeln("")
  terminal.writeln("type system: TypeScript + Vite + Bun")
  terminal.writeln("next step: command registry and shell loop")

  return terminal
}
