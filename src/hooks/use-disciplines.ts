// hooks/use-disciplines.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod";

// Definimos el esquema de la disciplina individual
const disciplineSchema = z.object({
  ID: z.number(),
  Nombre: z.string(),
});

// Esquema de la respuesta de la API
const resSchema = z.object({
  data: z.array(disciplineSchema),
  message: z.string(),
});

// Tipo inferido para TypeScript
export type Discipline = z.infer<typeof disciplineSchema>;

const fetchDisciplines = async () => {
  const res = await ky.get("http://localhost:8080/disciplines").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useDisciplines() {
  return useQuery({
    queryKey: ["disciplines"],
    queryFn: fetchDisciplines,
  });
}