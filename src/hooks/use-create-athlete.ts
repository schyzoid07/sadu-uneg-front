import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface CreateAthleteInput {
    FirstNames: string;
    LastNames: string;
    GovID: string;
    PhoneNum?: string;
    Email?: string;
    Gender?: string;
    InscriptionDate?: string | null;
    Regular?: boolean;
    MajorID?: number;
    Active?: boolean;
    TeamsIDs?: number[];
    DisciplineIDs?: number[];
    EventIDs?: number[];
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