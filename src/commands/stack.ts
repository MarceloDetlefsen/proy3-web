import type { OutputLine } from "./index"
import { stack } from "@/data/stack"

export function cmdStack(_args: string[]): OutputLine[] {
  const grouped = stack.reduce<Record<string, typeof stack>>((acc, item) => {
    const current = acc[item.category] ?? []
    current.push(item)
    acc[item.category] = current
    return acc
  }, {})

  const lines: OutputLine[] = []

  for (const [category, items] of Object.entries(grouped)) {
    lines.push({ text: category, bold: true })
    for (const item of items) {
      lines.push({ text: `  ${item.name.padEnd(18)} ${String(item.percentage).padStart(3)}%` })
    }
  }

  return lines
}
