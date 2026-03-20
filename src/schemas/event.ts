import { z } from "zod";

// Definimos un esquema base para los DTOs anidados (Team, Teacher, Discipline)
// Usamos .passthrough() para permitir que pasen otros campos si el backend los envía en el futuro
const baseDtoSchema = z.object({
    ID: z.number(),
    Name: z.string(),
}).passthrough();

// Esquema para equipos dentro de un evento, necesita UniversityID
const teamInEventSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    UniversityID: z.number().optional().nullable(),
    University: z.object({
        ID: z.number(),
        Name: z.string().optional(),
    }).optional().nullable(),
}).passthrough();

// Esquema específico para profesores que probablemente usan FirstNames/LastNames en lugar de Name
const teacherDtoSchema = z.object({
    ID: z.number(),
    Name: z.string().optional().nullable(),
    FirstNames: z.string().optional().nullable(),
    LastNames: z.string().optional().nullable(),
}).passthrough();

export const eventBareSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Date: z.string(), // time.Time se recibe como string ISO 8601
    Status: z.string(),
    HomePoints: z.number(),
    OppositePoints: z.number(),
    HomeTeam: teamInEventSchema,
    OppositeTeam: teamInEventSchema,
    ResponsableTeacher: teacherDtoSchema,
    Discipline: baseDtoSchema,
});

export const eventDetailSchema = eventBareSchema.extend({
    Observation: z.string().optional(),
    Ubication: z.string().optional(),
    Tourney: baseDtoSchema.optional().nullable(),
});

export const eventSchema = eventDetailSchema;

export type EventBare = z.infer<typeof eventBareSchema>;
export type EventDetail = z.infer<typeof eventDetailSchema>;
export type Event = EventDetail;
