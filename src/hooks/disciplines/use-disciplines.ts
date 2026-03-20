// src/hooks/disciplines/use-disciplines.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";

// 1. Esquema y Tipos
const disciplineSchema = z.object({
  ID: z.number(),
  Name: z.string(),
});

// Para creación y actualización
const disciplineInputSchema = disciplineSchema.omit({ ID: true });

export type Discipline = z.infer<typeof disciplineSchema>;
export type CreateDisciplineInput = z.infer<typeof disciplineInputSchema>;
export type UpdateDisciplineInput = Partial<CreateDisciplineInput>;

const resDisciplinesSchema = z.object({
  data: z.array(disciplineSchema),
  message: z.string(),
});

const resDisciplineSchema = z.object({
  data: disciplineSchema,
  message: z.string(),
});

// 2. Funciones de Fetching
const fetchDisciplines = async () => {
  try {
    const res = await api.get("disciplines").json();
    const parsed = resDisciplinesSchema.parse(res);
    return parsed.data;
  } catch (error) {
    console.error("Error fetching disciplines:", error);
    throw error;
  }
};

const fetchDiscipline = async (id?: string) => {
  if (!id || id === "undefined") return null;
  try {
    const res = await api.get(`disciplines/${id}`).json();
    const parsed = resDisciplineSchema.parse(res);
    return parsed.data;
  } catch (error) {
    console.error(`Error fetching discipline with id ${id}:`, error);
    throw error;
  }
};

// 3. Hooks
export function useDisciplines() {
  return useQuery({
    queryKey: ["disciplines"],
    queryFn: fetchDisciplines,
  });
}

export function useDiscipline(id?: string) {
  return useQuery({
    queryKey: ["discipline", id],
    queryFn: () => fetchDiscipline(id),
    enabled: !!id,
  });
}

export function useCreateDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newDiscipline: CreateDisciplineInput) => {
      return await api.post("disciplines/create", { json: newDiscipline }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },
  });
}

export function useUpdateDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDisciplineInput }) => {
      return await api.put(`disciplines/edit/${id}`, { json: data }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },
  });
}

export function useDeleteDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`disciplines/delete/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },
  });
}