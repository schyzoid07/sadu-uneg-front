// hooks/use-teams.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

// Esquema de un equipo individual
const teamSchema = z.object({
  ID: z.number(),
  Nombre: z.string(),
  DisciplinaID: z.number(),
  UniversidadID: z.number(),
  Categoria: z.string(),
  Regular: z.boolean(),
});

// Esquema de la respuesta completa
const resSchema = z.object({
  data: z.array(teamSchema),
  message: z.string(),
});

export type Team = z.infer<typeof teamSchema>;

const fetchTeams = async () => {
  const res = await ky.get("http://localhost:8080/teams/").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });
}