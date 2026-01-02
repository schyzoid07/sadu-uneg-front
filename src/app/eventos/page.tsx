'use client'
import * as z from "zod"; 
import ky from "ky";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Eventos() {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchTerm = searchParams.get("search") || "";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  

  const { data, isLoading } = useQuery({
    queryKey: ["events", searchTerm], 
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

      
      const res = await ky.get("http://localhost:8080/events/", {
        searchParams: { search: searchTerm }
      }).json();

      const parsed = resSchema.parse(res);
      return parsed.data;
    }
  });

  return (
    <div className="space-y-4">
      {/* Input de búsqueda añadido arriba de la tabla */}
      <div className="flex items-center justify-between gap-4 px-4">
        <Input
          placeholder="Buscar eventos..."
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button className="hover:bg-green-800 transition duration-200 bg-green-900 text-white font-bold py-2 px-4 rounded cursor-pointer">Añadir Evento</Button>
      </div>

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
                  <TableCell colSpan={3}> {/* Ajustado colSpan a 3 */}
                    <Skeleton className="w-full h-10"></Skeleton>
                  </TableCell>
                </TableRow>
              ))
            : null}
          {data ?
            data.map((evento) => ( // Cambiado nombre de iterador a 'evento' para evitar colisión
            <TableRow key={evento.ID}>
              <TableCell>{evento.ID}</TableCell>
              <TableCell>{evento.Nombre}</TableCell>
              <TableCell className="flex gap-2 justify-end">
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
    </div>
  );
}