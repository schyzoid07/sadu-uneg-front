import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

            const res = await api.post("athletes/create", { json: newAthlete }).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de atletas
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}