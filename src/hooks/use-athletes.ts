// hooks/use-athletes.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod"; // Corregido el import de zod
import { athleteSchema } from "@/schemas/athletes";
// 1. Definimos los esquemas y tipos fuera del hook

const resSchema = z.object({
  data: z.array(athleteSchema),
  message: z.string(),
});

// Inferimos el tipo para usarlo en el componente si fuera necesario
export type Athlete = z.infer<typeof athleteSchema>;

const fetchAthletes = async () => {
  try {
    const res = await ky.get("http://localhost:8080/athletes").json();
    const parsed = resSchema.parse(res);
    return parsed.data;
  }
  catch (error) {
    console.error("Error fetching athletes:", error);
    throw error;
  }
};

export function useAthletes() {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: fetchAthletes,
  });
}