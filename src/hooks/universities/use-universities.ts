import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildSearchParams } from "@/lib/query-params";
import { api } from "@/lib/api";
import { universitySchema, UniversityInput } from "@/schemas/universities";
import * as z from "zod";

const resUniversitiesSchema = z.object({
  data: z.array(universitySchema),
  message: z.string(),
});

const resUniversitySchema = z.object({
  data: universitySchema,
  message: z.string(),
});

/** Filtros que resuelve el backend en `GET /universities`. */
export type UniversityFilters = {
  name?: string;
  local?: "true" | "false";
};

const fetchUniversities = async (filters: UniversityFilters) => {
  const res = await api.get("universities", { searchParams: buildSearchParams(filters) }).json();
  const parsed = resUniversitiesSchema.parse(res);
  return parsed.data;
};

const fetchUniversity = async (id?: string) => {
  if (!id || id === "undefined") return null;
  const res = await api.get(`universities/${id}`).json();
  const parsed = resUniversitySchema.parse(res);
  return parsed.data;
};

export function useUniversities(filters: UniversityFilters = {}) {
  return useQuery({
    queryKey: ["universities", filters],
    queryFn: () => fetchUniversities(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUniversity(id?: string) {
  return useQuery({
    queryKey: ["university", id],
    queryFn: () => fetchUniversity(id),
    enabled: !!id,
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (json: UniversityInput) => api.post("universities/create", { json }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["universities"] }),
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, json }: { id: number; json: UniversityInput }) =>
      api.put(`universities/edit/${id}`, { json }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["universities"] }),
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`universities/delete/${id}`).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["universities"] }),
  });
}