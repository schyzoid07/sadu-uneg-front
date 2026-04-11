import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDeleteMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {

            const res = await api.delete(`majors/delete/${id}`).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de carreras
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}