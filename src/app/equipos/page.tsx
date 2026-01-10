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
import { HammerIcon, Trash2Icon, CheckIcon, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/hooks/use-teams";

export default function Equipos() {
  const { data: teams, isLoading } = useTeams();

  return (
    <Table>
      <TableCaption>Lista de equipos registrados.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Disciplina</TableHead>
          <TableHead>Universidad</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-center">Titular</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={6}>
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ))
        }

        {teams?.map((team) => (
          <TableRow key={team.ID}>
            <TableCell className="font-medium">{team.Nombre}</TableCell>
            <TableCell>{team.DisciplinaID}</TableCell>
            <TableCell>{team.UniversidadID}</TableCell>
            <TableCell>{team.Categoria}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                {team.Regular ? (
                  <CheckIcon className="text-green-500" size={20} />
                ) : (
                  <X className="text-red-500" size={20} />
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-blue-50 hover:bg-blue-200 text-blue-600"
                >
                  <HammerIcon size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-red-50 hover:bg-red-200 text-red-600"
                >
                  <Trash2Icon size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}