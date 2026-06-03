import type { OutputLine } from "./index"
import { projects } from "@/data/projects"

function findProject(name: string) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, "")

  return projects.find((project) => {
    const byName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "")
    const byTitle = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "")
    return byName === normalized || byTitle === normalized
  })
}

export function cmdCd(args: string[]): OutputLine[] {
  const target = args.join(" ").trim()

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
    { text: project.title, bold: true },
    { text: project.description },
    { text: `Stack: ${project.stack.join(", ")}` },
    ...(project.screenshots.length > 0
      ? [{ text: `Capturas: ${project.screenshots.join(", ")}` }]
      : []),
    ...(project.repos.length > 0
      ? project.repos.map((repo, index) => ({
          text: `${index === 0 ? "Repo" : `Repo ${index + 1}`}: ${repo}`,
        }))
      : []),
    ...(project.deploy ? [{ text: `Deploy: ${project.deploy}` }] : []),
  ]
}
