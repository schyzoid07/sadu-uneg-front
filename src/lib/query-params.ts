/**
 * Construye los `searchParams` de una petición a partir de un objeto de filtros.
 *
 * Descarta los filtros sin valor para no enviar parámetros vacíos, y trata `"all"`
 * como "sin filtro", que es el valor que usan los `Select` de los listados para la
 * opción «Todas/Todos».
 */
export function buildSearchParams(
  filters: Record<string, string | number | boolean | undefined | null>,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [clave, valor] of Object.entries(filters)) {
    if (valor === undefined || valor === null) continue;

    const texto = String(valor).trim();
    if (texto === "" || texto === "all") continue;

    params[clave] = texto;
  }

  return params;
}
