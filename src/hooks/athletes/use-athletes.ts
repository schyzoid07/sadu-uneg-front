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

const fetchAllAthletes = async () => {
  try {
    const res = await api.get("athletes").json();
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


export function useAthletes() {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: fetchAllAthletes,
  });
}

export function useAthlete(id?: string) {
  return useQuery({
    queryKey: ["athlete", id],
    queryFn: () => fetchAthlete(id),
  });
}