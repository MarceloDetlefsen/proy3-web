export type EventCard = {
  title: string;
  description: string;
  images: string[];
  imagePositions?: string[];
};

export const events: EventCard[] = [
  {
    title: "Hackathon CampusConnect UVG",
    description: "Hackathon organizada por la AECCTI en la Universidad del Valle de Guatemala. En equipos de cuatro personas desarrollamos prototipos de plataformas web para asociaciones estudiantiles utilizando WordPress, conectando la innovación tecnológica con el impacto en la comunidad universitaria. Obtuvimos el segundo lugar.",
    images: ["public/gallery/campusconnect-uvg-1.webp", "public/gallery/campusconnect-uvg-2.webp", "public/gallery/campusconnect-uvg-3.webp", "public/gallery/campusconnect-uvg-4.webp"],
  },
  {
    title: "ICPC 2026",
    description: "Competencia universitaria de programación competitiva en la que clasificamos a la fase final de ICPC Guatemala y al Gran Premio de Centroamérica. La fase final aún no se ha disputado.",
    images: ["public/gallery/icpc_2026.webp", "public/gallery/icpc-2026-finalist.webp", "public/gallery/icpc-2026-final-1.webp", "public/gallery/icpc-2026-final-2.webp"],
  },
  {
    title: "Cursor Hackathon 2026",
    description: "Hackaton organizada por the 502 Project, donde desarrollamos EcoScan y logramos ser uno de los 10 finalistas de la competencia.",
    images: ["public/gallery/cursor-hackaton-2026_1.webp", "public/gallery/cursor-hackaton-2026_2.webp"],
    imagePositions: ["center top", "center center"],
  },
  {
    title: "Jack's Cave - Blog Entry 1",
    description: "Artículo enfocado a describir como se pudo seguir explotando el códgo de Tetris para llevarlo a un final real, conseguido a través de crashear el juego.",
    images: ["public/gallery/blog_1.webp"],
  },
  {
    title: "Jack's Cave - Blog Entry 2",
    description: "Tutorial básico acerca de como desarrollar un bot de ajedrez con quien prácticar, y codificarlo como un buen proyecto personal.",
    images: ["public/gallery/blog_2.webp"],
  },
  {
    title: "Jack's Cave - Blog Entry 3",
    description: "Se habla acerca de un paper de maneras en las que se puede empezar a testear videojuegos de manera automatizada, especialmente para juegos del género metroidvania.",
    images: ["public/gallery/blog_3.webp"],
  },
];
