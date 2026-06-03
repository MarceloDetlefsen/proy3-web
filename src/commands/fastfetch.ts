import type { OutputLine } from "./index";

const APP_START_AT = typeof performance !== "undefined" ? performance.now() : Date.now();

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

export function cmdFastfetch(_args: string[]): OutputLine[] {
  const info = getRuntimeInfo();

  return [
    { text: "       ...............................    ....", color: "cyan" },
    { text: "     .........................................", color: "cyan" },
    { text: "    ............#=...........*+.............. ", color: "cyan" },
    { text: "  ..........*....................--...........", color: "cyan" },
    { text: "..........#.........................#.........", color: "cyan" },
    { text: "......................................#.......", color: "cyan" },
    { text: ".......*************........*#####=.*#.*......", color: "cyan" },
    { text: ".....+...*+********.**......***###=.##..:..... ", color: "cyan" },
    { text: "....-.....+******--***.....+*****#=.##...=....", color: "cyan" },
    { text: "....*.....=*****+.*****....*******+.##....#...", color: "cyan" },
    { text: "...*......:*****+.*****...-*******+.##.....:. ", color: "cyan" },
    { text: "...*......:*****+..*****..*****.**+.##.....#..", color: "cyan" },
    { text: "...*......:*****+..*****..*****.**+.##.....#..", color: "cyan" },
    { text: "...*......:*****+...**********..**+.*#.....#..", color: "cyan" },
    { text: "...*......:*****+...**********..**+.*#.....#..", color: "cyan" },
    { text: "...+:.....:*****+...-********...**+.*#....#:..", color: "cyan" },
    { text: "....*.....******+....********...**+.*#....#...", color: "cyan" },
    { text: ".....*...:******+....+******....***.##...#....", color: "cyan" },
    { text: "........********+.....******....***.##..#.....", color: "cyan" },
    { text: "......................................-#......", color: "cyan" },
    { text: "........**...........................#*.......", color: "cyan" },
    { text: "..........**......................=##.........", color: "cyan" },
    { text: "  ..........:**+...............###........... ", color: "cyan" },
    { text: "    ............:***********##.............   ", color: "cyan" },
    { text: "      ....................................    ", color: "cyan" },
    { text: "", color: "white" },
    { text: "OS: ", color: "cyan", bold: true },
    { text: `  ${info.os}`, color: "green" },
    { text: "WM: ", color: "magenta", bold: true },
    { text: `  ${info.wm}`, color: "magenta" },
    { text: "Browser: ", color: "yellow", bold: true },
    { text: `  ${info.browser}`, color: "yellow" },
    { text: "Terminal: ", color: "blue", bold: true },
    { text: `  ${info.terminal}`, color: "blue" },
    { text: "Host: ", color: "cyan", bold: true },
    { text: `  ${info.host}`, color: "cyan" },
    { text: "Locale: ", color: "green", bold: true },
    { text: `  ${info.locale} · ${info.timezone}`, color: "green" },
    { text: "Viewport: ", color: "magenta", bold: true },
    { text: `  ${info.viewport}`, color: "magenta" },
    { text: "Uptime: ", color: "yellow", bold: true },
    { text: `  ${info.uptime}`, color: "yellow" },
  ];
}
