import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UpdateAthleteInput {
    id: number;
    data: any;
}

export function useUpdateAthlete() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateAthleteInput) => {

            const res = await api.put(`athletes/edit/${id}`, { json: data }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}