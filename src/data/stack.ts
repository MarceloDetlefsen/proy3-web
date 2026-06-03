export type StackItem = {
  category: string
  name: string
  percentage: number
}

// percentage = presencia aproximada en proyectos reales del portafolio.
export const stack: StackItem[] = [
  { category: "Frontend", name: "TypeScript", percentage: 27 },
  { category: "Frontend", name: "Tailwind CSS", percentage: 27 },
  { category: "Frontend", name: "React", percentage: 18 },
  { category: "Frontend", name: "Next.js", percentage: 18 },
  { category: "Frontend", name: "HTML", percentage: 18 },
  { category: "Frontend", name: "CSS", percentage: 18 },
  { category: "Frontend", name: "JavaScript vanilla", percentage: 18 },
  { category: "Frontend", name: "Vue 3", percentage: 9 },
  { category: "Frontend", name: "Vite", percentage: 9 },
  { category: "Frontend", name: "Pinia", percentage: 9 },
  { category: "Frontend", name: "Vue Router", percentage: 9 },

  { category: "Backend", name: "Python", percentage: 18 },
  { category: "Backend", name: "Express", percentage: 18 },
  { category: "Backend", name: "FastAPI", percentage: 9 },
  { category: "Backend", name: "Spring Boot", percentage: 9 },
  { category: "Backend", name: "Phoenix Framework 1.8", percentage: 9 },
  { category: "Backend", name: "Elixir", percentage: 9 },
  { category: "Backend", name: "LiveView", percentage: 9 },
  { category: "Backend", name: "Bun", percentage: 9 },
  { category: "Backend", name: "Elysia", percentage: 9 },
  { category: "Backend", name: "Go", percentage: 9 },
  { category: "Backend", name: "Java", percentage: 9 },

  { category: "DB", name: "Prisma", percentage: 18 },
  { category: "DB", name: "PostgreSQL", percentage: 18 },
  { category: "DB", name: "SQLite", percentage: 18 },
  { category: "DB", name: "Neo4j", percentage: 9 },
  { category: "DB", name: "MySQL", percentage: 9 },
  { category: "DB", name: "Firebase Firestore", percentage: 9 },
  { category: "DB", name: "Firebase Auth", percentage: 9 },
  { category: "DB", name: "LibSQL", percentage: 9 },
  { category: "DB", name: "CSV", percentage: 9 },

  { category: "Mobile/Sistemas", name: "Kotlin", percentage: 9 },
  { category: "Mobile/Sistemas", name: "Jetpack Compose", percentage: 9 },
  { category: "Mobile/Sistemas", name: "C++", percentage: 9 },
  { category: "Mobile/Sistemas", name: "Ncurses", percentage: 9 },
  { category: "Mobile/Sistemas", name: "Pygame", percentage: 9 },
  { category: "Mobile/Sistemas", name: "NumPy", percentage: 9 },
  { category: "Mobile/Sistemas", name: "SciPy", percentage: 9 },

  { category: "Infraestructura", name: "Vercel", percentage: 27 },
  { category: "Infraestructura", name: "Docker", percentage: 9 },
  { category: "Infraestructura", name: "Docker Compose", percentage: 9 },
  { category: "Infraestructura", name: "Railway", percentage: 9 },
  { category: "Infraestructura", name: "Cloudflare R2", percentage: 9 },
  { category: "Infraestructura", name: "Cloudinary", percentage: 9 },
  { category: "Infraestructura", name: "Clerk", percentage: 9 },
  { category: "Infraestructura", name: "Axios", percentage: 9 },
]
