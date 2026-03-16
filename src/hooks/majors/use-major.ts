// hooks/majors/use-major.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";

const majorSchema = z.object({
    ID: z.number(),
    Name: z.string(),
});

// Para creación y actualización
const majorInputSchema = majorSchema.omit({ ID: true });

export type CreateMajorInput = z.infer<typeof majorInputSchema>;
export type UpdateMajorInput = Partial<CreateMajorInput>;

const resMajorsSchema = z.object({
    data: z.array(majorSchema),
    message: z.string(),
});

const resMajorSchema = z.object({
    data: majorSchema,
    message: z.string(),
});

// Inferimos el tipo para usarlo en el componente si fuera necesario
export type Major = z.infer<typeof majorSchema>;

const fetchMajors = async () => {
    try {
        const res = await api.get("majors").json();
        const parsed = resMajorsSchema.parse(res);
        return parsed.data;
    } catch (error) {
        console.error("Error fetching majors:", error);
        throw error;
    }
};

export function useMajors() {
    return useQuery({
        queryKey: ["majors"],
        queryFn: fetchMajors,
    });
}

const fetchMajor = async (id?: string) => {
    if (!id || id === "undefined") return null;
    try {
        const res = await api.get(`majors/${id}`).json();
        const parsed = resMajorSchema.parse(res);
        return parsed.data;
    } catch (error) {
        console.error(`Error fetching major with id ${id}:`, error);
        throw error;
    }
};

export function useMajor(id?: string) {
    return useQuery({
        queryKey: ["major", id],
        queryFn: () => fetchMajor(id),
        enabled: !!id,
    });
}

export function useCreateMajor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newMajor: CreateMajorInput) => {
            return await api.post("majors", { json: newMajor }).json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}

export function useUpdateMajor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: number } & UpdateMajorInput) => {
            return await api.put(`majors/${id}`, { json: data }).json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["majors"] });
            queryClient.invalidateQueries({ queryKey: ["major", String(variables.id)] });
        },
    });
}

export function useDeleteMajor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`majors/${id}`).json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}