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
import { useDisciplines } from "@/hooks/use-disciplines"; // Importamos el nuevo hook

export default function Disciplinas() {
  const { data: disciplines, isLoading } = useDisciplines();

  return (
    <Table>
      <TableCaption>Lista de disciplinas disponibles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
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
          ))
        }

        {disciplines?.map((item) => (
          <TableRow key={item.ID}>
            <TableCell>{item.ID}</TableCell>
            <TableCell>{item.Nombre}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-blue-100 hover:bg-blue-200"
                >
                  <HammerIcon size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-red-100 hover:bg-red-200"
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