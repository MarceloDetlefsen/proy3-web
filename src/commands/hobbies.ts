import type { OutputLine } from "./index"

export function cmdHobbies(_args: string[]): OutputLine[] {
  return [
    { text: "Música: playlists largas y headphones siempre cerca." },
    { text: "Tenis: partido largo cuando toca despejar la cabeza." },
    { text: "Basket: ritmo alto y juego en equipo." },
    { text: "Videojuegos: desde indies hasta sesiones competitivas." },
  ]
}
