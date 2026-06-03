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

  const stackLines: OutputLine[] = project.stack.map((tech, index): OutputLine => ({
    text: `${index === 0 ? "  └─" : "    •"} ${tech}`,
    color: (index % 2 === 0 ? "cyan" : "white") as OutputLine["color"],
  }))

  const repoLines: OutputLine[] = project.repos.map((repo, index): OutputLine => ({
    text: `${index === 0 ? "Repo" : `Repo ${index + 1}`}: ${repo}`,
    color: "blue" as OutputLine["color"],
  }))

  const titleLine: OutputLine = { text: project.title, bold: true, color: "cyan" }
  const descriptionLine: OutputLine = { text: project.description, color: "dim" }
  const sectionBreak: OutputLine = { text: "", color: "dim" }
  const stackHeader: OutputLine = { text: "Stack", bold: true, color: "yellow" }
  const deployLine: OutputLine | null = project.deploy
    ? { text: `Deploy: ${project.deploy}`, color: "magenta" as OutputLine["color"] }
    : null

  return [
    titleLine,
    descriptionLine,
    sectionBreak,
    stackHeader,
    ...stackLines,
    ...(project.repos.length > 0 ? [sectionBreak, ...repoLines] : []),
    ...(deployLine !== null ? [sectionBreak, deployLine] : []),
  ]
}
