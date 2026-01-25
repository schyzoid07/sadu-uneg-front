import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface UpdateDisciplineInput {
    id: number;
    data: { name?: string };
}

export function useUpdateDiscipline() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateDisciplineInput) => {
            const res = await ky.put(`http://localhost:8080/discipline/edit/${id}`, { json: data }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
}