export type Project = {
  name: string
  title: string
  description: string
  stack: string[]
  repos: string[]
  deploy?: string
  screenshots: string[]
  featured?: boolean
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
      "public/proyects/BestProfessor1.webp",
      "public/proyects/BestProfessor2.webp",
      "public/proyects/BestProfessor3.webp",
      "public/proyects/BestProfessor4.webp",
    ],
  },
  {
    name: "BodegaDeLicores",
    featured: true,
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
      "public/proyects/BodegaDeLicores1.webp",
      "public/proyects/BodegaDeLicores2.webp",
      "public/proyects/BodegaDeLicores3.webp",
      "public/proyects/BodegaDeLicores4.webp",
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
      "public/proyects/CRT1.webp",
      "public/proyects/CRT2.webp",
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
      "public/proyects/Conneto1.webp",
      "public/proyects/Conneto2.webp",
    ],
  },
  {
    name: "DragonStats",
    featured: true,
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
      "public/proyects/DragonStats1.webp",
      "public/proyects/DragonStats2.webp",
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
    screenshots: ["public/proyects/EcoScan1.webp", "public/proyects/EcoScan2.webp"],
  },
  {
    name: "Galaga",
    title: "Galaga",
    description:
      "Proyecto de consola inspirado en el clasico Galaga, construido como una experiencia interactiva en terminal con pantallas decorativas, controles simples y un sistema basico de puntajes.",
    stack: ["C++", "Ncurses", "ANSI colors"],
    repos: ["https://github.com/alemanuel18/Galaga_PMP.git"],
    screenshots: [
      "public/proyects/Galaga1.webp",
      "public/proyects/Galaga2.webp",
    ],
  },
  {
    name: "HeritageRecords",
    featured: true,
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
      "public/proyects/HeritageRecords1.webp",
      "public/proyects/HeritageRecords2.webp",
      "public/proyects/HeritageRecords3.webp",
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
      "public/proyects/Impostor1.webp",
      "public/proyects/Impostor2.webp",
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
      "public/proyects/InterpreteLisp1.webp",
      "public/proyects/InterpreteLisp2.webp",
      "public/proyects/InterpreteLisp3.webp",
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
      "public/proyects/MyTracker1.webp",
      "public/proyects/MyTracker2.webp",
    ],
  },
  {
    name: "ChronoTriggerCampfire",
    featured: true,
    title: "Chrono Trigger Campfire - Diorama Raytracer",
    description:
      "Raytracer CPU interactivo desarrollado desde cero en Rust para renderizar un diorama voxel inspirado en el campamento nocturno de Chrono Trigger. Implementa trazado de rayos paralelizado, aceleración espacial mediante Voxel Grid con DDA 3D, terreno procedural, materiales con reflexión y refracción, iluminación dinámica y cámara orbital.",
    stack: [
      "Rust",
      "Raylib",
      "Rayon",
      "Noise",
      "Ray tracing CPU",
      "Voxel Grid 3D",
      "Algoritmo DDA Amanatides-Woo",
      "OpenSimplex FBM",
      "Fresnel de Schlick",
      "Refracción de Snell",
    ],
    repos: ["https://github.com/MarceloDetlefsen/proy2-graficas"],
    screenshots: [
      "public/proyects/ChronoTriggerCampfire2.webp",
      "public/proyects/ChronoTriggerCampfire2.png",
      "public/proyects/ChronoTriggerCampfire3.webp",
      "public/proyects/ChronoTriggerCampfire4.webp",
    ],
  },
  {
    name: "NBARaycasting",
    title: "NBA Raycasting",
    description:
      "Videojuego de exploración en pseudo-3D inspirado en Wolfenstein 3D y ambientado en la NBA. Implementa raycasting con DDA, floor casting, paredes texturizadas, sprites con z-buffer y una mecánica de encestar basada en distancia y ángulo, organizada mediante una máquina de estados para menús, niveles y victoria.",
    stack: [
      "Rust",
      "Cargo",
      "raylib",
      "raylib-rs",
      "rand",
      "Raycasting DDA",
      "Floor casting",
      "PNG/JPG",
      "OGG",
    ],
    repos: ["https://github.com/MarceloDetlefsen/graficas-doom"],
    screenshots: [
      "public/proyects/NBARaycasting1.png",
      "public/proyects/NBARaycasting2.webp",
      "public/proyects/NBARaycasting3.png",
    ],
  },
  {
    name: "Aequvg",
    featured: true,
    title: "Plataforma institucional de la Asociación de Estudiantes de Química UVG",
    description:
      "Plataforma web para centralizar la información institucional, noticias, recursos académicos, proyectos, eventos y medios de contacto de la Asociación de Estudiantes de Química de la UVG. Utiliza un frontend SSR con Nuxt y Vue, un backend modular REST con Elysia y persistencia relacional mediante Prisma y PostgreSQL.",
    stack: [
      "TypeScript",
      "Bun",
      "Nuxt 4",
      "Vue 3",
      "Elysia",
      "Prisma ORM",
      "PostgreSQL 16",
      "Vitest",
      "Playwright",
      "Docker Compose",
    ],
    repos: [
      "https://github.com/alemanuel18/aequvg-frontend",
      "https://github.com/alemanuel18/aequvg-backend",
    ],
    screenshots: [
      "public/proyects/Aequvg1.webp",
      "public/proyects/Aequvg2.webp",
      "public/proyects/Aequvg3.webp",
      "public/proyects/Aequvg4.webp",
    ],
  },
  {
    name: "ParachuteAssistant",
    title: "Parachute S.A. Multi-Agent Assistant",
    description:
      "Asistente conversacional para Parachute S.A. que responde FAQs empresariales y gestiona citas de paracaidismo con validación meteorológica en tiempo real. Implementa arquitecturas multiagente centralizada, jerárquica y descentralizada, combinando búsqueda semántica sobre PostgreSQL con pgvector, reglas deterministas de seguridad y evaluación automatizada con Promptfoo.",
    stack: [
      "Python",
      "OpenAI Agents SDK",
      "Groq API",
      "PostgreSQL",
      "pgvector",
      "Sentence Transformers",
      "Open-Meteo API",
      "Promptfoo",
      "Docker",
    ],
    repos: ["https://github.com/MarceloDetlefsen/hdt6-ai"],
    screenshots: [
      "public/proyects/ParachuteAssistant1.webp",
    ],
  },
]

export const orderedProjects: Project[] = [...projects].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return a.name.localeCompare(b.name)
})
