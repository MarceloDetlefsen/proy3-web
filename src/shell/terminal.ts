// ─── Terminal bootstrap — browser only, never imported in tests ───────────────
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { parseInput } from "./parser";
import type { CommandRegistry } from "@/commands/index";

export type BootOptions = {
  host: HTMLElement
  registry: CommandRegistry
}

const ANSI = {
  green:   "\x1b[32m",
  cyan:    "\x1b[36m",
  yellow:  "\x1b[33m",
  red:     "\x1b[31m",
  magenta: "\x1b[35m",
  blue:    "\x1b[34m",
  white:   "\x1b[37m",
  dim:     "\x1b[2m",
  bold:    "\x1b[1m",
  reset:   "\x1b[0m",
} as const;

const PROMPT = `${ANSI.green}marcelo${ANSI.reset}${ANSI.dim}@${ANSI.reset}${ANSI.cyan}hypr-folio${ANSI.reset} ${ANSI.dim}~${ANSI.reset} $ `;

export function bootTerminal({ host, registry }: BootOptions): Terminal {
  const terminal = new Terminal({
    cols: 82,
    rows: 22,
    cursorBlink: true,
    convertEol: true,
    scrollback: 200,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", "SF Mono", Consolas, monospace',
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
  });

  terminal.open(host);

  // ── Boot message ────────────────────────────────────────────────────────────
  terminal.writeln("");
  terminal.writeln(`${ANSI.cyan}${ANSI.bold}  hypr-folio${ANSI.reset}  ${ANSI.dim}v1.0.0${ANSI.reset}`);
  terminal.writeln(`${ANSI.dim}  Bun + Vite + xterm.js — sin framework${ANSI.reset}`);
  terminal.writeln("");
  terminal.writeln(`${ANSI.dim}  Escribe ${ANSI.reset}${ANSI.yellow}help${ANSI.reset}${ANSI.dim} para ver los comandos disponibles.${ANSI.reset}`);
  terminal.writeln("");

  // ── Input buffer + history ───────────────────────────────────────────────────
  let inputBuffer = "";
  const history: string[] = [];
  let historyIndex = -1;

  const printPrompt = () => terminal.write(PROMPT);
  printPrompt();

  terminal.onKey(({ key, domEvent }) => {
    const code = domEvent.keyCode;

    // Enter
    if (code === 13) {
      terminal.writeln("");
      const raw = inputBuffer.trim();
      inputBuffer = "";
      historyIndex = -1;

      if (raw.length > 0) {
        history.unshift(raw);
        const { cmd, args } = parseInput(raw);

        if (cmd === "clear") {
          terminal.clear();
        } else if (cmd in registry) {
          const lines = registry[cmd].run(args);
          for (const line of lines) {
            const color = line.color ? (ANSI[line.color] ?? "") : "";
            const bold  = line.bold  ? ANSI.bold : "";
            terminal.writeln(`${bold}${color}${line.text}${ANSI.reset}`);
          }
        } else if (cmd !== "") {
          terminal.writeln(`${ANSI.red}hypr-folio: command not found: ${cmd}${ANSI.reset}`);
          terminal.writeln(`${ANSI.dim}  Prueba con 'help'${ANSI.reset}`);
        }
      }

      terminal.writeln("");
      printPrompt();
      return;
    }

    // Backspace
    if (code === 8) {
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        terminal.write("\b \b");
      }
      return;
    }

    // Arrow Up — history prev
    if (code === 38) {
      if (history.length === 0) return;
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      const entry = history[historyIndex];
      // Clear current line
      terminal.write("\r" + PROMPT + " ".repeat(inputBuffer.length) + "\r" + PROMPT);
      inputBuffer = entry;
      terminal.write(inputBuffer);
      return;
    }

    // Arrow Down — history next
    if (code === 40) {
      if (historyIndex <= 0) {
        historyIndex = -1;
        terminal.write("\r" + PROMPT + " ".repeat(inputBuffer.length) + "\r" + PROMPT);
        inputBuffer = "";
        return;
      }
      historyIndex--;
      const entry = history[historyIndex];
      terminal.write("\r" + PROMPT + " ".repeat(inputBuffer.length) + "\r" + PROMPT);
      inputBuffer = entry;
      terminal.write(inputBuffer);
      return;
    }

    // Tab — autocomplete
    if (code === 9) {
      domEvent.preventDefault();
      const partial = inputBuffer.toLowerCase();
      if (partial.length === 0) return;
      const matches = Object.keys(registry).filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        const completion = matches[0].slice(partial.length);
        inputBuffer += completion;
        terminal.write(completion);
      } else if (matches.length > 1) {
        terminal.writeln("");
        terminal.writeln(matches.join("  "));
        printPrompt();
        terminal.write(inputBuffer);
      }
      return;
    }

    // Printable characters only
    if (key.length === 1 && !domEvent.ctrlKey && !domEvent.altKey) {
      inputBuffer += key;
      terminal.write(key);
    }
  });

  return terminal;
}