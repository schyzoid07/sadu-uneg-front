// hooks/use-universities.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

const universitySchema = z.object({
  ID: z.number(),
  Nombre: z.string(),
  Local: z.boolean(),
});

const resSchema = z.object({
  data: z.array(universitySchema),
  message: z.string(),
});

export type University = z.infer<typeof universitySchema>;

const fetchUniversities = async () => {
  const res = await ky.get("http://localhost:8080/universities/").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useUniversities() {
  return useQuery({
    queryKey: ["universities"],
    queryFn: fetchUniversities,
  });
}