import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface CreateAthleteInput {
    FirstNames: string;
    LastNames: string;
    GovID: string;
    PhoneNumber?: string;
    Email?: string;
    Gender?: string;
    InscriptionDate?: Date | null;
    Regular?: boolean;
    MajorID?: number | null;
    Enrolled?: boolean;
    TeamsIDs?: number[];
}

export function useCreateAthlete() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (newAthlete: CreateAthleteInput) => {
            // Ajusta la URL si tu backend está en otra ruta
            const res = await ky.post("http://localhost:8080/athletes/create", { json: newAthlete }).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de atletas
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}