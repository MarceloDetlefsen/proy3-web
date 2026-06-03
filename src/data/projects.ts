export type Project = {
  name: string
  title: string
  description: string
  stack: string[]
  repos: string[]
  deploy?: string
  screenshots: string[]
}

function normalizeProjectKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

export function findProjectByIdentifier(identifier: string): Project | undefined {
  const normalized = normalizeProjectKey(identifier)

  return projects.find((project) => {
    const byName = normalizeProjectKey(project.name)
    const byTitle = normalizeProjectKey(project.title)
    return byName === normalized || byTitle === normalized
  })
}

export const projects: Project[] = [
  {
    name: "BestProfessor",
    title: "Sistema de Recomendacion de Profesores",
    description:
      "Proyecto academico orientado a sugerir profesores universitarios segun el perfil de cada estudiante. El sistema combina informacion del estudiante, del profesor y de los cursos para generar recomendaciones personalizadas con un enfoque basado en grafos.",
    stack: ["React", "FastAPI", "Neo4j", "Python", "Tailwind CSS"],
    repos: [
      "https://github.com/alemanuel18/Front-Profesor-Recommendation-System.git",
      "https://github.com/MarceloDetlefsen/Back-Professor-Recommendation-System.git",
    ],
    screenshots: [
      "public/proyects/BestProfessor1.png",
      "public/proyects/BestProfessor2.png",
      "public/proyects/BestProfessor3.png",
      "public/proyects/BestProfessor4.png",
    ],
  },
  {
    name: "BodegaDeLicores",
    title: "Bodegas de Licores",
    description:
      "Plataforma web para la gestion y compra de productos de bodega, con experiencia separada para clientes y administracion. El proyecto cubre catalogo, carrito, pedidos, inventario, promociones y control de acceso por roles.",
    stack: [
      "Vue 3",
      "TypeScript",
      "Vite",
      "Pinia",
      "Vue Router",
      "Axios",
      "Clerk",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Cloudflare R2",
    ],
    repos: [
      "https://github.com/eldmark/bodegas-frontend.git",
      "https://github.com/eldmark/bodegas-backend.git",
    ],
    deploy: "http://34.174.123.107:5173/index",
    screenshots: [
      "public/proyects/BodegaDeLicores1.png",
      "public/proyects/BodegaDeLicores2.png",
    ],
  },
  {
    name: "CRT",
    title: "Simulacion de Tubo de Rayos Catodicos (CRT)",
    description:
      "Proyecto de simulacion interactiva que reproduce el comportamiento fisico de un tubo de rayos catodicos y permite explorar visualmente como se mueven los electrones bajo diferentes condiciones electricas.",
    stack: ["Python", "Pygame", "NumPy", "SciPy"],
    repos: ["https://github.com/eldmark/simulacionProyecto.git"],
    screenshots: [
      "public/proyects/CRT1.png",
      "public/proyects/CRT2.png",
    ],
  },
  {
    name: "Conneto",
    title: "Conneto",
    description:
      "Conneto es una plataforma web orientada a la colaboracion entre equipos y organizaciones para coordinar actividades, tareas y gestion de informacion dentro de una aplicacion centralizada.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Spring Boot", "MySQL"],
    repos: [
      "https://github.com/24750Montenegro/Conneto-front.git",
      "https://github.com/24750Montenegro/Conneto-back.git",
    ],
    screenshots: [
      "public/proyects/Conneto1.png",
      "public/proyects/Conneto2.png",
    ],
  },
  {
    name: "DragonStats",
    title: "DragonStats",
    description:
      "Aplicacion movil para gestion y visualizacion de estadisticas de torneos de futbol. El proyecto organiza informacion de partidos, equipos, jugadores y fases del torneo en una experiencia pensada para consulta rapida y analisis visual.",
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "MVVM",
      "Firebase Firestore",
      "Firebase Auth",
      "DataStore",
      "Navigation Compose",
    ],
    repos: ["https://github.com/jdivass/MP_Project.git"],
    screenshots: [
      "public/proyects/DragonStats1.jpg",
      "public/proyects/DragonStats2.jpg",
    ],
  },
  {
    name: "EcoScan",
    title: "EcoScan",
    description:
      "Sistema de deteccion y analisis de residuos que usa vision por IA para clasificar basura desde imagenes, guardar registros geograficos y apoyar rutas de recoleccion mas eficientes.",
    stack: [
      "Next.js 16",
      "React 19",
      "Express",
      "TypeScript",
      "Claude / Anthropic",
      "Prisma",
      "LibSQL",
      "SQLite",
      "Cloudinary",
      "MapLibre GL",
      "Zod",
    ],
    repos: [
      "https://github.com/MarceloDetlefsen/frontend-trashclient.git",
      "https://github.com/eldmark/backend-ecoscan.git",
    ],
    deploy: "https://frontend-trashclient.vercel.app/dashboard",
    screenshots: ["public/proyects/EcoScan1.png", "public/proyects/EcoScan2.png"],
  },
  {
    name: "Galaga",
    title: "Galaga",
    description:
      "Proyecto de consola inspirado en el clasico Galaga, construido como una experiencia interactiva en terminal con pantallas decorativas, controles simples y un sistema basico de puntajes.",
    stack: ["C++", "Ncurses", "ANSI colors"],
    repos: ["https://github.com/alemanuel18/Galaga_PMP.git"],
    screenshots: [
      "public/proyects/Galaga1.png",
      "public/proyects/Galaga2.png",
    ],
  },
  {
    name: "HeritageRecords",
    title: "Heritage Records",
    description:
      "Sistema interno para la operacion de una tienda especializada en formatos fisicos de musica, centrado en inventario, ventas, clientes, reportes y control de acceso por roles.",
    stack: [
      "Phoenix Framework 1.8",
      "LiveView",
      "Elixir",
      "PostgreSQL 16",
      "phx.gen.auth",
      "Tailwind CSS v4",
      "daisyUI",
      "Docker",
      "Docker Compose",
    ],
    repos: ["https://github.com/MarceloDetlefsen/proyecto2-db.git"],
    screenshots: [
      "public/proyects/HeritageRecords1.png",
      "public/proyects/HeritageRecords2.png",
      "public/proyects/HeritageRecords3.png",
    ],
  },
  {
    name: "Impostor",
    title: "Juego del Impostor",
    description:
      "Juego web para jugar en grupo en modo local o remoto, donde los participantes reciben palabras, pistas y roles de forma dinamica. El proyecto esta pensado para partidas rapidas y sociales, con soporte para lobbies compartidos y control de anfitrion.",
    stack: ["HTML", "CSS", "JavaScript vanilla", "Elysia", "Bun", "CSV", "Vercel", "Railway"],
    repos: ["https://github.com/MarceloDetlefsen/Impostor.git"],
    deploy: "https://impostor-gamma-dusky.vercel.app/",
    screenshots: [
      "public/proyects/Impostor1.jpg",
      "public/proyects/Impostor2.jpg",
    ],
  },
  {
    name: "InterpreteLisp",
    title: "InterpreteLisp",
    description:
      "Interprete de Lisp desarrollado como proyecto academico para procesar y evaluar expresiones del lenguaje, incluyendo operaciones aritmeticas, definicion de funciones, variables, predicados y condicionales.",
    stack: ["Java", "Maven", "JUnit"],
    repos: ["https://github.com/MarceloDetlefsen/InterpreteLisp.git"],
    screenshots: [
      "public/proyects/InterpreteLisp1.png",
      "public/proyects/InterpreteLisp2.png",
      "public/proyects/InterpreteLisp3.png",
    ],
  },
  {
    name: "MyTracker",
    title: "Series Tracker",
    description:
      "Aplicacion web para llevar control de series, su progreso de episodios y valoraciones. El proyecto separa un frontend estatico y un backend REST, con una experiencia pensada para explorar, editar y calificar contenido de forma rapida.",
    stack: ["HTML", "CSS", "JavaScript vanilla", "Go", "SQLite", "net/http", "CORS"],
    repos: [
      "https://github.com/MarceloDetlefsen/frontend-proyecto1-web.git",
      "https://github.com/MarceloDetlefsen/backend-proyecto1-web.git",
    ],
    deploy: "https://frontend-proyecto1-web.vercel.app/index.html",
    screenshots: [
      "public/proyects/MyTracker1.png",
      "public/proyects/MyTracker2.png",
    ],
  },
]
