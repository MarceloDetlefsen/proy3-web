import type { OutputLine } from "./index"

export function cmdHobbies(_args: string[]): OutputLine[] {
  return [
    // ── Música ───────────────────────────────────────────────────────────
    { text: "🎶  Música", bold: true, color: "cyan" },
    { text: "   Siempre escucho en formato de álbum completo, me parece la forma más pura de disfrutar de la música.", color: "dim" },
    { text: "   Los fondos de pantalla de esta terminal son portadas de algunos de mis álbumes favoritos.", color: "white" },
    { text: "" },
    { text: "   Géneros favoritos", bold: true, color: "yellow" },
    { text: "   Hip Hop  ·  Shoegaze  ·  Rock  ·  Metal  ·  Art Pop", color: "white" },
    { text: "" },

    // ── Tenis ────────────────────────────────────────────────────────────
    { text: "🎾  Tenis", bold: true, color: "cyan" },
    { text: "   Mi jugador favorito es Dominic Thiem.", color: "dim" },
    { text: "   Empecé a jugar a los 12 años y llegué a ser top 5 juvenil a nivel nacional en Guatemala.", color: "white" },
    { text: "" },

    // ── Basket ───────────────────────────────────────────────────────────
    { text: "🏀  Basket", bold: true, color: "cyan" },
    { text: "   Soy fanático de los Phoenix Suns.", color: "dim" },
    { text: "   Miro muchísimos partidos de basketball. Y se mucho de la historia y estadísticas de de la NBA.", color: "white" },
    { text: "" },

    // ── Videojuegos ──────────────────────────────────────────────────────
    { text: "🎮  Videojuegos", bold: true, color: "cyan" },
    { text: "   Nintendero de corazón. Las sagas que más me han marcado son Xenoblade Chronicles, Zelda y Pikmin.", color: "white" },
    { text: "" },
    { text: "   Indies favoritos", bold: true, color: "yellow" },
    { text: "   Celeste  ·  Hollow Knight: Silksong  ·  Dead Cells", color: "white" },
  ]
}