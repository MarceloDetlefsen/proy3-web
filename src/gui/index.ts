import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { events } from "@/data/events";
import { getTechIconSvg } from "@/data/tech-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type GuiSection = "projects" | "stack" | "events" | "contact";

type UnmountFn = () => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS: { id: GuiSection; label: string; icon: string }[] = [
  { id: "projects", label: "Proyectos", icon: "⬡" },
  { id: "stack",    label: "Stack",     icon: "◈" },
  { id: "events",   label: "Events",    icon: "◎" },
  { id: "contact",  label: "Contacto",  icon: "◇" },
];

// SVG icons for GitHub and LinkedIn
const GITHUB_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

const LINKEDIN_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

const EMAIL_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`;

const LOCATION_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

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

    // Screenshot thumbnail
    if (project.screenshots.length > 0) {
      const thumb = el("div", "gui-card__thumb");
      const img = document.createElement("img");
      img.src = `/${project.screenshots[0].replace(/^public\//, "")}`;
      img.alt = `${project.name} screenshot`;
      img.loading = "lazy";
      img.draggable = false;
      thumb.appendChild(img);
      card.appendChild(thumb);
    }

    const header = el("div", "gui-card__header");
    const name   = el("h3",  "gui-card__title", `cd/${project.name}`);
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

      // Icon
      const iconWrap = el("span", "gui-chip__icon");
      const svgStr = getTechIconSvg(item.name);
      if (svgStr !== null) {
        iconWrap.innerHTML = svgStr;
        const svgEl = iconWrap.querySelector("svg");
        if (svgEl !== null) {
          svgEl.setAttribute("width", "14");
          svgEl.setAttribute("height", "14");
          svgEl.style.fill = "currentColor";
          svgEl.style.display = "block";
          svgEl.style.flexShrink = "0";
        }
      } else {
        // Fallback: initials
        iconWrap.textContent = item.name.slice(0, 2).toUpperCase();
        iconWrap.classList.add("gui-chip__icon--fallback");
      }

      const name = el("span", "gui-chip__name", item.name);
      const pct  = el("span", "gui-chip__pct",  `${item.percentage}%`);
      const bar  = el("div",  "gui-chip__bar");
      const fill = el("div",  "gui-chip__fill");
      fill.style.setProperty("--pct", `${item.percentage}%`);
      bar.appendChild(fill);
      chip.appendChild(iconWrap);
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

function renderEvents(): HTMLElement {
  const grid = el("div", "gui-events-grid");

  for (const event of events) {
    const card = el("article", "gui-event-card");

    if (event.image !== undefined) {
      const imgWrap = el("div", "gui-event-card__img-wrap");
      const img = document.createElement("img");
      img.src = `/${event.image.replace(/^public\//, "")}`;
      img.alt = event.title;
      img.loading = "lazy";
      img.draggable = false;
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);
    } else {
      const placeholder = el("div", "gui-event-card__img-wrap gui-event-card__img-wrap--placeholder");
      card.appendChild(placeholder);
    }

    const body = el("div", "gui-event-card__body");
    const title = el("h3", "gui-event-card__title", event.title);
    const desc = el("p", "gui-event-card__desc", event.description);
    body.appendChild(title);
    body.appendChild(desc);
    card.appendChild(body);
    grid.appendChild(card);
  }

  return grid;
}

function renderContact(): HTMLElement {
  const wrapper = el("div", "gui-contact-wrapper");

  // Profile photo
  const photoWrap = el("div", "gui-contact-photo-wrap");
  const photo = document.createElement("img");
  photo.src = "/personal/me.jpg";
  photo.alt = "Marcelo Detlefsen";
  photo.className = "gui-contact-photo";
  photo.loading = "lazy";
  photoWrap.appendChild(photo);
  wrapper.appendChild(photoWrap);

  const items = [
    {
      label: "Email",
      value: "marcelodetlefsen@gmail.com",
      href: "mailto:marcelodetlefsen@gmail.com",
      iconSvg: EMAIL_SVG,
    },
    {
      label: "GitHub",
      value: "github.com/MarceloDetlefsen",
      href: "https://github.com/MarceloDetlefsen",
      iconSvg: GITHUB_SVG,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/marcelo-detlefsen-2b170337b",
      href: "https://www.linkedin.com/in/marcelo-detlefsen-2b170337b/",
      iconSvg: LINKEDIN_SVG,
    },
    {
      label: "Ciudad",
      value: "Ciudad de Guatemala, Guatemala",
      href: null,
      iconSvg: LOCATION_SVG,
    },
  ];

  for (const item of items) {
    const row = el("div", "gui-contact-row");
    const iconEl  = el("span", "gui-contact-icon");
    iconEl.innerHTML = item.iconSvg;
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
  root.querySelectorAll<HTMLElement>(".gui-nav-pill").forEach((pill) => {
    pill.classList.toggle("gui-nav-pill--active", pill.dataset["section"] === sectionId);
  });

  const contentArea = root.querySelector<HTMLElement>(".gui-content");
  if (contentArea === null) return;

  contentArea.classList.add("gui-content--out");
  window.setTimeout(() => {
    contentArea.replaceChildren();
    switch (sectionId) {
      case "projects": contentArea.appendChild(renderProjects()); break;
      case "stack":    contentArea.appendChild(renderStack());    break;
      case "events":   contentArea.appendChild(renderEvents());   break;
      case "contact":  contentArea.appendChild(renderContact());  break;
    }
    contentArea.classList.remove("gui-content--out");
    contentArea.classList.add("gui-content--in");
    window.setTimeout(() => contentArea.classList.remove("gui-content--in"), 250);

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
  const overlay = el("div", "gui-overlay");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Modo visual del portafolio");

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

  const nav = el("nav", "gui-nav", "");
  nav.setAttribute("aria-label", "Secciones del portafolio");
  for (const section of SECTIONS) {
    const pill = el("button", "gui-nav-pill", `<span class="gui-nav-pill__icon">${section.icon}</span><span>${section.label}</span>`);
    pill.setAttribute("type", "button");
    pill.dataset["section"] = section.id;
    pill.setAttribute("aria-label", section.label);
    nav.appendChild(pill);
  }

  const contentArea = el("div", "gui-content");

  overlay.appendChild(header);
  overlay.appendChild(nav);
  overlay.appendChild(contentArea);
  host.appendChild(overlay);

  activateSection(overlay, "projects");

  const onNavClick = (e: MouseEvent) => {
    const pill = (e.target as HTMLElement).closest<HTMLElement>(".gui-nav-pill");
    if (pill?.dataset["section"]) {
      activateSection(overlay, pill.dataset["section"] as GuiSection);
    }
  };
  nav.addEventListener("click", onNavClick);

  const unmount = () => {
    overlay.classList.add("gui-overlay--exit");
    window.setTimeout(() => {
      overlay.remove();
    }, 300);
  };

  closeBtn.addEventListener("click", unmount);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      unmount();
    }
  };
  document.addEventListener("keydown", onKeydown);

  window.requestAnimationFrame(() => {
    overlay.classList.add("gui-overlay--enter");
  });

  return () => {
    document.removeEventListener("keydown", onKeydown);
    unmount();
  };
}