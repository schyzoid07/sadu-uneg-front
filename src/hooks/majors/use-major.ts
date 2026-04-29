// hooks/majors/use-major.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";

const majorSchema = z.object({
    ID: z.number(),
    Name: z.string(),
});

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