import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAthlete() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {

            const res = await api.delete(`athletes/delete/${id}`).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de atletas
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}