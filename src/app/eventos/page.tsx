'use client'
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

export default function Eventos() {
 const {data, isLoading} = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const eventsSchema = z.array(
        z.object({
          ID: z.number(),
          Nombre: z.string(),
        })
      );

      const resSchema = z.object({
        data: eventsSchema,
        message: z.string(),
      });

      const res = await ky.get("http://localhost:8080/events/").json();

      const parsed = resSchema.parse(res);

      return parsed.data;
  }});

  
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>

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
        {data ?
         data.map((data) => (
          <TableRow key={data.ID}>
            <TableCell>{data.ID}</TableCell>
            <TableCell>{data.Nombre}</TableCell>
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

    //add buttons of "añadir and delete"
  );
}