import * as z from "zod"

export const teamsSchema = z.object({
    id: z.number(),
    name: z.string(),
    regular: z.boolean(),
    category: z.string(),
    discipline_id: z.number(),
    university_id: z.number(),
    athletes: z.array(z.any()),

})