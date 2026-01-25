import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface CreateDisciplineInput {
    name: string;
}

export function useCreateDiscipline() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (newDiscipline: CreateDisciplineInput) => {
            // Ajusta la URL si es necesario
            const res = await ky.post("http://localhost:8080/discipline/create", { json: newDiscipline }).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
}