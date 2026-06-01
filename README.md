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

---

## Roadmap

### Fase 1 — Setup del proyecto
- [x] Inicializar proyecto con `bun create vite` (vanilla-ts)
- [x] Instalar y configurar `xterm.js`
- [x] Configurar `tsconfig.json` con paths alias (`@/commands`, `@/data`, etc.)
- [x] Estructura base de carpetas (ver abajo)
- [X] Se implementan los tests y el formateo con lint

### Fase 2 — Shell del entorno Hyprland
- [X] Diseñar el layout: barra de estado superior (hora, usuario, distro) + ventana de terminal centrada
- [X] Efecto glassmorphism en la ventana (blur, bordes redondeados, sombra)
- [X] Wallpaper de fondo (estático o animado)
- [X] Responsivo básico (la ventana se adapta a móvil)

### Fase 3 — Sistema de comandos
- [X] Crear el `CommandRegistry` — tipo `Record<string, Command>` con `run` y `description`
- [X] Parser de input: separar comando de argumentos, trim, lowercase
- [X] Historial de comandos con flechas `↑` / `↓`
- [X] Autocompletado con `Tab`
- [X] Animación de output tipo typewriter

### Fase 4 — Comandos principales

| Comando | Estado |
|---|---|
| `help` | Lista todos los comandos disponibles |
| `whoami` | Bio, foto, links (GitHub, LinkedIn) |
| `ls` | Lista todos los proyectos como carpetas |
| `cd <proyecto>` | Entra a un proyecto — descripción, capturas, stack, link al repo |
| `cd ..` | Regresa al directorio raíz |
| `stack` | Tecnologías con barras de porcentaje animadas |
| `hobbies` | Música, tenis, basket, videojuegos |
| `contact` | Formas de contacto |
| `fastfetch` | ASCII art con info del "sistema" (skills, OS, uptime = años de exp.) |
| `open --gui` | Activa modo visual con cards |
| `clear` | Limpia la terminal |

### Fase 5 - Comando `cd` a cada uno de los proyectos a mostrar en el repositorio
- [ ] Definir qué proyectos van a aparecer como destinos válidos de `cd`
- [ ] Definir estructura de datos para proyectos (`@/data/projects.ts`)
- [ ] Conectar `cd <proyecto>` con los datos reales del repositorio
- [ ] Mostrar descripción breve del proyecto al entrar
- [ ] Mostrar stack usado en cada proyecto
- [ ] Mostrar capturas o screenshots del proyecto
- [ ] Incluir enlace al repositorio o demo si existe
- [ ] Manejar `cd ..` para volver al root sin perder el estado
- [ ] Mostrar un mensaje de error claro cuando el proyecto no exista
- [ ] Verificar que `ls` y `cd` usen la misma fuente de datos
- [ ] Probar que la navegación entre root y proyectos sea consistente

### Fase 6 — Comando `fastfetch`
- [ ] Diseñar ASCII art (logo personal o distro ficticia)
- [ ] Layout dos columnas: ASCII a la izquierda, stats a la derecha
- [ ] Stats: OS, Shell, WM, Languages, Uptime, etc. — todos personalizados

### Fase 7 — Modo GUI (`open --gui`)
- [ ] Toggle que renderiza una vista de cards sobre la terminal
- [ ] Mismas secciones: proyectos, stack, hobbies, contacto
- [ ] Botón para volver al modo terminal
- [ ] Transición animada entre modos

### Fase 8 — Comando `stack`
- [ ] Array de tecnologías con porcentaje de dominio
- [ ] Barras animadas que se llenan al renderizar
- [ ] Agrupadas por categoría (Frontend, Backend, Infra, DB, etc.)

### Fase 9 — Deploy y producción
- [ ] Build con `bun run build`
- [ ] Deploy en Vercel o Netlify (o GitHub Pages)
- [ ] Dominio personalizado (opcional — ya tenés experiencia con esto)
- [ ] Lighthouse audit: performance, accesibilidad, SEO básico
- [ ] README final con URL del portafolio publicado

### Fase 10 — Reflexión (entregable del curso)
- [ ] Escribir reflexión de 1-2 páginas respondiendo las 5 preguntas del assignment
- [ ] Agregar reflexión al README del repo

---

## Estructura de carpetas

```
hypr-folio/
├── index.html
├── package.json
├── bun.lockb
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── wallpaper.png
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
