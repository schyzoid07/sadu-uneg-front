import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface CreateMajorInput {
    Name: string;
}

export function useCreateMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (newMajor: CreateMajorInput) => {

            const res = await ky.post("http://localhost:8080/majors/create", { json: newMajor }).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de carreras
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}