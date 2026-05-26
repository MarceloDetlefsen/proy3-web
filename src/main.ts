import "./style.css";
import { bootTerminal } from "./shell/terminal";
import type { CommandRegistry } from "@/commands/index";
import { cmdHelp } from "@/commands/help";
import { cmdWhoami } from "@/commands/whoami";
import { cmdLs } from "@/commands/ls";
import { cmdCd } from "@/commands/cd";
import { cmdStack } from "@/commands/stack";
import { cmdHobbies } from "@/commands/hobbies";
import { cmdFastfetch } from "@/commands/fastfetch";
import { cmdContact } from "@/commands/contact";
import { cmdGui } from "@/commands/gui";
import { cmdClear } from "@/commands/clear";

const registry: CommandRegistry = {
  help:      { description: "Lista todos los comandos",          run: cmdHelp },
  whoami:    { description: "Sobre mí",                          run: cmdWhoami },
  ls:        { description: "Lista proyectos",                   run: cmdLs },
  cd:        { description: "Entra a un proyecto (cd <name>)",   run: cmdCd },
  stack:     { description: "Stack técnico con porcentajes",     run: cmdStack },
  hobbies:   { description: "Mis hobbies",                       run: cmdHobbies },
  fastfetch: { description: "Info del sistema",                  run: cmdFastfetch },
  contact:   { description: "Contacto",                          run: cmdContact },
  open:      { description: "Modo GUI (open --gui)",             run: cmdGui },
  clear:     { description: "Limpia la terminal",                run: cmdClear },
};

const app = document.querySelector<HTMLDivElement>("#app");
if (app === null) throw new Error("No se encontró el contenedor #app.");

const clockFormatter = new Intl.DateTimeFormat("es-GT", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

// Workspaces — 5 dots, first one active (terminal workspace)
const workspaceDots = Array.from({ length: 5 }, (_, i) =>
  `<span class="ws-dot${i === 0 ? " active" : ""}"></span>`
).join("");

app.innerHTML = `
  <main class="app-shell">
    <section class="frame" aria-label="Hypr-folio terminal">

      <header class="status-bar" role="banner">
        <div class="status-left">
          <span class="status-logo" aria-hidden="true"></span>
          <span class="status-title">HYPR-FOLIO</span>
          <span class="status-sub">Marcelo Detlefsen - Full Stack Developer</span>
        </div>

        <nav class="status-workspaces" aria-label="Workspaces">
          ${workspaceDots}
        </nav>

        <div class="status-right">
          <time id="date" aria-live="off"></time>
          <time id="clock" aria-live="polite"></time>
        </div>
      </header>

      <div class="terminal-card" id="terminal" role="main"></div>

    </section>
  </main>
`;

// Clock + date updater
const clock = document.querySelector<HTMLElement>("#clock");
const dateEl = document.querySelector<HTMLElement>("#date");

if (clock !== null) {
  const renderClock = () => {
    clock.textContent = clockFormatter.format(new Date());
    if (dateEl !== null) {
      dateEl.textContent = dateFormatter.format(new Date());
    }
  };
  renderClock();
  window.setInterval(renderClock, 1000);
}

const terminalHost = document.querySelector<HTMLElement>("#terminal");
if (terminalHost === null) throw new Error("No se encontró el contenedor de la terminal.");

bootTerminal({ host: terminalHost, registry });