import { fileURLToPath, URL } from "node:url"
import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vite"

const VIRTUAL_WALLPAPERS_ID = "virtual:wallpapers"
const RESOLVED_VIRTUAL_WALLPAPERS_ID = "\0virtual:wallpapers"

function collectWallpapers(rootDir: string, publicPath: string): string[] {
  const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"])

  if (!fs.existsSync(rootDir)) return []

  const entries = fs.readdirSync(rootDir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const fullPath = path.join(rootDir, entry.name)
    if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) continue

    const relativePath = path.relative(rootDir, fullPath).split(path.sep).join("/")
    files.push(encodeURI(`${publicPath}/${relativePath}`))
  }

  return files
}

function wallpapersPlugin() {
  const wallpapersDir = path.resolve(process.cwd(), "public", "wallpapers")

  return {
    name: "wallpapers-plugin",
    resolveId(id: string) {
      if (id === VIRTUAL_WALLPAPERS_ID) return RESOLVED_VIRTUAL_WALLPAPERS_ID
      return null
    },
    load(id: string) {
      if (id !== RESOLVED_VIRTUAL_WALLPAPERS_ID) return null
      const wallpapers = collectWallpapers(wallpapersDir, "/wallpapers")
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
