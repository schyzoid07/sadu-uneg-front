import { z } from "zod";
import { eventBareSchema } from "./event";

/**
 * El estado de un torneo, debe coincidir con los valores del backend.
 */
export const tourneyStatusSchema = z.enum([
    "Activo",
    "Finalizado",
    "Pendiente"
]);

/**
 * Esquema para un Torneo tal como se recibe de la API (GET).
 * Incluye el array de objetos de Eventos si se solicitan con detalle.
 */
export const tourneySchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Status: tourneyStatusSchema,
    Events: z.array(eventBareSchema).optional().nullable(),
    StartDate: z.coerce.date().optional(),
    EndDate: z.coerce.date().optional(),
    TotalEvents: z.number().optional(),
    DisciplineID: z.number().optional(),
    DisciplineName: z.string().optional(),
});

/**
 * Esquema para crear o actualizar un Torneo (POST/PUT).
 * Como solicitaste, los eventos se envían como un array de IDs numéricos.
 */
export const tourneyInputSchema = z.object({
    Name: z.string().min(1, "El nombre del torneo es requerido."),
    Status: tourneyStatusSchema.optional(),
    EventIDs: z.array(z.number()).optional(),
});

export type Tourney = z.infer<typeof tourneySchema>;
export type TourneyInput = z.infer<typeof tourneyInputSchema>;