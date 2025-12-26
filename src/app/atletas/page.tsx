"use client";

import * as z from "zod/v4";
import ky from "ky";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { HammerIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Atletas() {
  const { data, isLoading } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const athletesSchema = z.array(
        z.object({
          ID: z.number(),
          CreatedAt: z.coerce.date(),
          UpdatedAt: z.coerce.date(),
          DeletedAt: z.coerce.date().nullable(),
          FirstNames: z.string(),
          LastNames: z.string(),
          PhoneNum: z.string(),
          Email: z.email(),
          Gender: z.string(),
          InscriptionDate: z.coerce.date().nullable(),
          Regular: z.boolean(),
          GovID: z.string(),
          MajorID: z.number(),
        })
      );

      const resSchema = z.object({
        data: athletesSchema,
        message: z.string(),
      });

      const res = await ky.get("http://localhost:8080/athletes/").json();

      const parsed = resSchema.parse(res);

      return parsed.data;
    },
  });

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cedula</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="text-left">Correo</TableHead>
          <TableHead className="text-right">Telefono</TableHead>
          <TableHead className="text-right">genero</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <Skeleton className="w-full h-10"></Skeleton>
                </TableCell>
              </TableRow>
            ))
          : null}
        {data
          ? data.map((data) => (
              <TableRow key={data.ID}>
                <TableCell>{data.GovID}</TableCell>
                <TableCell>{data.FirstNames}</TableCell>
                <TableCell>{data.LastNames}</TableCell>
                <TableCell className="text-left">{data.Email}</TableCell>
                <TableCell className="text-right">{data.PhoneNum}</TableCell>
                <TableCell className="text-right">{data.Gender}</TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-blue-100 hover:bg-blue-200 "
                  >
                    <HammerIcon />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-red-100 hover:bg-red-200"
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
