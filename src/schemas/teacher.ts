import { z } from "zod";

export const teacherSchema = z.object({
    ID: z.number(),
    FirstNames: z.string(),
    LastNames: z.string(),
    GovID: z.string(), // Cédula
    Email: z.string().email(),
    PhoneNumber: z.string(),
});

// Para creación y actualización
export const teacherInputSchema = teacherSchema.omit({ ID: true });

export type Teacher = z.infer<typeof teacherSchema>;
export type CreateTeacherInput = z.infer<typeof teacherInputSchema>;
export type UpdateTeacherInput = Partial<CreateTeacherInput>;
