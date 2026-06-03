import type { OutputLine } from "./index";

const APP_START_AT = typeof performance !== "undefined" ? performance.now() : Date.now();
const ANSI = {
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
} as const;

type RuntimeInfo = {
  os: string;
  wm: string;
  browser: string;
  locale: string;
  timezone: string;
  viewport: string;
  host: string;
  terminal: string;
  uptime: string;
};

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function detectBrowser(ua: string): string {
  const normalized = ua.toLowerCase();

  if (normalized.includes("edg/")) return "Edge";
  if (normalized.includes("chrome/")) return "Chromium";
  if (normalized.includes("firefox/")) return "Firefox";
  if (normalized.includes("safari/")) return "Safari";

  return "Browser";
}

function detectOs(platform: string, ua: string): string {
  const haystack = `${platform} ${ua}`.toLowerCase();

  if (haystack.includes("linux")) return "Linux";
  if (haystack.includes("mac")) return "macOS";
  if (haystack.includes("win")) return "Windows";
  if (haystack.includes("android")) return "Android";
  if (haystack.includes("iphone") || haystack.includes("ipad") || haystack.includes("ios")) {
    return "iOS";
  }

  return platform || "Unknown";
}

function getRuntimeInfo(): RuntimeInfo {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  const win = typeof window !== "undefined" ? window : undefined;
  const loc = typeof location !== "undefined" ? location : undefined;

  const userAgent = nav?.userAgent ?? "";
  const navWithUAData = nav as NavigatorWithUAData | undefined;
  const platform = nav?.platform ?? navWithUAData?.userAgentData?.platform ?? "Unknown";
  const language = nav?.language ?? nav?.languages?.[0] ?? "unknown";
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "unknown";

  return {
    os: detectOs(platform, userAgent),
    wm: "Hyprland",
    browser: detectBrowser(userAgent),
    locale: language,
    timezone,
    viewport: win === undefined ? "unknown" : `${win.innerWidth}x${win.innerHeight}`,
    host: loc?.host ?? "localhost",
    terminal: "xterm.js",
    uptime: formatDuration((typeof performance !== "undefined" ? performance.now() : Date.now()) - APP_START_AT),
  };
}

function createStatLine(label: string, value: string, labelColor: string, valueColor = ANSI.dim): string {
  return `${labelColor}${label}${ANSI.reset} ${valueColor}${value}${ANSI.reset}`;
}

export function cmdFastfetch(_args: string[]): OutputLine[] {
  const info = getRuntimeInfo();
  const art = [
    "       ...............................    ....",
    "     .........................................",
    "    ............#=...........*+.............. ",
    "  ..........*....................--...........",
    "..........#.........................#.........",
    "......................................#.......",
    ".......*************........*#####=.*#.*......",
    ".....+...*+********.**......***###=.##..:..... ",
    "....-.....+******--***.....+*****#=.##...=....",
    "....*.....=*****+.*****....*******+.##....#...",
    "...*......:*****+.*****...-*******+.##.....:. ",
    "...*......:*****+..*****..*****.**+.##.....#..",
    "...*......:*****+..*****..*****.**+.##.....#..",
    "...*......:*****+...**********..**+.*#.....#..",
    "...*......:*****+...**********..**+.*#.....#..",
    "...+:.....:*****+...-********...**+.*#....#:..",
    "....*.....******+....********...**+.*#....#...",
    ".....*...:******+....+******....***.##...#....",
    "........********+.....******....***.##..#.....",
    "......................................-#......",
    "........**...........................#*.......",
    "..........**......................=##.........",
    "  ..........:**+...............###........... ",
    "    ............:***********##.............   ",
    "      ....................................    ",
  ];

  const stats = [
    createStatLine("OS:", info.os, ANSI.magenta, ANSI.dim),
    createStatLine("WM:", info.wm, ANSI.magenta, ANSI.dim),
    createStatLine("Browser:", info.browser, ANSI.yellow, ANSI.dim),
    createStatLine("Terminal:", info.terminal, ANSI.blue, ANSI.dim),
    createStatLine("Host:", info.host, ANSI.cyan, ANSI.dim),
    createStatLine("Locale:", `${info.locale} · ${info.timezone}`, ANSI.green, ANSI.dim),
    createStatLine("Viewport:", info.viewport, ANSI.magenta, ANSI.dim),
    createStatLine("Uptime:", info.uptime, ANSI.yellow, ANSI.dim),
  ];

  const artWidth = Math.max(...art.map((line) => line.length));
  const totalRows = Math.max(art.length, stats.length + 1);
  const rows: string[] = [];

  for (let index = 0; index < totalRows; index++) {
    const left = art[index] ?? "";
    const right = stats[index] ?? "";

    if (index === 0) {
      rows.push(`${ANSI.cyan}${left.padEnd(artWidth)}${ANSI.reset}    ${right}`);
      continue;
    }

    if (index < stats.length) {
      rows.push(`${ANSI.cyan}${left.padEnd(artWidth)}${ANSI.reset}    ${right}`);
      continue;
    }

    rows.push(`${ANSI.cyan}${left}${ANSI.reset}`);
  }

  return [
    ...rows.map((text) => ({ text })),
  ];
}
