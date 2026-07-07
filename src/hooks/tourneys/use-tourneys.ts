import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";
import { tourneySchema, tourneyInputSchema, Tourney, TourneyInput } from "@/schemas/tourney";

// Exportar tipos para uso en componentes
export type { Tourney, TourneyInput };
export type UpdateTourneyInput = Partial<TourneyInput>;

export interface TourneyFilters {
  name?: string;
  status?: string;
  discipline_id?: string;
}

const buildQueryString = (params?: object): string => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null && value !== false) searchParams.set(key, String(value));
    });
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

// --- Funciones de API ---

const fetchTourneys = async (filters?: TourneyFilters): Promise<Tourney[]> => {
    const res: any = await api.get(`tourneys${buildQueryString(filters)}`).json();
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

export function useTourneys(filters?: TourneyFilters) {
    return useQuery({
        queryKey: ["tourneys", filters],
        queryFn: () => fetchTourneys(filters),
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