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
    Status:  z.string(),
   Events: z.array(eventBareSchema).optional().nullable(),
    StartDate: z.coerce.date().optional(),
    EndDate: z.coerce.date().optional(),
    TotalEvents: z.number().optional(),
    DisciplineID: z.number().optional(),
    DisciplineName: z.string().optional(),
});

/**
 * Esquema para crear o actualizar un Torneo (POST/PUT).
 * Los partidos se envían como un array de IDs numéricos bajo la clave `EventIDs`,
 * que es la que lee `TourneyPOSTandPUTDTO` en el backend. Al tipar el payload con
 * `TourneyInput` en el formulario, un nombre de clave equivocado falla en `tsc`.
 */
export const tourneyInputSchema = z.object({
    Name: z.string().min(1, "El nombre del torneo es requerido."),
    Status: tourneyStatusSchema.optional(),
    // La disciplina es obligatoria: el backend rechaza con 400 un torneo sin ella,
    // y es la que usa el filtro del listado.
    DisciplineID: z.number().int().positive("La disciplina del torneo es requerida."),
    // Fechas en ISO 8601, como las serializa `time.Time`.
    StartDate: z.string().optional(),
    EndDate: z.string().optional(),
    EventIDs: z.array(z.number()).optional(),
});

export type Tourney = z.infer<typeof tourneySchema>;
export type TourneyInput = z.infer<typeof tourneyInputSchema>;