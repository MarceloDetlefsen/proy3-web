export type HobbyCard = {
  title: string
  description: string
  images: string[]
}

export const hobbyCards: HobbyCard[] = [
  {
    title: "Linux",
    description: "Mantengo mi propio rice y dotfiles. Después de probar varias distribuciones, me quedé con las basadas en Arch por su personalización; mis gestores favoritos son Hyprland y Niri.",
    images: ["public/gallery/hobby-linux.webp"],
  },
  {
    title: "Tenis",
    description: "Empecé a jugar a los 12 años y llegué a ser top 5 juvenil a nivel nacional en Guatemala.",
    images: ["public/gallery/hobby-tennis.webp"],
  },
  {
    title: "Música",
    description: "Me gusta escuchar álbumes completos; es mi forma favorita de disfrutar la música.",
    images: ["public/gallery/hobby-music-top-artists.webp"],
  },
  {
    title: "Videojuegos",
    description: "Las sagas que más me han marcado son Xenoblade Chronicles, Zelda y Pikmin. También disfruto mucho los indies.",
    images: ["public/gallery/hobby-gaming-xenoblade.webp", "public/gallery/hobby-gaming-celeste.webp"],
  },
  {
    title: "Basket",
    description: "Soy fanático de los Phoenix Suns y disfruto seguir la historia y las estadísticas de la NBA.",
    images: ["public/gallery/hobby-basket.webp"],
  },
]
