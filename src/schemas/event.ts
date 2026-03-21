import { z } from "zod";

// Definimos un esquema base para los DTOs anidados (Team, Teacher, Discipline)
// Usamos .passthrough() para permitir que pasen otros campos si el backend los envía en el futuro
const baseDtoSchema = z.object({
    ID: z.number(),
    Name: z.string().optional().nullable(),
}).passthrough();

// Esquema para equipos dentro de un evento, necesita UniversityID
const teamInEventSchema = z.object({
    ID: z.number(),
    Name: z.string().optional().nullable(),
    UniversityID: z.number().optional().nullable(),
    University: z.object({
        ID: z.number(),
        Name: z.string().optional().nullable(),
    }).optional().nullable().or(z.object({})), // Permitimos objeto vacío si viene zero-value
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
    Name: z.string().optional().nullable(),
    Date: z.string().optional().nullable(), // time.Time se recibe como string ISO 8601
    Status: z.string().optional().nullable(),
    HomePoints: z.number().optional().nullable(),
    OppositePoints: z.number().optional().nullable(),
    // En el backend son structs, así que siempre vendrán (aunque sea vacíos/ID=0)
    HomeTeam: teamInEventSchema.optional().nullable(),
    OppositeTeam: teamInEventSchema.optional().nullable(),
    ResponsableTeacher: teacherDtoSchema.optional().nullable(),
    Discipline: baseDtoSchema.optional().nullable(),
});

export const eventDetailSchema = eventBareSchema.extend({
    Observation: z.string().optional().nullable(),
    Ubication: z.string().optional().nullable(),
    Tourney: baseDtoSchema.optional().nullable(),
});

export const eventSchema = eventDetailSchema;

export type EventBare = z.infer<typeof eventBareSchema>;
export type EventDetail = z.infer<typeof eventDetailSchema>;
export type Event = EventDetail;
