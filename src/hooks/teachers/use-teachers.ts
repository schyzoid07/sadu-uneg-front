// src/hooks/teachers/use-teachers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { teacherSchema, Teacher, CreateTeacherInput } from "@/schemas/teacher";

export type { Teacher, CreateTeacherInput, UpdateTeacherInput } from "@/schemas/teacher";

const resTeachersSchema = z.object({
  data: z.array(teacherSchema),
  message: z.string(),
});

const resTeacherSchema = z.object({
  data: teacherSchema,
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

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTeacher: CreateTeacherInput) => {
      return await api.post("teachers", { json: newTeacher }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`teachers/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}