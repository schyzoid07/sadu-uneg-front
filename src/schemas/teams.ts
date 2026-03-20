import * as z from "zod"

export const teamsSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Regular: z.boolean(),
    Category: z.string().optional(),

    // Hacemos opcionales los IDs planos por si vienen en objetos
    DisciplineID: z.number().optional().nullable(),
    UniversityID: z.number().optional().nullable(),
    // Definimos los objetos anidados que envía el backend
    Discipline: z.object({ ID: z.number(), Name: z.string().optional() }).optional().nullable(),
    University: z.object({ ID: z.number(), Name: z.string().optional() }).optional().nullable(),

    // Permitimos que venga Athletes (objetos) o AthleteIDs (números), y que sean opcionales
    Athletes: z.array(z.any()).optional().nullable(),
    AthleteIDs: z.array(z.number()).optional().nullable(),
})