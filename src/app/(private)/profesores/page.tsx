"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HammerIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeachers } from "@/hooks/use-teachers";

export default function Profesores() {
  const { data: teachers, isLoading } = useTeachers();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cédula</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="text-left">Correo</TableHead>
          <TableHead className="text-right">Teléfono</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Estado de Carga */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={6}>
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ))}

        {/* Mapeo de Datos Reales */}
        {teachers?.map((teacher) => (
          <TableRow key={teacher.ID}>
            <TableCell>{teacher.IdentityCard}</TableCell>
            <TableCell>{teacher.FirstName}</TableCell>
            <TableCell>{teacher.LastName}</TableCell>
            <TableCell className="text-left">{teacher.Email}</TableCell>
            <TableCell className="text-right">{teacher.Telephone}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}