import type { OutputLine } from "./index"
import { projects } from "@/data/projects"

function findProject(name: string) {
  return projects.find((project) => project.name.toLowerCase() === name.toLowerCase())
}

export function cmdCd(args: string[]): OutputLine[] {
  const [target] = args

  if (!target) {
    return [{ text: "usage: cd <proyecto> | cd .." }]
  }

  if (target === "..") {
    return [{ text: "Back to root ~/" }]
  }

  const project = findProject(target)

  if (project === undefined) {
    return [{ text: `Error: project not found: ${target}`, color: "red" }]
  }

  return [
    { text: project.name, bold: true },
    { text: project.description },
    { text: `Stack: ${project.stack.join(", ")}` },
    { text: `Repo: ${project.repo}` },
  ]
}
