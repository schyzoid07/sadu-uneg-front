import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UpdateMajorInput {
    id: number;
    data: any;
}

export function useUpdateMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateMajorInput) => {

            const res = await api.put(`majors/edit/${id}`, { json: data }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}