// hooks/use-athletes.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod"; // Corregido el import de zod

// 1. Definimos los esquemas y tipos fuera del hook
const athleteSchema = z.object({
  ID: z.number(),
  CreatedAt: z.coerce.date(),
  UpdatedAt: z.coerce.date(),
  DeletedAt: z.coerce.date().nullable(),
  FirstNames: z.string(),
  LastNames: z.string(),
  PhoneNum: z.string(),
  Email: z.string().email(), // Corregido: z.string().email()
  Gender: z.string(),
  InscriptionDate: z.coerce.date().nullable(),
  Regular: z.boolean(),
  GovID: z.string(),
  MajorID: z.number(),
});

const resSchema = z.object({
  data: z.array(athleteSchema),
  message: z.string(),
});

// Inferimos el tipo para usarlo en el componente si fuera necesario
export type Athlete = z.infer<typeof athleteSchema>;

const fetchAthletes = async () => {
  const res = await ky.get("http://localhost:8080/athletes/").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useAthletes() {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: fetchAthletes,
  });
}