import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { teamsSchema } from "@/schemas/teams";

// Definimos el tipo de entrada para crear/editar
export interface TeamInput {
  Name: string;
  DisciplineID: number;
  UniversityID: number;
  AthleteIDs: number[];
  Regular: boolean;
  Category: string;
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

export interface TeamFilters {
  name?: string;
  category?: string;
  discipline_id?: string;
  university_id?: string;
  regular?: string;
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

const fetchTeams = async (filters?: TeamFilters) => {
  const res = await api.get(`teams${buildQueryString(filters)}`).json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

const fetchTeam = async (id?: string) => {
  if (!id || id === "undefined") return null;
  const res = await api.get(`teams/${id}`).json();
  console.log("🔍 [GET] Respuesta cruda del backend para Team:", res);
  const parsed = resTeamSchema.parse(res);
  return parsed.data;
};

export function useTeams(filters?: TeamFilters) {
  return useQuery({
    queryKey: ["teams", filters],
    queryFn: () => fetchTeams(filters),
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
