import type { OutputLine } from "./index"

export function cmdWhoami(_args: string[]): OutputLine[] {
  return [
    { text: "Marcelo Detlefsen", bold: true, color: "cyan" },
    { text: "Full Stack Developer | Computer Science Student", color: "yellow" },
    { text: "", color: "dim" },
    {
      text: "Soy estudiante de Ingenieria en Ciencias de la Computacion en la Universidad del Valle de Guatemala.",
      color: "white",
    },
    {
      text: "Soy un entusiasta de Linux y de servidores, también pienso desarrollarme en redes ciberseguridad. Por el momento domino el desarrollo web moderno y apunto a construir herramientas que resuelvan problemas reales.",
      color: "dim",
    },
    {
      text: "Me encuentro en Ciudad de Guatemala y disponible para trabajar en proyectos full stack, practicas o colaboraciones tecnicas.",
      color: "green",
    },
  ]
}
