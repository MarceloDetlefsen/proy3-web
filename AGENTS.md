# AGENTS.md — hypr-folio

Este archivo define las reglas de trabajo para cualquier agente de IA (Claude, Codex, Cursor, Copilot, etc.) que colabore en este repositorio.
**Leerlo completo antes de tocar cualquier archivo.**

---

## 0. Identidad del proyecto

`hypr-folio` es un portafolio personal en forma de terminal interactiva ambientada en Hyprland.
Stack: **Bun + Vite + TypeScript + xterm.js — sin framework de UI**.

No instales React, Vue, Svelte, ni ningún framework de componentes.
No instales librerías de animación externas salvo que el roadmap lo indique explícitamente.
No cambies el runtime de Bun a Node/npm/pnpm.

---

## 1. Regla de oro: respetar el orden del roadmap

El roadmap tiene 10 fases. **Nunca trabajes en una fase sin haber completado la anterior.**
Si te piden implementar algo de la Fase 4 y la Fase 3 tiene ítems sin completar, detente y señala el bloqueo.

```
Fase 1  → Setup
Fase 2  → Layout Hyprland
Fase 3  → Sistema de comandos (shell loop)
Fase 4  → Implementación de cada comando
Fase 5  → Datos reales (proyectos)
Fase 6  → fastfetch
Fase 7  → Modo GUI
Fase 8  → Comando stack con barras
Fase 9  → Deploy y producción
Fase 10 → Reflexión académica
```

Cuando termines una fase, actualiza los checkboxes en `README.md` antes de continuar.

---

## 2. Stack permitido y prohibido

| ✅ Permitido                          | ❌ Prohibido                              |
|--------------------------------------|------------------------------------------|
| `@xterm/xterm`                       | React / Vue / Svelte / Angular           |
| `vite` (bundler)                     | webpack / esbuild standalone             |
| `typescript`                         | JavaScript puro (`.js`) en `src/`       |
| `eslint` + `typescript-eslint`       | Prettier (ya está cubierto por ESLint)   |
| CSS puro en `src/styles/`            | Tailwind / CSS-in-JS / styled-components |
| `bun test` (test runner nativo)      | Jest / Vitest / Mocha                    |
| Librerías en `bun.lock` existentes   | Cualquier dep nueva sin aprobación       |

Para agregar una dependencia nueva: comentarla primero como `// PROPUESTA: <nombre> — <razón>` en el archivo relevante y esperar aprobación del humano.

---

## 3. Arquitectura que no se puede modificar sin aprobación

- `src/commands/index.ts` — tipos `OutputLine`, `Command`, `CommandRegistry`. Si necesitás cambiar un tipo, propone el cambio explicando el impacto en los tests.
- `src/shell/parser.ts` — `parseInput` debe seguir exportando `ParsedInput` con la misma firma.
- `src/shell/terminal.ts` — bootstrap de xterm. **Nunca importes este archivo en tests.**
- `src/shell.ts` — barrel de re-exports. No agregar lógica aquí.
- `src/data/projects.ts` y `src/data/stack.ts` — los tipos `Project` y `StackItem` son el contrato entre datos y comandos.
- `.github/workflows/ci.yml` — no toques los jobs de CI sin razón explícita.

---

## 4. Flujo de trabajo obligatorio tras cada cambio

Después de **cualquier modificación** a archivos en `src/`, ejecuta en este orden:

```bash
# 1. Lint — cero warnings en CI
bun run lint:ci

# 2. Tests — todos deben pasar (o estar documentados como "expected fail" con skip)
bun test

# 3. Build — debe compilar sin errores
bun run build
```

Si alguno falla, no hagas commit. Arregla primero.

---

## 5. Tests por fase — qué verificar en cada una

### Fase 1 — Setup ✅
```bash
bun test                          # El archivo de tests existe y corre sin errores de import
bun run lint:ci                   # ESLint no reporta errores
bun run build                     # Vite compila sin errores
```
**Criterio de completitud:** los 22 tests corren (la mayoría en rojo está bien — son TDD).

---

### Fase 2 — Layout Hyprland
Archivos a modificar: `src/styles/global.css`, `src/styles/terminal.css`, `src/main.ts`

```bash
bun run build                     # Sin errores de compilación
# Visual checklist (manual en el browser):
# [ ] status-bar visible con hora actualizada cada segundo
# [ ] ventana de terminal con glassmorphism (blur visible)
# [ ] wallpaper de fondo en public/wallpaper.png o gradiente
# [ ] layout responsivo: no hay scroll horizontal en 375px de ancho
```

No hay tests automáticos para CSS. El criterio es visual + que el build no rompa.

---

### Fase 3 — Sistema de comandos
Archivos a modificar: `src/shell.ts`, `src/commands/index.ts`

```bash
bun test src/__tests__/commands.test.ts    # Sección "shell parser" debe pasar completa
bun run lint:ci
bun run build
```

**Tests que deben estar en verde al terminar esta fase:**
```
shell parser > splits input into command and args correctly   ✅
shell parser > handles extra whitespace between args          ✅
```

El shell loop (historial con ↑/↓ y Tab) no tiene test automático — verificarlo manualmente en el browser.

---

### Fase 4 — Comandos
Un comando se considera "implementado" cuando **todos sus tests pasan**.
Implementar en este orden recomendado (de menos a más complejo):

#### `clear`
```bash
bun test --test-name-pattern "clear"
# Debe pasar: "returns an empty array"
```

#### `help`
```bash
bun test --test-name-pattern "help"
# Debe pasar:
# - "returns at least one OutputLine per registered command"
# - "mentions every core command by name"
# - "ignores extra arguments gracefully"
```

#### `whoami`
```bash
bun test --test-name-pattern "whoami"
# Debe pasar:
# - "returns valid OutputLines"
# - "output contains a name"
# - "output contains at least one link (github or linkedin)"
```

#### `contact`
```bash
bun test --test-name-pattern "contact"
# Debe pasar:
# - "returns valid OutputLines"
# - "output contains at least one contact method"
```

#### `hobbies`
```bash
bun test --test-name-pattern "hobbies"
# Debe pasar:
# - "returns valid OutputLines"
# - "mentions all four hobbies"
#   (música, tenis, basket, videogames — todos en el output)
```

#### `ls`
```bash
bun test --test-name-pattern "ls"
# Debe pasar:
# - "returns valid OutputLines"
# - "lists at least one project"        ← requiere datos en Fase 5
# - "each project line ends with /"
```
> ⚠️ Los tests de `ls` que requieren proyectos pueden quedar en rojo hasta la Fase 5. Documentarlo con `it.skip` temporalmente si hace falta.

#### `cd`
```bash
bun test --test-name-pattern "^cd"
# Debe pasar:
# - "returns an error line for an unknown project"
# - "cd .. returns a line indicating we are back at root"
# - "cd with no args returns usage hint"
# - "returns valid OutputLines for a known project"  ← depende de Fase 5
```

#### `open --gui`
```bash
bun test --test-name-pattern "open"
# Debe pasar:
# - "returns valid OutputLines"
# - "returns an error/hint if called without --gui flag"
```
> La activación real del GUI es Fase 7. Aquí solo el comando retorna líneas válidas.

#### Después de todos los comandos básicos:
```bash
bun test                 # Todos los tests menos los de Fase 5/6/7/8 en verde
bun run lint:ci
bun run build
```

---

### Fase 5 — Proyectos (contenido)
Archivos a modificar: `src/data/projects.ts`, `src/data/stack.ts`

```bash
bun test --test-name-pattern "ls"
# Ahora sí debe pasar "lists at least one project"

bun test --test-name-pattern "^cd"
# Ahora sí debe pasar "returns valid OutputLines for a known project"

bun test                 # Suite completa — objetivo: todo verde excepto stack y fastfetch
bun run lint:ci
bun run build
```

**Criterio de datos mínimos:**
- Al menos 1 proyecto en `projects` con: `name`, `description`, `stack[]`, `repo`, `screenshots[]`
- Al menos 5 items en `stack` con categorías distintas

---

### Fase 6 — `fastfetch`
Archivo a modificar: `src/commands/fastfetch.ts`

```bash
bun test --test-name-pattern "fastfetch"
# Debe pasar:
# - "returns valid OutputLines"
# - "output has at least 8 lines (ascii art + stats)"
# - "output contains OS and WM fields"
# - "output contains an uptime-like field"

bun test
bun run lint:ci
bun run build
```

---

### Fase 7 — Modo GUI
Archivos a modificar: `src/gui/index.ts`, `src/gui/gui.css`, `src/commands/gui.ts`

```bash
bun test --test-name-pattern "open"
# Debe pasar:
# - "returns valid OutputLines"
# - "returns an error/hint if called without --gui flag"

bun test
bun run lint:ci
bun run build
# Visual: abrir browser, escribir "open --gui", verificar que aparece el overlay
```

---

### Fase 8 — Comando `stack` con barras
Archivo a modificar: `src/commands/stack.ts`

```bash
bun test --test-name-pattern "^stack"
# Debe pasar:
# - "returns valid OutputLines"
# - "output contains percentage values (0-100)"
# - "output contains at least 5 technologies"
# - "output contains category headers"

bun test                 # Suite completa — objetivo: 22/22 en verde
bun run lint:ci
bun run build
```

**Criterio de completitud de la suite TDD:** `22 pass, 0 fail`.

---

### Fase 9 — Deploy
```bash
bun run build            # Debe generar dist/ sin errores ni warnings
# Subir a Vercel/Netlify/GitHub Pages
# Correr Lighthouse en la URL pública:
# [ ] Performance >= 90
# [ ] Accessibility >= 90
# [ ] Best Practices >= 90
```

---

### Fase 10 — Reflexión
No hay tests automáticos. Checklist manual:
- [ ] Reflexión escrita en `README.md` (sección ya preparada)
- [ ] URL del deploy en el README
- [ ] Todos los checkboxes del roadmap marcados

---

## 6. Convenciones de código

### TypeScript
- Siempre tipado explícito en funciones exportadas.
- Nunca usar `any` — si aparece, ESLint lo marcará como warning; justificar en comentario.
- Usar `type` en vez de `interface` para los tipos del proyecto (consistencia con `index.ts`).

### Archivos de comandos
- Un archivo por comando en `src/commands/`.
- Cada archivo exporta exactamente **una función** con nombre `cmd<Nombre>`.
- La función siempre recibe `(args: string[])` y retorna `OutputLine[]`.
- Nunca hacer side effects (DOM, fetch, timers) dentro de un comando — eso va en `shell.ts` o `gui/`.

### CSS
- Variables de color en `:root` en `global.css`.
- No hardcodear colores hex fuera de `global.css` y `terminal.css`.
- Clases en `kebab-case`.

### Commits
```
feat(fase-N): descripción breve
fix(comando): descripción
test: descripción
style: descripción
docs: descripción
```

---

## 7. Lo que NO está permitido hacer sin consultar al humano

- Cambiar el test runner (bun test → cualquier otro).
- Agregar un framework de UI.
- Modificar `tsconfig.json` de forma que rompa los path aliases `@/*`.
- Cambiar la estructura de `OutputLine` — rompe todos los tests.
- Tocar `bun.lock` manualmente.
- Hacer commit directamente a `main` sin pasar CI.
- Reescribir `src/__tests__/commands.test.ts` para que los tests pasen sin implementar la lógica real.

---

## 8. Si un test falla y no sabes por qué

1. Corré `bun test --reporter=verbose` para ver el output completo.
2. Revisá que el archivo del comando exporte la función con el nombre exacto (`cmdCd`, `cmdHelp`, etc.).
3. Revisá que el tipo de retorno sea `OutputLine[]` y no `string[]`.
4. Revisá que los path aliases `@/commands/...` estén resolviendo (si no, revisá `tsconfig.json` y `vite.config.ts`).
5. Si el problema persiste, reportalo al humano con el output completo del error antes de modificar los tests.

**Nunca modifiques los tests para que pasen artificialmente. Los tests son el contrato, no el obstáculo.**