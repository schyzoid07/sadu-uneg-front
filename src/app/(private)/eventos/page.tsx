"use client";

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
import { HammerIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEvents } from "@/hooks/events/use-events";

export default function Eventos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchTerm = searchParams.get("search") || "";

  // Lógica de navegación (URL)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Hook personalizado
  const { data: events, isLoading } = useEvents(searchTerm);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 px-4">
        <Input
          placeholder="Buscar eventos..."
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button className="bg-green-900 hover:bg-green-800 text-white font-bold transition duration-200">
          Añadir Evento
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de eventos deportivos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}>
                  <Skeleton className="w-full h-10" />
                </TableCell>
              </TableRow>
            ))}

          {events?.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell className="font-mono">{evento.id}</TableCell>
              <TableCell>{evento.name}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                  <HammerIcon size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-red-100 hover:bg-red-200 text-red-700"
                >
                  <Trash2Icon size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}