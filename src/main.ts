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
import { cmdEvents } from "@/commands/events";
import { cmdContact } from "@/commands/contact";
import { cmdGui } from "@/commands/gui";
import { cmdClear } from "@/commands/clear";
import type { Project } from "@/data/projects";
import { events as eventCards } from "@/data/events";
import { pickRandomWallpaper } from "@/wallpapers";

const registry: CommandRegistry = {
  help:      { description: "Lista todos los comandos",          run: cmdHelp },
  whoami:    { description: "Sobre mí",                          run: cmdWhoami },
  ls:        { description: "Lista proyectos",                   run: cmdLs },
  cd:        { description: "Entra a un proyecto (cd <name>)",   run: cmdCd },
  stack:     { description: "Stack técnico con porcentajes",     run: cmdStack },
  hobbies:   { description: "Mis hobbies",                       run: cmdHobbies },
  fastfetch: { description: "Info del sistema",                  run: cmdFastfetch },
  events:    { description: "Eventos y participaciones CS",     run: cmdEvents },
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
          <section class="project-gallery" id="project-gallery" hidden aria-live="polite">
            <div class="project-gallery-grid" id="project-gallery-grid"></div>
          </section>
          <section class="event-gallery" id="event-gallery" hidden aria-live="polite">
            <div class="event-gallery-grid" id="event-gallery-grid"></div>
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
const terminalElement = terminalHost;

const galleryRoot = document.querySelector<HTMLElement>("#project-gallery");
const galleryGrid = document.querySelector<HTMLElement>("#project-gallery-grid");
const eventGalleryRoot = document.querySelector<HTMLElement>("#event-gallery");
const eventGalleryGrid = document.querySelector<HTMLElement>("#event-gallery-grid");

type GalleryImage = {
  src: string;
  alt: string;
  ariaLabel: string;
  restoresProjectView: boolean;
};

type EventGalleryCard = {
  title: string;
  description: string;
  src?: string;
};

const terminal = bootTerminal({
  host: terminalElement,
  registry,
  onProjectChange: renderGallery,
  onEventsChange: renderEvents,
});

function renderImageGallery(images: GalleryImage[]): void {
  if (galleryRoot === null || galleryGrid === null) {
    return;
  }

  if (images.length === 0) {
    galleryRoot.hidden = true;
    galleryGrid.replaceChildren();
    return;
  }

  galleryRoot.hidden = false;
  galleryGrid.replaceChildren(
    ...images.map((image) => {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      img.loading = "lazy";
      img.draggable = false;
      img.setAttribute("role", "button");
      img.tabIndex = 0;
      img.setAttribute("aria-label", image.ariaLabel);
      img.addEventListener("click", () => {
        void terminal.showScreenshot(image.src, image.alt, image.restoresProjectView);
      });
      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void terminal.showScreenshot(image.src, image.alt, image.restoresProjectView);
        }
      });
      return img;
    }),
  );
}

function renderGallery(project: Project | null): void {
  renderEvents(false);

  if (project === null) {
    renderImageGallery([]);
    return;
  }

  renderImageGallery(
    project.screenshots.map((screenshot, index) => ({
      src: `/${screenshot.replace(/^public\//, "")}`,
      alt: `${project.title} screenshot ${index + 1}`,
      ariaLabel: `Ver captura ${index + 1} de ${project.title}`,
      restoresProjectView: true,
    })),
  );
}

function renderEventGallery(cards: EventGalleryCard[]): void {
  if (eventGalleryRoot === null || eventGalleryGrid === null) {
    return;
  }

  if (cards.length === 0) {
    eventGalleryRoot.hidden = true;
    eventGalleryGrid.replaceChildren();
    return;
  }

  eventGalleryRoot.hidden = false;
  eventGalleryGrid.replaceChildren(
    ...cards.map((card) => {
      const article = document.createElement("article");
      article.className = "event-card";

      if (card.src !== undefined) {
        const img = document.createElement("img");
        img.src = card.src;
        img.alt = card.title;
        img.loading = "lazy";
        img.draggable = false;
        img.className = "event-card-image";
        article.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "event-card-image event-card-image--placeholder";
        article.appendChild(placeholder);
      }

      const overlay = document.createElement("div");
      overlay.className = "event-card-overlay";

      const title = document.createElement("h3");
      title.className = "event-card-title";
      title.textContent = card.title;

      const description = document.createElement("p");
      description.className = "event-card-description";
      description.textContent = card.description;

      overlay.appendChild(title);
      overlay.appendChild(description);
      article.appendChild(overlay);
      return article;
    }),
  );
}

function renderEvents(active: boolean): void {
  if (!active) {
    renderEventGallery([]);
    return;
  }

  renderImageGallery([]);
  renderEventGallery(
    eventCards.map((eventCard) => ({
      title: eventCard.title,
      description: eventCard.description,
      src: eventCard.image === undefined ? undefined : `/${eventCard.image.replace(/^public\//, "")}`,
    })),
  );
}

renderGallery(null);
