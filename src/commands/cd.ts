import type { OutputLine } from "./index"
import { findProjectByIdentifier } from "@/data/projects"

export function cmdCd(args: string[]): OutputLine[] {
  const target = args.join(" ").trim()

  if (!target) {
    return [{ text: "usage: cd <proyecto> | cd .." }]
  }

  if (target === "..") {
    return [{ text: "Back to root ~/" }]
  }

  const project = findProjectByIdentifier(target)

  if (project === undefined) {
    return [{ text: `Error: project not found: ${target}`, color: "red" }]
  }

  return [
    { text: project.title, bold: true },
    { text: project.description },
    { text: `Stack: ${project.stack.join(", ")}` },
    ...(project.repos.length > 0
      ? project.repos.map((repo, index) => ({
          text: `${index === 0 ? "Repo" : `Repo ${index + 1}`}: ${repo}`,
        }))
      : []),
    ...(project.deploy ? [{ text: `Deploy: ${project.deploy}` }] : []),
  ]
}
