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
  color?: string
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
  contact:   { description: "Contacto",                        run: cmdContact },
  open:      { description: "Modo GUI (open --gui)",           run: cmdOpen },
  clear:     { description: "Limpia la terminal",              run: cmdClear },
}
```

---

## Reflexión del curso

*(Completar antes de la entrega final)*

- **Audiencia objetivo:**
- **Tecnologías elegidas y por qué:**
- **Tecnología del curso que no usé y por qué:**
- **Dónde me arriesgué / dónde jugué seguro:**
- **Qué mejoraría con una semana más:**

---

## Autor

Marcelo Detlefsen - 24554
