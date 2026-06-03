// ─── Terminal bootstrap — browser only, never imported in tests ───────────────
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { parseInput } from "./parser";
import type { CommandRegistry } from "@/commands/index";
import { findProjectByIdentifier, projects } from "@/data/projects";
import type { Project } from "@/data/projects";

export type BootOptions = {
  host: HTMLElement;
  registry: CommandRegistry;
  onProjectChange?: (project: Project | null) => void;
};

const ANSI = {
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
} as const;

const PROMPT = `${ANSI.green}marcelo${ANSI.reset}${ANSI.dim}@${ANSI.reset}${ANSI.cyan}hypr-folio${ANSI.reset} ${ANSI.dim}~${ANSI.reset} $ `;

function completeFromCandidates(value: string, candidates: string[]): string[] {
  const partial = value.toLowerCase();
  if (partial.length === 0) return candidates;
  return candidates.filter((c) => c.toLowerCase().startsWith(partial));
}

function getCdCompletionTarget(
  buffer: string
): { partial: string; hasArgument: boolean } | null {
  const match = buffer.match(/^cd(?:\s+(.*))?$/i);
  if (match === null) return null;
  const partial = (match[1] ?? "").trimStart();
  return {
    partial,
    hasArgument: match[1] !== undefined && match[1].trim().length > 0,
  };
}

function redrawInput(terminal: Terminal, inputBuffer: string): void {
  terminal.write(`\r\u001b[2K${PROMPT}${inputBuffer}`);
}

// Doble rAF: el primer frame deja que xterm actualice su canvas interno,
// el segundo hace el scroll cuando el layout ya está estabilizado.
function syncViewport(terminal: Terminal): void {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      terminal.scrollToBottom();
      terminal.focus();
    });
  });
}

export function bootTerminal({ host, registry, onProjectChange }: BootOptions): Terminal {
  const terminal = new Terminal({
    // Sin cols/rows fijos — FitAddon los calcula según el contenedor real.
    cursorBlink: true,
    convertEol: true,
    scrollback: 500,
    fontFamily:
      '"JetBrains Mono", "SFMono-Regular", "SF Mono", Consolas, monospace',
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.3,
    theme: {
      background: "rgba(2, 6, 23, 0)",
      foreground: "#e2e8f0",
      cursor: "#7dd3fc",
      cursorAccent: "#020617",
      selectionBackground: "rgba(125, 211, 252, 0.22)",
      black: "#0f172a",
      red: "#fb7185",
      green: "#34d399",
      yellow: "#fde68a",
      blue: "#38bdf8",
      magenta: "#f0abfc",
      cyan: "#67e8f9",
      white: "#e2e8f0",
      brightBlack: "#1e293b",
      brightRed: "#fda4af",
      brightGreen: "#6ee7b7",
      brightYellow: "#fef08a",
      brightBlue: "#7dd3fc",
      brightMagenta: "#f5d0fe",
      brightCyan: "#a5f3fc",
      brightWhite: "#f8fafc",
    },
  });

  // ── FitAddon — ajusta cols/rows al tamaño real del contenedor ────────────────
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  terminal.open(host);

  // Primer fit — el host ya tiene dimensiones en este punto.
  fitAddon.fit();

  // ResizeObserver: re-ajusta cada vez que el contenedor cambie de tamaño
  // (ventana redimensionada, fullscreen, etc.).
  const resizeObserver = new ResizeObserver(() => {
    // fit() puede lanzar si el contenedor todavía no tiene dimensiones visibles.
    try {
      fitAddon.fit();
      syncViewport(terminal);
    } catch {
      // silenciar — el siguiente resize lo arreglará.
    }
  });
  resizeObserver.observe(host);

  // xterm 6 no expone onDispose; limpiamos el observer al delegar dispose().
  const disposeTerminal = terminal.dispose.bind(terminal);
  terminal.dispose = () => {
    resizeObserver.disconnect();
    disposeTerminal();
  };

  // ── Boot message ──────────────────────────────────────────────────────────────
  terminal.writeln("");
  terminal.writeln(
    `  ${ANSI.cyan}${ANSI.bold}hypr-folio${ANSI.reset}  ${ANSI.dim}v1.0.0${ANSI.reset}`
  );
  terminal.writeln("");
  terminal.writeln(
    `  ${ANSI.dim}Escribe ${ANSI.reset}${ANSI.yellow}help${ANSI.reset}${ANSI.dim} para ver los comandos disponibles.${ANSI.reset}`
  );
  terminal.writeln("");

  // ── Input buffer + historial ──────────────────────────────────────────────────
  let inputBuffer = "";
  const history: string[] = [];
  let historyIndex = -1;

  const printPrompt = () => terminal.write(PROMPT);
  printPrompt();
  syncViewport(terminal);

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
          terminal.write("\u001b[2J\u001b[3J\u001b[H");
          onProjectChange?.(null);
        } else if (cmd in registry) {
          const lines = registry[cmd].run(args);
          for (const line of lines) {
            const color = line.color
              ? (ANSI[line.color as keyof typeof ANSI] ?? "")
              : "";
            const bold = line.bold ? ANSI.bold : "";
            terminal.writeln(`${bold}${color}${line.text}${ANSI.reset}`);
          }
          if (cmd === "cd") {
            const project = findProjectByIdentifier(args.join(" ").trim());
            onProjectChange?.(project ?? null);
          }
        } else if (cmd !== "") {
          terminal.writeln(
            `${ANSI.red}hypr-folio: command not found: ${cmd}${ANSI.reset}`
          );
          terminal.writeln(`${ANSI.dim}  Prueba con 'help'${ANSI.reset}`);
          onProjectChange?.(null);
        }
      }

      terminal.writeln("");
      printPrompt();
      syncViewport(terminal);
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

    // Flecha arriba — historial anterior
    if (code === 38) {
      if (history.length === 0) return;
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      inputBuffer = history[historyIndex];
      redrawInput(terminal, inputBuffer);
      syncViewport(terminal);
      return;
    }

    // Flecha abajo — historial siguiente
    if (code === 40) {
      if (historyIndex <= 0) {
        historyIndex = -1;
        inputBuffer = "";
        redrawInput(terminal, "");
        syncViewport(terminal);
        return;
      }
      historyIndex--;
      inputBuffer = history[historyIndex];
      redrawInput(terminal, inputBuffer);
      syncViewport(terminal);
      return;
    }

    // Tab — autocompletado
    if (code === 9) {
      domEvent.preventDefault();

      const cdTarget = getCdCompletionTarget(inputBuffer);

      if (cdTarget !== null) {
        const projectNames = projects.map((p) => p.name);
        const matches = completeFromCandidates(cdTarget.partial, projectNames);

        if (cdTarget.partial.length === 0) {
          terminal.writeln("");
          terminal.writeln(`  ${matches.join("  ")}`);
          terminal.writeln("");
          redrawInput(terminal, inputBuffer);
          syncViewport(terminal);
          return;
        }

        if (matches.length === 1) {
          inputBuffer = `cd ${matches[0]}`;
          redrawInput(terminal, inputBuffer);
        } else if (matches.length > 1) {
          terminal.writeln("");
          terminal.writeln(`  ${matches.join("  ")}`);
          terminal.writeln("");
          redrawInput(terminal, inputBuffer);
        }

        syncViewport(terminal);
        return;
      }

      const partial = inputBuffer.toLowerCase();
      if (partial.length === 0) return;

      const matches = Object.keys(registry).filter((c) =>
        c.startsWith(partial)
      );

      if (matches.length === 1) {
        inputBuffer += matches[0].slice(partial.length);
        redrawInput(terminal, inputBuffer);
      } else if (matches.length > 1) {
        terminal.writeln("");
        terminal.writeln(`  ${matches.join("  ")}`);
        terminal.writeln("");
        redrawInput(terminal, inputBuffer);
      }

      syncViewport(terminal);
      return;
    }

    // Caracteres imprimibles
    if (key.length === 1 && !domEvent.ctrlKey && !domEvent.altKey) {
      inputBuffer += key;
      terminal.write(key);
    }
  });

  return terminal;
}
