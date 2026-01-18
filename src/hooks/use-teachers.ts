// hooks/use-teachers.ts
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

const teacherSchema = z.object({
  ID: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  IdentityCard: z.number(),
  Email: z.string().email(),
  Telephone: z.string(),
});

const resSchema = z.object({
  data: z.array(teacherSchema),
  message: z.string(),
});

export type Teacher = z.infer<typeof teacherSchema>;

const fetchTeachers = async () => {
  // Ajusta la URL según tu API
  const res = await ky.get("http://localhost:8080/teachers").json();
  const parsed = resSchema.parse(res);
  return parsed.data;
};

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });
}