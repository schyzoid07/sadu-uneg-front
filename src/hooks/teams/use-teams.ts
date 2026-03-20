import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { teamsSchema } from "@/schemas/teams";

// Definimos el tipo de entrada para crear/editar
export interface TeamInput {
  Nombre: string;
  DisciplinaID: number;
  UniversidadID: number;
  AtletasIDs: number[];
}

// Esquema de la respuesta completa
const resSchema = z.object({
  data: z.array(teamsSchema),
  message: z.string(),
});

// Esquema para un solo equipo
const resTeamSchema = z.object({
  data: teamsSchema,
  message: z.string(),
});

export type Team = z.infer<typeof teamsSchema>;

const fetchTeams = async () => {
  const res = await api.get("teams").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

const fetchTeam = async (id?: string) => {
  if (!id || id === "undefined") return null;
  const res = await api.get(`teams/${id}`).json();
  const parsed = resTeamSchema.parse(res);
  return parsed.data;
};

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });
}

export function useTeam(id?: string) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeam(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTeam: TeamInput) => {
      return await api.post("teams/create", { json: newTeam }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TeamInput }) => {
      return await api.put(`teams/edit/${id}`, { json: data }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`teams/delete/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}
