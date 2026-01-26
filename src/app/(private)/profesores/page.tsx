"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { HammerIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeachers } from "@/hooks/teachers/use-teachers";

export default function Profesores() {
  const { data: teachers, isLoading } = useTeachers();

  return (
    <Table>
      <TableCaption>Lista de atletas registrados.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cédula</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="text-left">Correo</TableHead>
          <TableHead className="text-right">Teléfono</TableHead>
          <TableHead></TableHead>
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
          <TableRow key={teacher.id}>
            <TableCell>{teacher.gov_id}</TableCell>
            <TableCell>{teacher.first_names}</TableCell>
            <TableCell>{teacher.last_names}</TableCell>
            <TableCell className="text-left">{teacher.email}</TableCell>
            <TableCell className="text-right">{teacher.phone_num}</TableCell>
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