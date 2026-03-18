import { z } from "zod";

// Definimos un esquema base para los DTOs anidados (Team, Teacher, Discipline)
// Usamos .passthrough() para permitir que pasen otros campos si el backend los envía en el futuro
const baseDtoSchema = z.object({
    ID: z.number(),
    Name: z.string(),
}).passthrough();

// Esquema específico para profesores que probablemente usan FirstNames/LastNames en lugar de Name
const teacherDtoSchema = z.object({
    ID: z.number(),
    Name: z.string().optional().nullable(),
    FirstNames: z.string().optional().nullable(),
    LastNames: z.string().optional().nullable(),
}).passthrough();

export const eventSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Date: z.string(), // time.Time se recibe como string ISO 8601
    Status: z.string(),
    HomePoints: z.number(),
    OppositePoints: z.number(),

    // Relaciones (Structs anidados en Go)
    HomeTeam: baseDtoSchema,
    OppositeTeam: baseDtoSchema,
    ResponsableTeacher: teacherDtoSchema,
    Discipline: baseDtoSchema,
});

export type Event = z.infer<typeof eventSchema>;
