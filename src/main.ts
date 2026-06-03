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
import type { Project } from "@/data/projects";
import { stack as globalStack } from "@/data/stack";
import { getTechIconSvg } from "@/data/tech-icons";
import { pickRandomWallpaper } from "@/wallpapers";

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

// Workspaces: 6 dots, workspace 1 activo, 2 y 3 usados (marcados)
const workspaceDots = Array.from({ length: 6 }, (_, i) => {
  const cls =
    i === 0 ? "ws-dot active" :
    i <= 2  ? "ws-dot used"   :
              "ws-dot";
  return `<span class="${cls}"></span>`;
}).join("");

app.innerHTML = `
  <main class="app-shell">
    <section class="frame" aria-label="Hypr-folio terminal">

      <header class="status-bar" role="banner">
        <div class="status-left">
          <span class="status-logo" aria-hidden="true"></span>
          <span class="status-title">HYPR-FOLIO</span>
          <span class="status-sub">Marcelo Detlefsen — Full Stack Developer</span>
        </div>

        <nav class="status-workspaces" aria-label="Workspaces">
          ${workspaceDots}
        </nav>

        <div class="status-right">
          <time id="date" aria-live="off"></time>
          <time id="clock" aria-live="polite"></time>
        </div>
      </header>

      <div class="terminal-card" id="terminal-wrapper" role="main">
        <div class="terminal-titlebar" aria-hidden="true">
          <span class="titlebar-icon"></span>
          <span class="titlebar-label">marcelo@hypr-folio — zsh</span>
        </div>
        <div class="terminal-body">
          <div id="terminal"></div>
          <section class="tech-panel" id="tech-panel" aria-live="polite"></section>
          <section class="project-gallery" id="project-gallery" hidden aria-live="polite">
            <div class="project-gallery-grid" id="project-gallery-grid"></div>
          </section>
        </div>
      </div>

    </section>
  </main>
`;

const appShell = app.querySelector<HTMLElement>(".app-shell");
if (appShell !== null) {
  const wallpaper = pickRandomWallpaper();
  appShell.style.setProperty("--wallpaper-image", wallpaper === "" ? "none" : `url("${wallpaper}")`);
}

// Reloj + fecha
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

const galleryRoot = document.querySelector<HTMLElement>("#project-gallery");
const galleryGrid = document.querySelector<HTMLElement>("#project-gallery-grid");
const techPanel = document.querySelector<HTMLElement>("#tech-panel");

const terminal = bootTerminal({ host: terminalHost, registry, onProjectChange: renderGallery });

function createTechChip(name: string, percentage?: number): HTMLElement {
  const chip = document.createElement("article");
  chip.className = "tech-chip";

  const icon = document.createElement("span");
  icon.className = "tech-chip-icon";
  const svg = getTechIconSvg(name);
  if (svg !== null) {
    icon.innerHTML = svg;
  } else {
    icon.classList.add("tech-chip-icon--fallback");
    icon.textContent = name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const label = document.createElement("span");
  label.className = "tech-chip-label";
  label.textContent = name;

  chip.append(icon, label);

  if (typeof percentage === "number") {
    const badge = document.createElement("span");
    badge.className = "tech-chip-percent";
    badge.textContent = `${percentage}%`;
    chip.append(badge);
  }

  return chip;
}

function createTechGroup(title: string, subtitle: string, chips: HTMLElement[]): HTMLElement {
  const group = document.createElement("section");
  group.className = "tech-group";

  const header = document.createElement("header");
  header.className = "tech-group-header";

  const titleEl = document.createElement("span");
  titleEl.className = "tech-group-title";
  titleEl.textContent = title;

  const subtitleEl = document.createElement("span");
  subtitleEl.className = "tech-group-subtitle";
  subtitleEl.textContent = subtitle;

  header.append(titleEl, subtitleEl);

  const row = document.createElement("div");
  row.className = "tech-chip-row";
  row.append(...chips);

  group.append(header, row);
  return group;
}

function renderTechPanel(project: Project | null): void {
  if (techPanel === null) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "tech-panel-inner";

  const header = document.createElement("header");
  header.className = "tech-panel-header";

  const title = document.createElement("span");
  title.className = "tech-panel-title";
  title.textContent = project === null ? "Stack técnico" : "Stack del proyecto";

  const subtitle = document.createElement("span");
  subtitle.className = "tech-panel-subtitle";
  subtitle.textContent =
    project === null
      ? "Logos reales de las tecnologías principales"
      : "Tecnologías usadas en este proyecto";

  header.append(title, subtitle);
  wrapper.append(header);

  if (project === null) {
    const grouped = globalStack.reduce<Record<string, HTMLElement[]>>((acc, item) => {
      const chips = acc[item.category] ?? [];
      chips.push(createTechChip(item.name, item.percentage));
      acc[item.category] = chips;
      return acc;
    }, {});

    for (const [category, chips] of Object.entries(grouped)) {
      wrapper.append(
        createTechGroup(category, "Resumen", chips),
      );
    }
  } else {
    const chips = project.stack.map((tech) => createTechChip(tech));
    wrapper.append(
      createTechGroup(project.title, "Tecnologías del proyecto", chips),
    );
  }

  techPanel.replaceChildren(wrapper);
}

function renderGallery(project: Project | null): void {
  if (galleryRoot === null || galleryGrid === null) {
    renderTechPanel(project);
    return;
  }

  if (project === null) {
    galleryRoot.hidden = true;
    galleryGrid.replaceChildren();
    renderTechPanel(null);
    return;
  }

  galleryRoot.hidden = false;
  renderTechPanel(project);
  galleryGrid.replaceChildren(
    ...project.screenshots.map((screenshot, index) => {
      const src = `/${screenshot.replace(/^public\//, "")}`;
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${project.title} screenshot ${index + 1}`;
      img.loading = "lazy";
      img.draggable = false;
      img.setAttribute("role", "button");
      img.tabIndex = 0;
      img.setAttribute("aria-label", `Ver captura ${index + 1} de ${project.title}`);
      img.addEventListener("click", () => {
        void terminal.showScreenshot(src, img.alt);
      });
      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void terminal.showScreenshot(src, img.alt);
        }
      });
      return img;
    }),
  );
}

renderGallery(null);
