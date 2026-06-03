import { projects } from "@/data/projects";
import { stack } from "@/data/stack";

// ─── Types ────────────────────────────────────────────────────────────────────

type GuiSection = "projects" | "stack" | "hobbies" | "contact";

type UnmountFn = () => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS: { id: GuiSection; label: string; icon: string }[] = [
  { id: "projects", label: "Proyectos", icon: "⬡" },
  { id: "stack",    label: "Stack",     icon: "◈" },
  { id: "hobbies",  label: "Hobbies",   icon: "◎" },
  { id: "contact",  label: "Contacto",  icon: "◇" },
];

// ─── Render helpers ───────────────────────────────────────────────────────────

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  inner?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (inner !== undefined) node.innerHTML = inner;
  return node;
}

function renderProjects(): HTMLElement {
  const grid = el("div", "gui-grid");

  for (const project of projects) {
    const card = el("article", "gui-card gui-card--project");

    const header = el("div", "gui-card__header");
    const name   = el("h3",  "gui-card__title", project.name + "/");
    const desc   = el("p",   "gui-card__desc",  project.description);

    header.appendChild(name);
    header.appendChild(desc);

    const stackRow = el("div", "gui-card__tags");
    for (const tech of project.stack.slice(0, 4)) {
      const tag = el("span", "gui-tag", tech);
      stackRow.appendChild(tag);
    }
    if (project.stack.length > 4) {
      stackRow.appendChild(el("span", "gui-tag gui-tag--more", `+${project.stack.length - 4}`));
    }

    const footer = el("div", "gui-card__footer");
    if (project.deploy) {
      const link = el("a", "gui-card__link", "Deploy ↗");
      (link as HTMLAnchorElement).href   = project.deploy;
      (link as HTMLAnchorElement).target = "_blank";
      (link as HTMLAnchorElement).rel    = "noopener noreferrer";
      footer.appendChild(link);
    }
    if (project.repos[0]) {
      const repo = el("a", "gui-card__link gui-card__link--dim", "Repo ↗");
      (repo as HTMLAnchorElement).href   = project.repos[0];
      (repo as HTMLAnchorElement).target = "_blank";
      (repo as HTMLAnchorElement).rel    = "noopener noreferrer";
      footer.appendChild(repo);
    }

    card.appendChild(header);
    card.appendChild(stackRow);
    if (footer.children.length > 0) card.appendChild(footer);
    grid.appendChild(card);
  }

  return grid;
}

function renderStack(): HTMLElement {
  const container = el("div", "gui-stack-container");

  const grouped = stack.reduce<Record<string, typeof stack>>((acc, item) => {
    const cat = acc[item.category] ?? [];
    cat.push(item);
    acc[item.category] = cat;
    return acc;
  }, {});

  for (const [category, items] of Object.entries(grouped)) {
    const section = el("div", "gui-stack-section");
    const heading = el("h3", "gui-stack-heading", category);
    section.appendChild(heading);

    const chips = el("div", "gui-stack-chips");
    for (const item of items) {
      const chip = el("div", "gui-chip");
      const name = el("span", "gui-chip__name", item.name);
      const pct  = el("span", "gui-chip__pct",  `${item.percentage}%`);
      const bar  = el("div",  "gui-chip__bar");
      const fill = el("div",  "gui-chip__fill");
      fill.style.setProperty("--pct", `${item.percentage}%`);
      bar.appendChild(fill);
      chip.appendChild(name);
      chip.appendChild(pct);
      chip.appendChild(bar);
      chips.appendChild(chip);
    }
    section.appendChild(chips);
    container.appendChild(section);
  }

  return container;
}

function renderHobbies(): HTMLElement {
  const grid = el("div", "gui-hobbies-grid");

  const hobbies = [
    {
      icon: "♪",
      title: "Música",
      color: "var(--gui-accent-magenta)",
      lines: [
        "Siempre en formato de álbum completo — nunca shuffle.",
        "Los fondos de esta terminal son portadas de álbumes favoritos.",
        "",
        "Hip Hop · Shoegaze · Rock · Metal · Art Pop",
      ],
    },
    {
      icon: "◎",
      title: "Tenis",
      color: "var(--gui-accent-green)",
      lines: [
        "Practico desde los 12 años.",
        "Llegué a ser top 5 juvenil a nivel nacional en Guatemala.",
        "",
        "Jugador favorito: Dominic Thiem",
      ],
    },
    {
      icon: "◈",
      title: "Basket",
      color: "var(--gui-accent-orange)",
      lines: [
        "Phoenix Suns, siempre.",
        "Fan de la historia y estadísticas de la NBA.",
      ],
    },
    {
      icon: "▸",
      title: "Videojuegos",
      color: "var(--gui-accent-cyan)",
      lines: [
        "Nintendero de corazón.",
        "Sagas favoritas: Xenoblade Chronicles · Zelda · Pikmin",
        "",
        "Indie: Celeste · Hollow Knight: Silksong · Dead Cells",
      ],
    },
  ];

  for (const hobby of hobbies) {
    const card = el("article", "gui-hobby-card");
    card.style.setProperty("--hobby-color", hobby.color);

    const iconEl   = el("div", "gui-hobby-icon", hobby.icon);
    const titleEl  = el("h3",  "gui-hobby-title", hobby.title);
    const bodyEl   = el("div", "gui-hobby-body");

    for (const line of hobby.lines) {
      if (line === "") {
        bodyEl.appendChild(el("br"));
      } else {
        const p = el("p", "gui-hobby-line", line);
        bodyEl.appendChild(p);
      }
    }

    card.appendChild(iconEl);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    grid.appendChild(card);
  }

  return grid;
}

function renderContact(): HTMLElement {
  const wrapper = el("div", "gui-contact-wrapper");

  const items = [
    { label: "Email",    value: "marcelodetlefsen@gmail.com",                                    href: "mailto:marcelodetlefsen@gmail.com",                           icon: "✉" },
    { label: "GitHub",   value: "github.com/MarceloDetlefsen",                                   href: "https://github.com/MarceloDetlefsen",                         icon: "⌥" },
    { label: "LinkedIn", value: "linkedin.com/in/marcelo-detlefsen-2b170337b",                   href: "https://www.linkedin.com/in/marcelo-detlefsen-2b170337b/",    icon: "◩" },
    { label: "Ciudad",   value: "Ciudad de Guatemala, Guatemala",                                 href: null,                                                          icon: "◬" },
  ];

  for (const item of items) {
    const row = el("div", "gui-contact-row");
    const iconEl  = el("span", "gui-contact-icon", item.icon);
    const labelEl = el("span", "gui-contact-label", item.label);
    const valueEl = item.href
      ? el("a", "gui-contact-value gui-contact-value--link", item.value)
      : el("span", "gui-contact-value", item.value);

    if (item.href && valueEl instanceof HTMLAnchorElement) {
      valueEl.href   = item.href;
      valueEl.target = "_blank";
      valueEl.rel    = "noopener noreferrer";
    }

    row.appendChild(iconEl);
    row.appendChild(labelEl);
    row.appendChild(valueEl);
    wrapper.appendChild(row);
  }

  const note = el("p", "gui-contact-note",
    "Disponible para proyectos full stack, prácticas y colaboraciones técnicas."
  );
  wrapper.appendChild(note);

  return wrapper;
}

// ─── Tab switching ────────────────────────────────────────────────────────────

function activateSection(
  root: HTMLElement,
  sectionId: GuiSection
): void {
  // Update nav pills
  root.querySelectorAll<HTMLElement>(".gui-nav-pill").forEach((pill) => {
    pill.classList.toggle("gui-nav-pill--active", pill.dataset["section"] === sectionId);
  });

  // Swap content
  const contentArea = root.querySelector<HTMLElement>(".gui-content");
  if (contentArea === null) return;

  // Fade out → swap → fade in
  contentArea.classList.add("gui-content--out");
  window.setTimeout(() => {
    contentArea.replaceChildren();
    switch (sectionId) {
      case "projects": contentArea.appendChild(renderProjects()); break;
      case "stack":    contentArea.appendChild(renderStack());    break;
      case "hobbies":  contentArea.appendChild(renderHobbies());  break;
      case "contact":  contentArea.appendChild(renderContact());   break;
    }
    contentArea.classList.remove("gui-content--out");
    contentArea.classList.add("gui-content--in");
    window.setTimeout(() => contentArea.classList.remove("gui-content--in"), 250);

    // Trigger bar animations after content is in DOM
    if (sectionId === "stack") {
      window.requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>(".gui-chip__fill").forEach((fill) => {
          fill.classList.add("gui-chip__fill--animate");
        });
      });
    }
  }, 150);
}

// ─── Main mount ───────────────────────────────────────────────────────────────

export function mountGui(host: HTMLElement): UnmountFn {
  // Build overlay structure
  const overlay = el("div", "gui-overlay");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Modo visual del portafolio");

  // Header
  const header = el("header", "gui-header");
  const titleGroup = el("div", "gui-header__title-group");
  const mainTitle  = el("span", "gui-header__title", "HYPR-FOLIO");
  const subtitle   = el("span", "gui-header__sub",   "Marcelo Detlefsen — Full Stack Developer");
  titleGroup.appendChild(mainTitle);
  titleGroup.appendChild(subtitle);

  const closeBtn = el("button", "gui-close-btn", "×");
  closeBtn.setAttribute("aria-label", "Volver a la terminal");
  closeBtn.setAttribute("type", "button");

  header.appendChild(titleGroup);
  header.appendChild(closeBtn);

  // Nav pills
  const nav = el("nav", "gui-nav", "");
  nav.setAttribute("aria-label", "Secciones del portafolio");
  for (const section of SECTIONS) {
    const pill = el("button", "gui-nav-pill", `<span class="gui-nav-pill__icon">${section.icon}</span><span>${section.label}</span>`);
    pill.setAttribute("type", "button");
    pill.dataset["section"] = section.id;
    pill.setAttribute("aria-label", section.label);
    nav.appendChild(pill);
  }

  // Content area
  const contentArea = el("div", "gui-content");

  // Assemble
  overlay.appendChild(header);
  overlay.appendChild(nav);
  overlay.appendChild(contentArea);
  host.appendChild(overlay);

  // Initial render
  activateSection(overlay, "projects");

  // Event delegation — nav pills
  const onNavClick = (e: MouseEvent) => {
    const pill = (e.target as HTMLElement).closest<HTMLElement>(".gui-nav-pill");
    if (pill?.dataset["section"]) {
      activateSection(overlay, pill.dataset["section"] as GuiSection);
    }
  };
  nav.addEventListener("click", onNavClick);

  // Close button
  const unmount = () => {
    overlay.classList.add("gui-overlay--exit");
    window.setTimeout(() => {
      overlay.remove();
    }, 300);
  };

  closeBtn.addEventListener("click", unmount);

  // Esc key
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      unmount();
    }
  };
  document.addEventListener("keydown", onKeydown);

  // Entry animation
  window.requestAnimationFrame(() => {
    overlay.classList.add("gui-overlay--enter");
  });

  // Return unmount so terminal.ts can call it programmatically
  return () => {
    document.removeEventListener("keydown", onKeydown);
    unmount();
  };
}