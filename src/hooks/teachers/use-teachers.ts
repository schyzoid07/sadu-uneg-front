// src/hooks/teachers/use-teachers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { TeacherInput, baseTeacherSchema } from "@/schemas/teachers";


const resTeachersSchema = z.object({
  data: z.array(baseTeacherSchema),
  message: z.string(),
});

const resTeacherSchema = z.object({
  data: baseTeacherSchema,
  message: z.string(),
});

// 2. Funciones de Fetching
const fetchTeachers = async () => {
  try {
    const res = await api.get("teachers").json();
    const parsed = resTeachersSchema.parse(res);
    return parsed.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

const fetchTeacher = async (id?: string) => {
  if (!id || id === "undefined") return null;
  try {
    const res = await api.get(`teachers/${id}`).json();
    const parsed = resTeacherSchema.parse(res);
    return parsed.data;
  } catch (error) {
    console.error(`Error fetching teacher with id ${id}:`, error);
    throw error;
  }
};

// 3. Hooks
export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });
}

export function useTeacher(id?: string) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeacher(id),
    enabled: !!id,
  });
}

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (json: TeacherInput) => api.post("teachers", { json }).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, json }: { id: number; json: TeacherInput }) =>
      api.put(`teachers/${id}`, { json }).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`teachers/delete/${id}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};