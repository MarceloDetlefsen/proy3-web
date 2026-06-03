# hypr-folio

> Portafolio personal en forma de terminal interactiva, ambientado en un entorno Hyprland.

---

## Stack

| Herramienta | Rol |
|---|---|
| [Bun](https://bun.sh/) | Runtime y package manager |
| [Vite](https://vitejs.dev/) | Dev server y bundler |
| [xterm.js](https://xtermjs.org/) | Emulador de terminal en el browser |
| TypeScript | Tipado estático y arquitectura del sistema de comandos |
| CSS puro | Glassmorphism / blur estilo Hyprland |

**Sin framework.** El sistema de comandos es un registro de funciones puras — no hay estado reactivo de componentes que justifique React o Vue.

## Estructura de carpetas

```
hypr-folio/
├── index.html
├── package.json
├── bun.lockb
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   ├── wallpapers/        # Fotos que rota el fondo de la terminal
│   ├── gallery/           # Fotos de eventos
│   ├── personal/          # Foto personal
│   └── proyects/          # Capturas y md de proyectos
└── src/
    ├── main.ts              # Entry point — monta xterm.js y el shell
    ├── shell.ts             # Loop principal: input → parser → registry → output
    ├── commands/
    │   ├── index.ts         # CommandRegistry: exporta todos los comandos
    │   ├── whoami.ts
    │   ├── ls.ts
    │   ├── cd.ts
    │   ├── stack.ts
    │   ├── hobbies.ts
    │   ├── fastfetch.ts
    │   ├── events.ts
    │   ├── contact.ts
    │   └── gui.ts           # Lógica del toggle GUI
    ├── data/
    │   ├── projects.ts      # Array con todos tus proyectos
    │   └── stack.ts         # Array con tecnologías y porcentajes
    ├── gui/
    │   ├── index.ts         # Monta/desmonta el modo visual
    │   └── gui.css
    └── styles/
        ├── terminal.css     # Estilos de xterm.js + ventana Hyprland
        └── global.css
```

---

## Arquitectura del sistema de comandos

```typescript
// src/commands/index.ts

type OutputLine = {
  text: string
  color?: "green" | "cyan" | "yellow" | "red" | "magenta" | "blue" | "white" | "dim"
  bold?: boolean
}

type Command = {
  description: string
  run: (args: string[]) => OutputLine[]
}

const registry: Record<string, Command> = {
  help:      { description: "Lista todos los comandos",        run: cmdHelp },
  whoami:    { description: "Sobre mí",                        run: cmdWhoami },
  ls:        { description: "Lista proyectos",                 run: cmdLs },
  cd:        { description: "Entra a un proyecto (cd <name>)", run: cmdCd },
  stack:     { description: "Stack técnico con porcentajes",   run: cmdStack },
  hobbies:   { description: "Mis hobbies",                     run: cmdHobbies },
  fastfetch: { description: "Info del sistema",                run: cmdFastfetch },
  events:    { description: "Eventos y participaciones CS",    run: cmdEvents },
  contact:   { description: "Contacto",                        run: cmdContact },
  open:      { description: "Modo GUI (open --gui)",           run: cmdGui },
  clear:     { description: "Limpia la terminal",              run: cmdClear },
}
```

---

## Reflexión del proyecto

- **Audiencia objetivo:** Startups técnicas y equipos de producto que buscan un developer full-stack con criterio de arquitectura. La apuesta fue que alguien técnico llegara al portafolio y, antes de ver un solo proyecto, ya tuviera señales de cómo pienso: elegí una terminal porque el formato en sí comunica familiaridad con entornos de desarrollo, y eso dice más que cualquier badge de tecnología.

- **Tecnologías elegidas y por qué:** Bun como runtime y package manager por velocidad y simplicidad; Vite como bundler por su DX y la posibilidad de usar plugins personalizados (el `wallpapersPlugin` que genera el módulo virtual de fondos); TypeScript para el tipado estricto del `CommandRegistry`; xterm.js para el emulador de terminal, resolviendo la duda que planteé en el foro a favor de la dependencia porque el costo de reimplementar historial, colores ANSI y resize a mano superaba con creces el peso de la librería; y CSS puro para el glassmorphism estilo Hyprland, donde un framework hubiera agregado capas de abstracción innecesarias. Sin React ni Vue porque el sistema de comandos es un registro de funciones puras que reciben `args` y retornan `OutputLine[]`, no hay estado reactivo de componentes que lo justifique, y esa decisión en sí misma es parte del portafolio.

- **Tecnología del curso que no usé y por qué:** No usé ningún framework de UI. La decisión fue deliberada y está documentada en el `AGENTS.md`: agregar React o Vue hubiera introducido un modelo mental de componentes sobre un problema que no lo necesita. El `CommandRegistry` tipado con `Record<string, Command>` es más expresivo y fácil de extender que cualquier árbol de componentes para este caso.

- **Dónde me arriesgué / dónde jugué seguro:** Me arriesgué al construir toda la interacción encima de xterm.js, porque nunca lo había usado y fue un reto aprender a controlarlo bien. Jugué más seguro en la estructura general porque ya conozco cómo funciona una terminal y me resultó divertido llevar esa idea al navegador.

- **Qué mejoraría con una semana más:** Puliría más el manejo de imágenes, quizá con algo tipo `kitty icat` o similares para simular más aún el comportamiento real de la termianl. Pero sobre todo mejoraría `open --gui`, ya que aunque ahorita es funcional y coherente con el proyecto, no siento que todavía esté tan formal o pulido como para presentarlo como parte de un portafolio real.

---

## Autor

Marcelo Detlefsen - 24554
