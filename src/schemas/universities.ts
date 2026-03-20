import * as z from "zod";

export const universitySchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Local: z.boolean(),
});

// Esquema para la creación/edición (sin ID)
export const universityInputSchema = z.object({
    Name: z.string().min(1, "El nombre de la universidad es requerido"),
    Local: z.boolean(),
});

export type University = z.infer<typeof universitySchema>;
export type UniversityInput = z.infer<typeof universityInputSchema>;
