import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useDeleteMajor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {

            const res = await ky.delete(`http://localhost:8080/major/delete/${id}`).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de carreras
            qc.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}