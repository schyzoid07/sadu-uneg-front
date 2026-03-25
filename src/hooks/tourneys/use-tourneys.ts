import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";
import { tourneySchema, tourneyInputSchema, Tourney, TourneyInput } from "@/schemas/tourney";

// Exportar tipos para uso en componentes
export type { Tourney, TourneyInput };
export type UpdateTourneyInput = Partial<TourneyInput>;

// --- Funciones de API ---

const fetchTourneys = async (): Promise<Tourney[]> => {
    const res: any = await api.get("tourneys").json();
    // Asumimos que la data puede venir en un campo 'data' o directamente
    const data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
    return z.array(tourneySchema).parse(data);
};

const fetchTourney = async (id?: string): Promise<Tourney | null> => {
    if (!id || id === "undefined") return null;
    const res: any = await api.get(`tourneys/${id}`).json();
    let data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
    // Si el backend devuelve un array, tomamos el primer elemento
    if (Array.isArray(data)) {
        data = data[0];
    }
    return tourneySchema.parse(data);
};

const createTourney = async (json: TourneyInput): Promise<Tourney> => {
    return await api.post("tourneys/create", { json }).json();
};

const updateTourney = async ({ id, data }: { id: number; data: UpdateTourneyInput }): Promise<Tourney> => {
    return await api.put(`tourneys/edit/${id}`, { json: data }).json();
};

const deleteTourney = async (id: number): Promise<any> => {
    return await api.delete(`tourneys/delete/${id}`).json();
};

// --- Hooks de React Query ---

export function useTourneys() {
    return useQuery({
        queryKey: ["tourneys"],
        queryFn: fetchTourneys,
    });
}

export function useTourney(id?: string) {
    return useQuery({
        queryKey: ["tourney", id],
        queryFn: () => fetchTourney(id),
        enabled: !!id, // El query solo se ejecutará si hay un ID
    });
}

export function useCreateTourney() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTourney,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tourneys"] });
        },
    });
}

export function useUpdateTourney() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTourney,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["tourneys"] });
            queryClient.invalidateQueries({ queryKey: ["tourney", variables.id.toString()] });
        },
    });
}

export function useDeleteTourney() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTourney,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tourneys"] });
        },
    });
}