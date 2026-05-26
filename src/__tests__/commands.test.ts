/**
 * TDD — Command Registry
 *
 * Each test describes the CONTRACT of a command:
 * what shape it must return and what invariants it must satisfy.
 * Implementations start empty; tests go red until each command is built.
 *
 * Run with: bun test
 */

import { describe, expect, it } from "bun:test";
import type { OutputLine } from "@/commands/index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Every item must be an OutputLine object with at least a `text` string. */
function assertOutputLines(lines: OutputLine[]) {
  expect(Array.isArray(lines)).toBe(true);
  for (const line of lines) {
    expect(typeof line).toBe("object");
    expect(typeof line.text).toBe("string");
  }
}

/** Returns the concatenated text of all lines — useful for content assertions. */
function fullText(lines: OutputLine[]) {
  return lines.map((l) => l.text).join("\n");
}

// ─── help ─────────────────────────────────────────────────────────────────────

describe("help", () => {
  it("returns at least one OutputLine per registered command", async () => {
    const { cmdHelp } = await import("@/commands/help");
    const lines = cmdHelp([]);
    assertOutputLines(lines);
    expect(lines.length).toBeGreaterThan(0);
  });

  it("mentions every core command by name", async () => {
    const { cmdHelp } = await import("@/commands/help");
    const text = fullText(cmdHelp([]));
    const coreCmds = ["whoami", "ls", "cd", "stack", "hobbies", "fastfetch", "contact", "open", "clear"];
    for (const cmd of coreCmds) {
      expect(text).toContain(cmd);
    }
  });

  it("ignores extra arguments gracefully", async () => {
    const { cmdHelp } = await import("@/commands/help");
    expect(() => cmdHelp(["garbage"])).not.toThrow();
  });
});

// ─── whoami ───────────────────────────────────────────────────────────────────

describe("whoami", () => {
  it("returns valid OutputLines", async () => {
    const { cmdWhoami } = await import("@/commands/whoami");
    assertOutputLines(cmdWhoami([]));
  });

  it("output contains a name", async () => {
    const { cmdWhoami } = await import("@/commands/whoami");
    const text = fullText(cmdWhoami([]));
    // Must contain at least one word that looks like a name (capitalized)
    expect(text).toMatch(/[A-Z][a-z]+/);
  });

  it("output contains at least one link (github or linkedin)", async () => {
    const { cmdWhoami } = await import("@/commands/whoami");
    const text = fullText(cmdWhoami([]));
    expect(text.toLowerCase()).toMatch(/github|linkedin/);
  });
});

// ─── ls ───────────────────────────────────────────────────────────────────────

describe("ls", () => {
  it("returns valid OutputLines", async () => {
    const { cmdLs } = await import("@/commands/ls");
    assertOutputLines(cmdLs([]));
  });

  it("lists at least one project", async () => {
    const { cmdLs } = await import("@/commands/ls");
    expect(cmdLs([]).length).toBeGreaterThan(0);
  });

  it("each project line ends with / (directory convention)", async () => {
    const { cmdLs } = await import("@/commands/ls");
    const projectLines = cmdLs([]).filter((l) => l.text.trim().length > 0);
    for (const line of projectLines) {
      expect(line.text.trim()).toMatch(/\/$/);
    }
  });
});

// ─── cd ───────────────────────────────────────────────────────────────────────

describe("cd", () => {
  it("returns valid OutputLines for a known project", async () => {
    const { cmdCd } = await import("@/commands/cd");
    const { projects } = await import("@/data/projects");
    // Skip if no projects defined yet
    if (projects.length === 0) return;
    assertOutputLines(cmdCd([projects[0].name]));
  });

  it("returns an error line for an unknown project", async () => {
    const { cmdCd } = await import("@/commands/cd");
    const lines = cmdCd(["this-project-does-not-exist-xyz"]);
    assertOutputLines(lines);
    const text = fullText(lines).toLowerCase();
    expect(text).toMatch(/not found|no existe|unknown|error/);
  });

  it("cd .. returns a line indicating we are back at root", async () => {
    const { cmdCd } = await import("@/commands/cd");
    const lines = cmdCd([".."]);
    assertOutputLines(lines);
    const text = fullText(lines).toLowerCase();
    expect(text).toMatch(/root|home|~|\//);
  });

  it("cd with no args returns usage hint", async () => {
    const { cmdCd } = await import("@/commands/cd");
    const lines = cmdCd([]);
    assertOutputLines(lines);
    expect(lines.length).toBeGreaterThan(0);
  });
});

// ─── stack ────────────────────────────────────────────────────────────────────

describe("stack", () => {
  it("returns valid OutputLines", async () => {
    const { cmdStack } = await import("@/commands/stack");
    assertOutputLines(cmdStack([]));
  });

  it("output contains percentage values (0-100)", async () => {
    const { cmdStack } = await import("@/commands/stack");
    const text = fullText(cmdStack([]));
    expect(text).toMatch(/\d+%/);
  });

  it("output contains at least 5 technologies", async () => {
    const { cmdStack } = await import("@/commands/stack");
    const lines = cmdStack([]).filter((l) => l.text.trim().length > 0);
    expect(lines.length).toBeGreaterThanOrEqual(5);
  });

  it("output contains category headers", async () => {
    const { cmdStack } = await import("@/commands/stack");
    const text = fullText(cmdStack([]));
    // Must have at least one section label
    expect(text).toMatch(/frontend|backend|infra|db|database|devops/i);
  });
});

// ─── hobbies ─────────────────────────────────────────────────────────────────

describe("hobbies", () => {
  it("returns valid OutputLines", async () => {
    const { cmdHobbies } = await import("@/commands/hobbies");
    assertOutputLines(cmdHobbies([]));
  });

  it("mentions all four hobbies", async () => {
    const { cmdHobbies } = await import("@/commands/hobbies");
    const text = fullText(cmdHobbies([])).toLowerCase();
    expect(text).toMatch(/m[uú]sica|music/);
    expect(text).toMatch(/tenis|tennis/);
    expect(text).toMatch(/basket/);
    expect(text).toMatch(/video\s?game|juego|gaming/);
  });
});

// ─── fastfetch ────────────────────────────────────────────────────────────────

describe("fastfetch", () => {
  it("returns valid OutputLines", async () => {
    const { cmdFastfetch } = await import("@/commands/fastfetch");
    assertOutputLines(cmdFastfetch([]));
  });

  it("output has at least 8 lines (ascii art + stats)", async () => {
    const { cmdFastfetch } = await import("@/commands/fastfetch");
    expect(cmdFastfetch([]).length).toBeGreaterThanOrEqual(8);
  });

  it("output contains OS and WM fields", async () => {
    const { cmdFastfetch } = await import("@/commands/fastfetch");
    const text = fullText(cmdFastfetch([])).toLowerCase();
    expect(text).toMatch(/os|distro/);
    expect(text).toMatch(/wm|window manager/);
  });

  it("output contains an uptime-like field", async () => {
    const { cmdFastfetch } = await import("@/commands/fastfetch");
    const text = fullText(cmdFastfetch([])).toLowerCase();
    expect(text).toMatch(/uptime|experience|exp/);
  });
});

// ─── contact ──────────────────────────────────────────────────────────────────

describe("contact", () => {
  it("returns valid OutputLines", async () => {
    const { cmdContact } = await import("@/commands/contact");
    assertOutputLines(cmdContact([]));
  });

  it("output contains at least one contact method", async () => {
    const { cmdContact } = await import("@/commands/contact");
    const text = fullText(cmdContact([])).toLowerCase();
    expect(text).toMatch(/github|linkedin|email|mailto|@/);
  });
});

// ─── clear ────────────────────────────────────────────────────────────────────

describe("clear", () => {
  it("returns an empty array (signals shell to wipe screen)", async () => {
    const { cmdClear } = await import("@/commands/clear");
    const lines = cmdClear([]);
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBe(0);
  });
});

// ─── gui (open --gui) ─────────────────────────────────────────────────────────

describe("open --gui", () => {
  it("returns valid OutputLines", async () => {
    const { cmdGui } = await import("@/commands/gui");
    assertOutputLines(cmdGui(["--gui"]));
  });

  it("returns an error/hint if called without --gui flag", async () => {
    const { cmdGui } = await import("@/commands/gui");
    const lines = cmdGui([]);
    assertOutputLines(lines);
    expect(lines.length).toBeGreaterThan(0);
  });
});

// ─── Shell parser (unit) ──────────────────────────────────────────────────────

describe("shell parser", () => {
  it("splits input into command and args correctly", async () => {
    const { parseInput } = await import("@/shell");
    expect(parseInput("cd my-project")).toEqual({ cmd: "cd", args: ["my-project"] });
    expect(parseInput("open --gui")).toEqual({ cmd: "open", args: ["--gui"] });
    expect(parseInput("  HELP  ")).toEqual({ cmd: "help", args: [] });
    expect(parseInput("")).toEqual({ cmd: "", args: [] });
  });

  it("handles extra whitespace between args", async () => {
    const { parseInput } = await import("@/shell");
    expect(parseInput("cd   my-project")).toEqual({ cmd: "cd", args: ["my-project"] });
  });
});
