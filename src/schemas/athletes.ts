import * as z from "zod"; // Corregido el import de zod

export const baseAthletesSchema = z.object({
    ID: z.number().nullable(),
    GovID: z.string(),
    FirstNames: z.string(),
    LastNames: z.string(),
    PhoneNumber: z.string(),
    Email: z.string(), // Corregido: z.string().email()
    Gender: z.string(),
    Enrolled: z.boolean(),
    Regular: z.boolean(),


});

export const detailAthleteSchema = baseAthletesSchema.extend({


    CreatedAt: z.coerce.date().nullable(),
    UpdatedAt: z.coerce.date().nullable(),
    DeletedAt: z.coerce.date().nullable(),
    InscriptionDate: z.coerce.date().nullable(),
    MajorID: z.number(),
    Teams: z.array(z.object({
        ID: z.number(),
        Name: z.string(),
        Regular: z.boolean(),
        Category: z.string(),
        DisciplineID: z.number(),
        UniversityID: z.number(),
        Discipline: z.object({
            ID: z.number(),
            CreatedAt: z.coerce.date(),
            UpdatedAt: z.coerce.date(),
            DeletedAt: z.coerce.date().nullable(),
            Name: z.string(),
            Teams: z.null(),
            Events: z.null(),
            Athletes: z.null(),
            Teachers: z.null()
        }).nullable()
    }))
})

export const AthleteInputType = z.object({
    //ID: z.number().nullish(),
    GovID: z.string(),
    FirstNames: z.string(),
    LastNames: z.string(),
    PhoneNumber: z.string(),
    Email: z.string().email(), // Corregido: z.string().email()
    Gender: z.string(),
    Enrolled: z.boolean(),
    Regular: z.boolean(),
    InscriptionDate: z.coerce.date().nullable(),
    MajorID: z.number().nullable(),
    Teams: z.array(z.object({ ID: z.number() }))
})