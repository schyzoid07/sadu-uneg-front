"use client";

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
import { HammerIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAthletes } from "@/hooks/use-athletes"; // Importamos el hook

export default function Atletas() {
  const { data: athletes, isLoading, isError } = useAthletes();

  if (isError) return <p>Error al cargar los atletas...</p>;

  return (
    <Table>
      <TableCaption>Lista de atletas registrados.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cedula</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="text-left">Correo</TableHead>
          <TableHead className="text-right">Telefono</TableHead>
          <TableHead className="text-right">Género</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && 
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={7}>
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ))
        }

        {athletes?.map((athlete) => (
          <TableRow key={athlete.ID}>
            <TableCell>{athlete.GovID}</TableCell>
            <TableCell>{athlete.FirstNames}</TableCell>
            <TableCell>{athlete.LastNames}</TableCell>
            <TableCell className="text-left">{athlete.Email}</TableCell>
            <TableCell className="text-right">{athlete.PhoneNum}</TableCell>
            <TableCell className="text-right">{athlete.Gender}</TableCell>
            <TableCell className="flex gap-2 justify-end">
              <Button
                size="icon"
                variant="ghost"
                className="bg-blue-100 hover:bg-blue-200"
              >
                <HammerIcon size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-red-100 hover:bg-red-200"
              >
                <Trash2Icon size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}