import type { OutputLine } from "./index"
import { projects } from "@/data/projects"

export function cmdLs(_args: string[]): OutputLine[] {
  return projects.map((project) => ({ text: `${project.name}/` }))
}
