import * as z from "zod"; // Corregido el import de zod

export const athletesSchema = z.object({
    id: z.number(),
    name: z.string(),
    lastname: z.string(),
    phonenumber: z.string(),
    email: z.string().email(), // Corregido: z.string().email()

    inscripted: z.boolean(),
    regular: z.boolean(),
    id_personal: z.string(),

});

export const athleteSchema = z.object({
    ID: z.number(),
    CreatedAt: z.coerce.date(),
    UpdatedAt: z.coerce.date(),
    DeletedAt: z.coerce.date().nullable(),
    FirstNames: z.string(),
    LastNames: z.string(),
    PhoneNum: z.string(),
    Email: z.string().email(), // Corregido: z.string().email()
    Gender: z.string(),
    InscriptionDate: z.coerce.date().nullable(),
    Regular: z.boolean(),
    GovID: z.string(),
    MajorID: z.number(),
    Teams: z.array(z.object({

        ID: z.number(),
        CreatedAt: z.coerce.date(),
        UpdatedAt: z.coerce.date(),
        DeletedAt: z.coerce.date().nullable(),
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
        }).nullable(),
    })), // Ajusta según la estructura real
});