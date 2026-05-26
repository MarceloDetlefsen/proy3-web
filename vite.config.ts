import { fileURLToPath, URL } from "node:url"
import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vite"

const VIRTUAL_WALLPAPERS_ID = "virtual:wallpapers"
const RESOLVED_VIRTUAL_WALLPAPERS_ID = "\0virtual:wallpapers"

function collectWallpapers(rootDir: string): string[] {
  const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"])

  const walk = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const files: string[] = []

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...walk(fullPath))
        continue
      }

      if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
        const relativePath = path.relative(rootDir, fullPath).split(path.sep).join("/")
        files.push(`/${relativePath}`)
      }
    }

    return files
  }

  if (!fs.existsSync(rootDir)) return []
  return walk(rootDir)
}

function wallpapersPlugin() {
  const publicDir = path.resolve(process.cwd(), "public")

  return {
    name: "wallpapers-plugin",
    resolveId(id: string) {
      if (id === VIRTUAL_WALLPAPERS_ID) return RESOLVED_VIRTUAL_WALLPAPERS_ID
      return null
    },
    load(id: string) {
      if (id !== RESOLVED_VIRTUAL_WALLPAPERS_ID) return null
      const wallpapers = collectWallpapers(publicDir)
      return `export const wallpapers = ${JSON.stringify(wallpapers)};`
    },
  }
}

export default defineConfig({
  plugins: [wallpapersPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
