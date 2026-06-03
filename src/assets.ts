/**
 * Construye la URL de un asset público respetando el base path de Vite.
 * Dev:  /proyects/foo.png
 * Prod: /proy3-web/proyects/foo.png
 *
 * Acepta rutas con o sin leading slash, y con o sin prefijo "public/".
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const clean = path.replace(/^\//, "").replace(/^public\//, "");
  return `${base.replace(/\/$/, "")}/${clean}`;
}