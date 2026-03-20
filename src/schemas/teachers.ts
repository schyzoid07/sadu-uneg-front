import * as z from "zod";

const relatedEntitySchema = z.object({
    ID: z.number(),
    Name: z.string().optional(),
});

export const baseTeacherSchema = z.object({
    ID: z.number(),
    GovID: z.string(),
    FirstNames: z.string(),
    LastNames: z.string(),
    PhoneNumber: z.string(),
    Email: z.string(),
    Gender: z.string().optional(),
    Events: z.array(relatedEntitySchema).optional(),
    Disciplines: z.array(relatedEntitySchema).optional(),
});

export const teacherInputSchema = z.object({
    GovID: z.string().min(1, "La cédula es requerida"),
    FirstNames: z.string().min(1, "El nombre es requerido"),
    LastNames: z.string().min(1, "El apellido es requerido"),
    PhoneNumber: z.string().min(1, "El teléfono es requerido"),
    Email: z.string().email("Correo inválido"),
    Gender: z.string().optional(),
    EventIDs: z.array(z.number()).optional(),
    DisciplineIDs: z.array(z.number()).optional(),
});

export type Teacher = z.infer<typeof baseTeacherSchema>;
export type TeacherInput = z.infer<typeof teacherInputSchema>;
