import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface UpdateAthleteInput {
    id: number;
    data: any;
}

export function useUpdateAthlete() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateAthleteInput) => {

            const res = await ky.put(`http://localhost:8080/athletes/edit/${id}`, { json: data }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}