// hooks/use-athletes.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import * as z from "zod"; // Corregido el import de zod

const majorSchema = z.object({
    id: z.number(),
    name: z.string(), // Ajusta según la estructura real
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
        const res = await ky.get("http://localhost:8080/major").json();
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
        queryKey: ["major"],
        queryFn: fetchMajors,
    });
}