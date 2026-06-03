export type EventCard = {
  title: string;
  description: string;
  image?: string;
};

export const events: EventCard[] = [
  {
    title: "ICPC 2026",
    description: "Primera fecha de la competencia universitaria de programacion competitiva mas importante de la región. Donde se hace enfasis en el trabajo en equipo, la resolución de problemas algorítmicos y la eficiencia en la codificación.",
    image: "public/gallery/icpc_2026.jpg",
  },
  {
    title: "Cursor Hackathon 2026",
    description: "Hackaton organizada por the 502 Project, donde desarrollamos EcoScan y logramos ser uno de los 10 finalistas de la competencia.",
    image: "public/gallery/cursor-hackaton-2026_1.jpg",
  },
  {
    title: "Cursor Hackathon 2026",
    description: "Imágen del equipo completo que desarrllo EcoScan..",
    image: "public/gallery/cursor-hackaton-2026_2.jpg",
  },
  {
    title: "Jack's Cave - Blog Entry 1",
    description: "Artículo enfocado a describir como se pudo seguir explotando el códgo de Tetris para llevarlo a un final real, conseguido a través de crashear el juego.",
    image: "public/gallery/blog_1.jpg",
  },
  {
    title: "Jack's Cave - Blog Entry 2",
    description: "Tutorial básico acerca de como desarrollar un bot de ajedrez con quien prácticar, y codificarlo como un buen proyecto personal.",
    image: "public/gallery/blog_2.jpg",
  },
  {
    title: "Jack's Cave - Blog Entry 3",
    description: "Se habla acerca de un paper de maneras en las que se puede empezar a testear videojuegos de manera automatizada, especialmente para juegos del género metroidvania.",
    image: "public/gallery/blog_3.jpg",
  },
];
