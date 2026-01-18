// hooks/use-events.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

const eventSchema = z.object({
  ID: z.number(),
  Nombre: z.string(),
});

const resSchema = z.object({
  data: z.array(eventSchema),
  message: z.string(),
});

export type Evento = z.infer<typeof eventSchema>;

const fetchEvents = async (searchTerm: string) => {
  const res = await ky
    .get("http://localhost:8080/events", {
      searchParams: searchTerm ? { search: searchTerm } : undefined,
    })
    .json();

  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useEvents(searchTerm: string) {
  return useQuery({
    // Importante: la queryKey depende de searchTerm
    queryKey: ["events", searchTerm],
    queryFn: () => fetchEvents(searchTerm),
  });
}