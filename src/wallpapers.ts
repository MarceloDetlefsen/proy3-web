import { wallpapers } from "virtual:wallpapers";

export function pickRandomWallpaper(): string {
  if (wallpapers.length === 0) return "";

  const index = Math.floor(Math.random() * wallpapers.length);
  return wallpapers[index] ?? "";
}
