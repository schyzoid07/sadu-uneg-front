import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useDeleteAthlete() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            // Ajusta la URL si tu backend usa otra ruta o requiere headers
            // Si la API no devuelve JSON al borrar, puedes omitir .json()
            const res = await ky.delete(`http://localhost:8080/athletes/delete/${id}`).json();
            return res;
        },
        onSuccess: () => {
            // refrescar listado de atletas
            qc.invalidateQueries({ queryKey: ["athletes"] });
        },
    });
}