// ─── Parser — pure logic, zero DOM deps, fully testable ───────────────────────

export type ParsedInput = {
  cmd: string
  args: string[]
}

export function parseInput(raw: string): ParsedInput {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { cmd: "", args: [] };
  const [cmd, ...args] = parts;
  return { cmd: cmd.toLowerCase(), args };
}