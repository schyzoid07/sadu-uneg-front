import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";
import { teamsSchema } from "@/schemas/teams";
interface CreateTeamInput {
  Nombre: string;
  DisciplinaID: number;
  UniversidadID: number;
  AtletasIDs: number[];
}



// Esquema de la respuesta completa
const resSchema = z.object({
  data: z.array(teamsSchema),
  //message: z.string()
});

export type Team = z.infer<typeof teamsSchema>;

const fetchTeams = async () => {
  const res = await ky.get("http://localhost:8080/teams").json();
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