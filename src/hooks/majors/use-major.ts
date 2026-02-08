// hooks/use-athletes.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod"; // Corregido el import de zod

const majorSchema = z.object({
    ID: z.number(),
    Name: z.string(), // Ajusta según la estructura real
});
// 1. Definimos los esquemas y tipos fuera del hook

const resSchema = z.object({
    data: z.array(majorSchema),
    message: z.string(),
});

// Inferimos el tipo para usarlo en el componente si fuera necesario
export type Major = z.infer<typeof majorSchema>;

const fetchMajors = async () => {
    try {
        const res = await ky.get("http://localhost:8080/majors").json();
        const parsed = resSchema.parse(res);
        return parsed.data;
    }
    catch (error) {
        console.error("Error fetching athletes:", error);
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
    try {
        const res = await ky.get(`http://localhost:8080/majors/${id}`).json();
        const parsed = resSchema.parse(res);
        return parsed.data;
    }
    catch (error) {
        console.error("Error fetching athletes:", error);
        throw error;
    }
}


export function useMajor(id?: string) {
    return useQuery({
        queryKey: ["major", id],
        queryFn: () => fetchMajor(id)
    })
}