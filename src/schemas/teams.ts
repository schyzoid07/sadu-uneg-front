import * as z from "zod"

export const teamsSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Regular: z.boolean(),
    Category: z.string(),
    DisciplineID: z.number(),
    UniversityID: z.number(),
    Athletes: z.array(z.any()),

})