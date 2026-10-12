import type { OutputLine } from "./index"
import { orderedProjects } from "@/data/projects"

export function cmdLs(_args: string[]): OutputLine[] {
  return orderedProjects.map((project) => ({ text: `${project.featured ? "★ " : "  "}${project.name}/` }))
}
