// src/hooks/events/use-events.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as z from "zod";
import { eventBareSchema, eventDetailSchema, Event } from "@/schemas/event";

// 1. Esquema y Tipos (Separamos el de input para no romper el formulario de creación)
// Este esquema se usa solo para el tipado del input de creación/edición
const createEventSchema = z.object({
  Name: z.string(),
  Date: z.string(),
  Status: z.string().optional(),
  Observation: z.string().optional(),
  Ubication: z.string().optional(),
  HomePoints: z.coerce.number().optional(),
  OppositePoints: z.coerce.number().optional(),
  HomeTeamID: z.number(),
  OppositeTeamID: z.number(),
  ResponsableTeacherID: z.number().nullable(),
  DisciplineID: z.number(),
  TourneyID: z.number().optional(),
});

const eventInputSchema = createEventSchema;

export type { Event };
export type CreateEventInput = z.infer<typeof eventInputSchema>;
export type UpdateEventInput = Partial<CreateEventInput>;

// 2. Funciones de Fetching
const fetchEvents = async () => {
  try {
    // El backend devuelve []EventGetBareDTO directamente
    const res: any = await api.get("events").json();

    // Si viene envuelto en { data: [...] }, extraemos data, sino usamos res directo
    const data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;

    return z.array(eventBareSchema).parse(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const fetchEvent = async (id?: string) => {
  if (!id || id === "undefined") return null;
  try {
    // El backend devuelve []EventGetDTO (array de 1 elemento)
    const res: any = await api.get(`events/${id}`).json();

    // Manejo flexible: si es array tomamos el primero, si es {data: [obj]} tomamos el primero de data
    let data = res;

    if (res && typeof res === 'object' && 'data' in res) {
      data = res.data;
    }

    // Como tu servicio GetEventByID retorna un slice ([]), extraemos el primer elemento
    if (Array.isArray(data)) {
      data = data[0];
    }

    return eventDetailSchema.parse(data);
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

// 3. Hooks
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}

export function useEvent(id?: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      return await api.post("events/create", { json: data }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateEventInput }) => {
      if (!data) throw new Error("No se proporcionaron datos para actualizar");
      return await api.put(`events/edit/${id}`, { json: data }).json();
    },
    onSuccess: (_,variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", String(variables.id)] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`events/delete/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}