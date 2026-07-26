import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { baseAthletesSchema, detailAthleteSchema } from "@/schemas/athletes";
import { buildSearchParams } from "@/lib/query-params";

// 1. Definimos los esquemas y tipos fuera del hook

const resAthletesSchema = z.object({
  data: z.array(baseAthletesSchema),
  message: z.string(),
});

const resAthleteSchema = z.object({
  data: detailAthleteSchema,
  message: z.string(),
});

export type Athletes = z.infer<typeof baseAthletesSchema>;
export type Athlete = z.infer<typeof detailAthleteSchema>;

/** Filtros que resuelve el backend en `GET /athletes`. */
export type AthleteFilters = {
  /** Buscador único: coincide con nombre, apellido o cédula. */
  search?: string;
  name?: string;
  last_name?: string;
  gov_id?: string;
  gender?: string;
  discipline_id?: string | number;
};

const fetchAllAthletes = async (filters: AthleteFilters) => {
  try {
    const res = await api.get("athletes", { searchParams: buildSearchParams(filters) }).json();
    const parsed = resAthletesSchema.parse(res);
    return parsed.data;
  }
  catch (error) {
    console.error("Error fetching athletes:", error);
    throw error;
  }
};

const fetchAthlete = async (id?: string) => {
  if (!id || id === "undefined") return null;
  try {
    const res = await api.get(`athletes/${id}`).json();
    const parsed = resAthleteSchema.parse(res);
    return parsed.data;
  }
  catch (error) {
    console.error("Error fetching athlete:", error);
    throw error;
  }
};


/**
 * Los filtros forman parte de la `queryKey`, así que cada combinación se cachea por
 * separado. `keepPreviousData` mantiene visible el listado anterior mientras llega el
 * nuevo, para que la tabla no parpadee al escribir en el buscador.
 */
export function useAthletes(filters: AthleteFilters = {}) {
  return useQuery({
    queryKey: ["athletes", filters],
    queryFn: () => fetchAllAthletes(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAthlete(id?: string) {
  return useQuery({
    queryKey: ["athlete", id],
    queryFn: () => fetchAthlete(id),
  });
}