// hooks/use-athletes.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod"; // Corregido el import de zod
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

// Inferimos el tipo para usarlo en el componente si fuera necesario
export type Athletes = z.infer<typeof baseAthletesSchema>;
export type Athlete = z.infer<typeof detailAthleteSchema>;

const fetchAllAthletes = async () => {
  try {
    const res = await ky.get("http://localhost:8080/athletes").json();
    const parsed = resAthletesSchema.parse(res);
    return parsed.data;
  }
  catch (error) {
    console.error("Error fetching athletes:", error);
    throw error;
  }
};

const fetchAthlete = async (id?: string) => {
  try {
    const res = await ky.get(`http://localhost:8080/athletes/${id}`).json();
    const parsed = resAthleteSchema.parse(res);
    return parsed.data;
  }
  catch (error) {
    console.error("Error fetching athlete:", error);
    console.log("aypapa", error);
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