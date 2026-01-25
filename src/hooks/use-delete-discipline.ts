import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useDeleteDiscipline() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            // Si la API responde 204 No Content, omite .json()
            const res = await ky.delete(`http://localhost:8080/discipline/${id}`).json();
            return res;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
}