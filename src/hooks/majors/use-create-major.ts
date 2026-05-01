import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateMajorInput {
    Name: string;
}

export function useCreateMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (newMajor: CreateMajorInput) => {

            const res = await api.post("majors/create", { json: newMajor }).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de carreras
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}