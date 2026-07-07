import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { baseAthletesSchema, detailAthleteSchema } from "@/schemas/athletes";

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

export interface AthleteFilters {
  name?: string;
  gender?: string;
  discipline_id?: string;
}

const buildQueryString = (params?: object): string => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null && value !== false) searchParams.set(key, String(value));
    });
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

const fetchAllAthletes = async (filters?: AthleteFilters) => {
  try {
    const res = await api.get(`athletes${buildQueryString(filters)}`).json();
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


export function useAthletes(filters?: AthleteFilters) {
  return useQuery({
    queryKey: ["athletes", filters],
    queryFn: () => fetchAllAthletes(filters),
  });
}

export function useAthlete(id?: string) {
  return useQuery({
    queryKey: ["athlete", id],
    queryFn: () => fetchAthlete(id),
  });
}