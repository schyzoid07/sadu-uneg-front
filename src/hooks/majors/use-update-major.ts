import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface UpdateMajorInput {
    id: number;
    data: any;
}

export function useUpdateMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateMajorInput) => {

            const res = await ky.put(`http://localhost:8080/majors/edit/${id}`, { json: data }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}