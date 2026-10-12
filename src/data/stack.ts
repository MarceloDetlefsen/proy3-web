export type StackItem = {
  category: string
  name: string
  percentage: number
}

// percentage = porcentaje estimado de dominio técnico personal (0-100).
// Estos valores son manuales y no se calculan según la cantidad de proyectos.
export const stack: StackItem[] = [
  { category: "Frontend", name: "HTML", percentage: 100 },
  { category: "Frontend", name: "CSS", percentage: 50 },
  { category: "Frontend", name: "JavaScript", percentage: 80 },
  { category: "Frontend", name: "TypeScript", percentage: 65 },
  { category: "Frontend", name: "Vue 3", percentage: 75 },
  { category: "Frontend", name: "Pinia", percentage: 75 },
  { category: "Frontend", name: "React", percentage: 50 },
  { category: "Frontend", name: "Next.js", percentage: 40 },
  { category: "Frontend", name: "Tailwind CSS", percentage: 30 },
  { category: "Frontend", name: "Vite", percentage: 100 },

  { category: "Backend", name: "C#", percentage: 100 },
  { category: "Backend", name: "Go", percentage: 80 },
  { category: "Backend", name: "Java", percentage: 90 },
  { category: "Backend", name: "Spring Boot", percentage: 70 },
  { category: "Backend", name: "JavaScript", percentage: 60 },
  { category: "Backend", name: "TypeScript", percentage: 65 },
  { category: "Backend", name: "Express", percentage: 40 },
  { category: "Backend", name: "Elysia", percentage: 60 },
  { category: "Backend", name: "Elixir", percentage: 40 },
  { category: "Backend", name: "Phoenix Framework", percentage: 35 },
  { category: "Backend", name: "Python", percentage: 60 },
  { category: "Backend", name: "FastAPI", percentage: 50 },
  { category: "Backend", name: "Poetry", percentage: 45 },


  { category: "DB", name: "PostgreSQL", percentage: 100 },
  { category: "DB", name: "SQLite", percentage: 85 },
  { category: "DB", name: "MySQL", percentage: 85 },
  { category: "DB", name: "Neo4j", percentage: 50 },
  { category: "DB", name: "Prisma", percentage: 60 },
  { category: "DB", name: "Firebase Firestore", percentage: 20 },
  { category: "DB", name: "Firebase Auth", percentage: 20 },
  { category: "DB", name: "LibSQL", percentage: 25 },
  { category: "DB", name: "CSV", percentage: 15 },

  { category: "Mobile/Sistemas", name: "Kotlin", percentage: 60 },
  { category: "Mobile/Sistemas", name: "Jetpack Compose", percentage: 60 },
  { category: "Mobile/Sistemas", name: "React Native", percentage: 30 },
  { category: "Mobile/Sistemas", name: "C++", percentage: 40 },
  { category: "Mobile/Sistemas", name: "Rust", percentage: 60 },
  { category: "Mobile/Sistemas", name: "Ruby", percentage: 30 },
  { category: "Mobile/Sistemas", name: "Ncurses", percentage: 35 },
  { category: "Mobile/Sistemas", name: "Pygame", percentage: 15 },

  { category: "Infraestructura", name: "Docker", percentage: 100 },
  { category: "Infraestructura", name: "Docker Compose", percentage: 100 },
  { category: "Infraestructura", name: "Cloudflare R2", percentage: 60 },
  { category: "Infraestructura", name: "Cloudflare Turnstile", percentage: 50 },
  { category: "Infraestructura", name: "Cloudinary", percentage: 15 },
  { category: "Infraestructura", name: "Google Cloud", percentage: 75 },
  { category: "Infraestructura", name: "Tailscale", percentage: 50 },
  { category: "Infraestructura", name: "Clerk", percentage: 60 },
  { category: "Infraestructura", name: "Vercel", percentage: 40 },
  { category: "Infraestructura", name: "Railway", percentage: 40 },
  { category: "Infraestructura", name: "Axios", percentage: 10 },
  { category: "Infraestructura", name: "Bun", percentage: 60 },

  { category: "Linux", name: "QML", percentage: 75 },
  { category: "Linux", name: "Shell", percentage: 80 },
  { category: "Linux", name: "GLSL", percentage: 15 },
  { category: "Linux", name: "Lua", percentage: 35 },
]
