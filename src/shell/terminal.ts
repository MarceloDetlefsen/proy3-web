// ─── Terminal bootstrap — browser only, never imported in tests ───────────────
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { ImageAddon } from "@xterm/addon-image";
import "@xterm/xterm/css/xterm.css";
import { parseInput } from "./parser";
import type { CommandRegistry, OutputLine } from "@/commands/index";
import { findProjectByIdentifier, projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { getTechIcon } from "@/data/tech-icons";
import { stack as globalStack } from "@/data/stack";
import type { StackItem } from "@/data/stack";
import type { SimpleIcon } from "simple-icons";

export type BootOptions = {
  host: HTMLElement;
  registry: CommandRegistry;
  onProjectChange?: (project: Project | null) => void;
  onEventsChange?: (active: boolean) => void;
};

export type TerminalShell = Terminal & {
  showScreenshot: (src: string, caption: string, restoresProjectView?: boolean) => Promise<void>;
  closeScreenshot: () => void;
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

const PROMPT_PREFIX = `${ANSI.green}marcelo${ANSI.reset}${ANSI.dim}@${ANSI.reset}${ANSI.cyan}hypr-folio${ANSI.reset} ${ANSI.dim}`;
const PROMPT_SUFFIX = `${ANSI.reset} $ `;
const TECH_IMAGE_WIDTH = 980;
const TECH_CHIP_HEIGHT = 28;
const TECH_CHIP_GAP = 8;
const TECH_IMAGE_PADDING = 8;
const PROFILE_IMAGE_SRC = "/personal/me.jpg";

type TechChip = {
  name: string;
  percentage?: number;
};

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

function buildPrompt(cwd: string): string {
  return `${PROMPT_PREFIX}${cwd}${PROMPT_SUFFIX}`;
}

function renderLines(terminal: Terminal, lines: OutputLine[]): void {
  for (const line of lines) {
    const color = line.color
      ? (ANSI[line.color as keyof typeof ANSI] ?? "")
      : "";
    const bold = line.bold ? ANSI.bold : "";
    terminal.writeln(`${bold}${color}${line.text}${ANSI.reset}`);
  }
}

function getLsLines(project: Project | null): OutputLine[] {
  if (project === null) {
    return projects.map((item) => ({ text: `${item.name}/` }));
  }

  return [{ text: "screenshots/" }];
}

type TerminalSnapshot = {
  lines: string[];
  project: Project | null;
};

type ViewMode = "boot" | "whoami" | "project" | "events" | "other";

function captureSnapshot(terminal: Terminal, project: Project | null): TerminalSnapshot {
  const buffer = terminal.buffer.active;
  const lines: string[] = [];

  for (let y = 0; y < buffer.length; y++) {
    const line = buffer.getLine(y);
    lines.push(line?.translateToString(true) ?? "");
  }

  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }

  return { lines, project };
}

function restoreSnapshot(
  terminal: Terminal,
  snapshot: TerminalSnapshot,
  cwd: string,
  showResumeMessage = true
): void {
  terminal.write("\u001b[2J\u001b[3J\u001b[H");

  if (snapshot.lines.length > 0) {
    terminal.write(snapshot.lines.join("\r\n"));
  }

  if (showResumeMessage) {
    terminal.writeln("");
    terminal.writeln(`${ANSI.dim}historial retomado${ANSI.reset}`);
    terminal.writeln("");
  }

  terminal.write(buildPrompt(cwd));
}

function redrawInput(terminal: Terminal, inputBuffer: string, cwd: string): void {
  terminal.write(`\r\u001b[2K${buildPrompt(cwd)}${inputBuffer}`);
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

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return window.btoa(binary);
}

function utf8ToBase64(value: string): string {
  return bytesToBase64(new TextEncoder().encode(value));
}

function buildIipSequenceFromBytes(
  bytes: Uint8Array,
  caption: string,
  options: { width?: string; height?: string } = {}
): string {
  const encodedImage = bytesToBase64(bytes);
  const encodedName = utf8ToBase64(caption);
  const width = options.width ? `;width=${options.width}` : "";
  const height = options.height ? `;height=${options.height}` : "";

  return `\u001b]1337;File=name=${encodedName};size=${bytes.length};inline=1${width}${height};preserveAspectRatio=1:${encodedImage}\x07`;
}

function drawTechIcon(
  ctx: CanvasRenderingContext2D,
  icon: SimpleIcon | null,
  name: string,
  x: number,
  y: number
): void {
  const size = 18;

  if (icon === null) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "700 8px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.slice(0, 2).toUpperCase(), x + size / 2, y + size / 2 + 0.5);
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = "#38bdf8";
  ctx.fill(new Path2D(icon.path));
  ctx.restore();
}

function measureTechChip(ctx: CanvasRenderingContext2D, chip: TechChip): number {
  ctx.font = "500 14px JetBrains Mono, monospace";
  const labelWidth = ctx.measureText(chip.name).width;
  const percentWidth =
    typeof chip.percentage === "number"
      ? ctx.measureText(`${chip.percentage}%`).width + 18
      : 0;

  return Math.ceil(Math.max(104, 38 + labelWidth + percentWidth));
}

function drawTechChip(
  ctx: CanvasRenderingContext2D,
  chip: TechChip,
  x: number,
  y: number,
  width: number
): void {
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 14px JetBrains Mono, monospace";
  ctx.fillStyle = "#67e8f9";
  ctx.fillText("•", x, y + TECH_CHIP_HEIGHT / 2 + 0.5);

  drawTechIcon(ctx, getTechIcon(chip.name), chip.name, x + 17, y + 5);

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "500 14px JetBrains Mono, monospace";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(chip.name, x + 42, y + TECH_CHIP_HEIGHT / 2 + 0.5);

  if (typeof chip.percentage === "number") {
    ctx.font = "500 11px JetBrains Mono, monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText(`${chip.percentage}%`, x + width - 12, y + TECH_CHIP_HEIGHT / 2 + 0.5);
  }
}

function createTechStackCanvas(chips: TechChip[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const measureCtx = canvas.getContext("2d");
  if (measureCtx === null) {
    throw new Error("No se pudo crear el canvas del stack.");
  }

  const rows: Array<Array<{ chip: TechChip; width: number }>> = [];
  let currentRow: Array<{ chip: TechChip; width: number }> = [];
  let currentWidth = 0;
  const contentWidth = TECH_IMAGE_WIDTH - TECH_IMAGE_PADDING * 2;

  for (const chip of chips) {
    const width = measureTechChip(measureCtx, chip);
    const nextWidth = currentRow.length === 0 ? width : currentWidth + TECH_CHIP_GAP + width;

    if (nextWidth > contentWidth && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push({ chip, width });
    currentWidth = currentRow.length === 1 ? width : currentWidth + TECH_CHIP_GAP + width;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const height =
    TECH_IMAGE_PADDING * 2 +
    rows.length * TECH_CHIP_HEIGHT +
    Math.max(0, rows.length - 1) * TECH_CHIP_GAP;

  canvas.width = TECH_IMAGE_WIDTH;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("No se pudo preparar el canvas del stack.");
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let y = TECH_IMAGE_PADDING;
  for (const row of rows) {
    let x = TECH_IMAGE_PADDING;
    for (const item of row) {
      drawTechChip(ctx, item.chip, x, y, item.width);
      x += item.width + TECH_CHIP_GAP;
    }
    y += TECH_CHIP_HEIGHT + TECH_CHIP_GAP;
  }

  return canvas;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value === null) {
        reject(new Error("No se pudo exportar el canvas."));
        return;
      }
      resolve(value);
    }, "image/png");
  });

  return new Uint8Array(await blob.arrayBuffer());
}

async function buildTechStackSequence(chips: TechChip[], caption: string): Promise<string> {
  const canvas = createTechStackCanvas(chips);
  const bytes = await canvasToPngBytes(canvas);
  return buildIipSequenceFromBytes(bytes, caption, { width: "100%" });
}

function openExternalLink(url: string): void {
  const allowed = /^https?:\/\//i.test(url);
  if (!allowed) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function registerClickableLinks(terminal: Terminal): () => void {
  const urlPattern = /https?:\/\/[^\s)]+/g;

  const disposable = terminal.registerLinkProvider({
    provideLinks(y, callback) {
      const line = terminal.buffer.active.getLine(y - 1);
      if (line === undefined) {
        callback(undefined);
        return;
      }

      const text = line.translateToString(true);
      const links = Array.from(text.matchAll(urlPattern), (match) => {
        const url = match[0];
        const startX = (match.index ?? 0) + 1;
        const endX = startX + url.length;

        return {
          range: {
            start: { x: startX, y },
            end: { x: endX, y },
          },
          text: url,
          activate: () => openExternalLink(url),
        };
      });

      callback(links.length > 0 ? links : undefined);
    },
  });

  return () => disposable.dispose();
}

async function buildIipSequence(
  src: string,
  caption: string,
  options: { width?: string; height?: string } = { width: "100%", height: "100%" }
): Promise<string> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${src}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  return buildIipSequenceFromBytes(bytes, caption, options);
}

function renderOutputLine(terminal: Terminal, line: OutputLine): void {
  const color = line.color
    ? (ANSI[line.color as keyof typeof ANSI] ?? "")
    : "";
  const bold = line.bold ? ANSI.bold : "";
  terminal.writeln(`${bold}${color}${line.text}${ANSI.reset}`);
}

async function renderTechStackImage(
  terminal: Terminal,
  chips: TechChip[],
  caption: string
): Promise<void> {
  const sequence = await buildTechStackSequence(chips, caption);
  terminal.write(sequence);
}

function renderTechStackFallback(terminal: Terminal, chips: TechChip[]): void {
  for (const chip of chips) {
    const percentage = typeof chip.percentage === "number" ? ` ${chip.percentage}%` : "";
    terminal.writeln(`  ${ANSI.cyan}${chip.name}${ANSI.reset}${ANSI.dim}${percentage}${ANSI.reset}`);
  }
}

function openProfilePhoto(terminal: Terminal, src: string, caption: string): void {
  const terminalShell = terminal as TerminalShell;
  void terminalShell.showScreenshot(src, caption, false);
  window.setTimeout(() => terminal.focus(), 0);
}

function registerPhotoLinkProvider(terminal: Terminal): () => void {
  const disposable = terminal.registerLinkProvider({
    provideLinks(y, callback) {
      const line = terminal.buffer.active.getLine(y - 1);
      if (line === undefined) {
        callback(undefined);
        return;
      }

      const text = line.translateToString(true);
      const matches = Array.from(text.matchAll(/photo:\/\/profile/g), (match) => {
        const startX = (match.index ?? 0) + 1;
        const endX = startX + match[0].length;

        return {
          range: {
            start: { x: startX, y },
            end: { x: endX, y },
          },
          text: match[0],
          activate: () => openProfilePhoto(terminal, PROFILE_IMAGE_SRC, "Foto de Marcelo Detlefsen"),
        };
      });

      callback(matches.length > 0 ? matches : undefined);
    },
  });

  return () => disposable.dispose();
}

async function renderWhoamiImage(terminal: Terminal): Promise<void> {
  const sequence = await buildIipSequence(PROFILE_IMAGE_SRC, "Foto de Marcelo Detlefsen", {
    width: "52%",
  });
  terminal.write(sequence);
}

async function renderWhoamiDetails(
  terminal: Terminal,
  lines: OutputLine[]
): Promise<void> {
  await renderWhoamiImage(terminal);
  terminal.writeln("");
  terminal.writeln("");

  renderLines(terminal, lines);
}

async function redrawWhoamiView(
  terminal: Terminal,
  lines: OutputLine[],
  cwd: string,
): Promise<void> {
  terminal.write("\u001b[2J\u001b[3J\u001b[H");
  await renderWhoamiDetails(terminal, lines);
  terminal.writeln("");
  terminal.write(buildPrompt(cwd));
  syncViewport(terminal);
}

async function renderProjectDetails(terminal: Terminal, project: Project): Promise<void> {
  renderOutputLine(terminal, { text: project.title, bold: true, color: "cyan" });
  renderOutputLine(terminal, { text: project.description, color: "dim" });
  terminal.writeln("");
  renderOutputLine(terminal, { text: "Stack", bold: true, color: "yellow" });

  try {
    await renderTechStackImage(
      terminal,
      project.stack.map((name) => ({ name })),
      `${project.title} stack`
    );
  } catch {
    renderTechStackFallback(
      terminal,
      project.stack.map((name) => ({ name }))
    );
  }

  if (project.repos.length > 0) {
    terminal.writeln("");
    project.repos.forEach((repo, index) => {
      renderOutputLine(terminal, {
        text: `${index === 0 ? "Repo" : `Repo ${index + 1}`}: ${repo}`,
        color: "blue",
      });
    });
  }

  if (project.deploy) {
    terminal.writeln("");
    renderOutputLine(terminal, { text: `Deploy: ${project.deploy}`, color: "magenta" });
  }
}

async function renderGlobalStackDetails(terminal: Terminal): Promise<void> {
  const grouped = globalStack.reduce<Record<string, StackItem[]>>((acc, item) => {
    const current = acc[item.category] ?? [];
    current.push(item);
    acc[item.category] = current;
    return acc;
  }, {});

  for (const [category, items] of Object.entries(grouped)) {
    renderOutputLine(terminal, { text: category, bold: true, color: "yellow" });
    const chips = items.map((item) => ({
      name: item.name,
      percentage: item.percentage,
    }));

    try {
      await renderTechStackImage(terminal, chips, `${category} stack`);
    } catch {
      renderTechStackFallback(terminal, chips);
    }
  }
}

export function bootTerminal({
  host,
  registry,
  onProjectChange,
  onEventsChange,
}: BootOptions): TerminalShell {
  let currentProject: Project | null = null;
  let currentView: ViewMode = "boot";
  const sessionStack: TerminalSnapshot[] = [];
  let screenshotSnapshot: TerminalSnapshot | null = null;
  let screenshotOpen = false;
  let activeScreenshotSrc: string | null = null;
  let screenshotRestoresProjectView = true;
  const terminal = new Terminal({
    // Sin cols/rows fijos — FitAddon los calcula según el contenedor real.
    cursorBlink: true,
    convertEol: true,
    scrollback: 500,
    allowProposedApi: true,
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
  terminal.loadAddon(new ImageAddon({
    showPlaceholder: false,
    sixelSupport: false,
  }));
  const disposeLinkProvider = registerClickableLinks(terminal);
  const disposePhotoLinkProvider = registerPhotoLinkProvider(terminal);

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
    disposeLinkProvider();
    disposePhotoLinkProvider();
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
  const getCwd = (): string => (currentProject === null ? "~" : `~/${currentProject.name}`);

  const printPrompt = () => terminal.write(buildPrompt(getCwd()));
  printPrompt();
  syncViewport(terminal);

  function resetScreenshotViewer(): void {
    screenshotSnapshot = null;
    screenshotOpen = false;
    activeScreenshotSrc = null;
    screenshotRestoresProjectView = true;
  }

  async function showScreenshot(
    src: string,
    caption: string,
    restoresProjectView = true
  ): Promise<void> {
    if (screenshotOpen && screenshotSnapshot !== null && src === activeScreenshotSrc) {
      void closeScreenshot();
      return;
    }

    if (!screenshotOpen) {
      screenshotSnapshot = captureSnapshot(terminal, currentProject);
      screenshotOpen = true;
    }

    activeScreenshotSrc = src;
    screenshotRestoresProjectView = restoresProjectView;

    terminal.write("\u001b[2J\u001b[3J\u001b[H");
    terminal.focus();

    try {
      const sequence = await buildIipSequence(src, caption);
      terminal.write(sequence, () => {
        syncViewport(terminal);
      });
    } catch {
      terminal.writeln(`${ANSI.red}No se pudo abrir la captura.${ANSI.reset}`);
      terminal.writeln(`${ANSI.dim}Prueba otra imagen o recarga la página.${ANSI.reset}`);
      if (currentProject !== null && screenshotRestoresProjectView) {
        await redrawProjectView(currentProject);
      } else if (screenshotSnapshot !== null) {
        restoreSnapshot(terminal, screenshotSnapshot, getCwd(), screenshotRestoresProjectView);
      }
      resetScreenshotViewer();
      syncViewport(terminal);
    }
  }

  async function redrawProjectView(project: Project): Promise<void> {
    terminal.write("\u001b[2J\u001b[3J\u001b[H");
    await renderProjectDetails(terminal, project);
    terminal.writeln("");
    printPrompt();
    syncViewport(terminal);
  }

  async function closeScreenshot(): Promise<void> {
    if (!screenshotOpen || screenshotSnapshot === null) {
      return;
    }

    const snapshot = screenshotSnapshot;
    const restoresProjectView = screenshotRestoresProjectView;
    resetScreenshotViewer();
    activeScreenshotSrc = null;

    if (currentProject !== null && restoresProjectView) {
      await redrawProjectView(currentProject);
      onProjectChange?.(currentProject);
      return;
    }

    if (currentView === "whoami" && !restoresProjectView) {
      const lines = registry.whoami.run([]);
      await redrawWhoamiView(terminal, lines, getCwd());
      currentView = "whoami";
      return;
    }

    restoreSnapshot(terminal, snapshot, getCwd(), restoresProjectView);
    onProjectChange?.(currentProject);
    syncViewport(terminal);
  }

  terminal.onKey(({ key, domEvent }) => {
    const code = domEvent.keyCode;

    if (screenshotOpen) {
      if (code === 27) {
        domEvent.preventDefault();
        void closeScreenshot();
      }
      return;
    }

    // Enter
    if (code === 13) {
      terminal.writeln("");
      const raw = inputBuffer.trim();
      inputBuffer = "";
      historyIndex = -1;
      let restoredSession = false;

      if (raw.length > 0) {
        history.unshift(raw);
        const { cmd, args } = parseInput(raw);
        onEventsChange?.(false);

        if (cmd === "clear") {
          terminal.write("\u001b[2J\u001b[3J\u001b[H");
          resetScreenshotViewer();
          currentView = "other";
          onProjectChange?.(currentProject);
        } else if (cmd in registry) {
          if (cmd === "cd") {
            const target = args.join(" ").trim();

            if (target.length > 0 && target !== ".." && currentProject !== null) {
              terminal.writeln(
                `${ANSI.red}cd: primero ejecuta 'cd ..' para salir de ${currentProject.title}${ANSI.reset}`
              );
              terminal.writeln(`${ANSI.dim}  Ahora mismo estas en ${getCwd()}${ANSI.reset}`);
              onProjectChange?.(currentProject);
            } else {
              const lines = registry[cmd].run(args);

              if (target === "..") {
                const snapshot = sessionStack.pop();

                if (snapshot !== undefined) {
                  currentProject = snapshot.project;
                  resetScreenshotViewer();
                  currentView = currentProject === null ? "other" : "project";
                  onProjectChange?.(currentProject);
                  restoreSnapshot(terminal, snapshot, getCwd());
                  restoredSession = true;
                } else {
                  renderLines(terminal, lines);
                  currentProject = null;
                  resetScreenshotViewer();
                  currentView = "other";
                  onProjectChange?.(null);
                }
              } else if (target.length > 0) {
                const project = findProjectByIdentifier(target);
                if (project !== undefined) {
                  sessionStack.push(captureSnapshot(terminal, currentProject));
                  currentProject = project;
                  resetScreenshotViewer();
                  currentView = "project";
                  onProjectChange?.(project);
                  terminal.write("\u001b[2J\u001b[3J\u001b[H");
                  void renderProjectDetails(terminal, project).then(() => {
                    terminal.writeln("");
                    printPrompt();
                    syncViewport(terminal);
                  });
                  return;
                } else {
                  renderLines(terminal, lines);
                  currentProject = null;
                  resetScreenshotViewer();
                  currentView = "other";
                  onProjectChange?.(null);
                }
              }
            }
          } else if (cmd === "ls") {
            onEventsChange?.(false);
            renderLines(terminal, getLsLines(currentProject));
          } else if (cmd === "stack") {
            currentView = "other";
            void renderGlobalStackDetails(terminal).then(() => {
              terminal.writeln("");
              printPrompt();
              syncViewport(terminal);
            });
            return;
          } else if (cmd === "whoami") {
            const lines = registry[cmd].run(args);
            currentView = "whoami";
            void renderWhoamiDetails(terminal, lines).then(() => {
              terminal.writeln("");
              printPrompt();
              syncViewport(terminal);
            });
            return;
          } else if (cmd === "events") {
            const lines = registry[cmd].run(args);
            currentView = "events";
            onProjectChange?.(null);
            onEventsChange?.(true);
            renderLines(terminal, lines);
          } else {
            const lines = registry[cmd].run(args);
            currentView = "other";
            renderLines(terminal, lines);
          }
        } else if (cmd !== "") {
          terminal.writeln(
            `${ANSI.red}hypr-folio: command not found: ${cmd}${ANSI.reset}`
          );
          terminal.writeln(`${ANSI.dim}  Prueba con 'help'${ANSI.reset}`);
          currentView = "other";
          onProjectChange?.(currentProject);
        }
      }

      if (restoredSession) {
        syncViewport(terminal);
        return;
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
      redrawInput(terminal, inputBuffer, getCwd());
      syncViewport(terminal);
      return;
    }

    // Flecha abajo — historial siguiente
    if (code === 40) {
      if (historyIndex <= 0) {
        historyIndex = -1;
        inputBuffer = "";
        redrawInput(terminal, "", getCwd());
        syncViewport(terminal);
        return;
      }
      historyIndex--;
      inputBuffer = history[historyIndex];
      redrawInput(terminal, inputBuffer, getCwd());
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
          if (currentProject === null) {
            terminal.writeln(`  ${matches.join("  ")}`);
          } else {
            terminal.writeln(`  ..`);
          }
          terminal.writeln("");
          redrawInput(terminal, inputBuffer, getCwd());
          syncViewport(terminal);
          return;
        }

        if (currentProject !== null && cdTarget.partial !== "..") {
          terminal.writeln("");
          terminal.writeln(`  cd ..`);
          terminal.writeln("");
          redrawInput(terminal, inputBuffer, getCwd());
          syncViewport(terminal);
          return;
        }

        if (matches.length === 1) {
          inputBuffer = `cd ${matches[0]}`;
          redrawInput(terminal, inputBuffer, getCwd());
        } else if (matches.length > 1) {
          terminal.writeln("");
          terminal.writeln(`  ${matches.join("  ")}`);
          terminal.writeln("");
          redrawInput(terminal, inputBuffer, getCwd());
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
        redrawInput(terminal, inputBuffer, getCwd());
      } else if (matches.length > 1) {
        terminal.writeln("");
        terminal.writeln(`  ${matches.join("  ")}`);
        terminal.writeln("");
        redrawInput(terminal, inputBuffer, getCwd());
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

  const terminalApi = terminal as TerminalShell;
  terminalApi.showScreenshot = showScreenshot;
  terminalApi.closeScreenshot = () => {
    void closeScreenshot();
  };

  return terminalApi;
}

export type { TerminalShell as BootedTerminal };
