export type StackItem = {
  category: string
  name: string
  percentage: number
}

export const stack: StackItem[] = [
  { category: "Frontend", name: "TypeScript", percentage: 92 },
  { category: "Frontend", name: "CSS", percentage: 88 },
  { category: "Backend", name: "Bun", percentage: 80 },
  { category: "Backend", name: "Node.js", percentage: 75 },
  { category: "DB", name: "PostgreSQL", percentage: 68 },
  { category: "Infra", name: "GitHub Actions", percentage: 72 },
]
