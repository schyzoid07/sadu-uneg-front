import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useDeleteDiscipline() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await ky.delete(`http://localhost:8080/discipline/delete/${id}`);
            if (res.status === 204) {
                // No hay contenido que devolver, pero la operación fue exitosa.
                return;
            }
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
}