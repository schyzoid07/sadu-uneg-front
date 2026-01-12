import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

interface CreateTeamInput {
  Nombre: string;
  DisciplinaID: number;
  UniversidadID: number;
  AtletasIDs: number[]; 
}

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


export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTeam: CreateTeamInput) => {
      return await ky.post("http://localhost:8080/teams/", { json: newTeam }).json();
    },
    onSuccess: () => {
      // Esto refresca la lista de equipos automáticamente al crear uno nuevo
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}