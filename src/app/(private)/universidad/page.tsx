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
import { CheckIcon, HammerIcon, Trash2Icon, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUniversities } from "@/hooks/universities/use-universities";

export default function Universidad() {
  const { data: universities, isLoading } = useUniversities();

  return (
    <Table>
      <TableCaption>Lista oficial de universidades registradas.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-center">Local</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Skeleton para estado de carga */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={4}>
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ))}

        {/* Renderizado de datos de la API */}
        {universities?.map((uni) => (
          <TableRow key={uni.ID}>
            <TableCell className="font-mono text-muted-foreground">{uni.ID}</TableCell>
            <TableCell className="font-medium">{uni.Nombre}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                {uni.Local ? (
                  <CheckIcon className="text-green-600" size={20} />
                ) : (
                  <X className="text-red-400" size={20} />
                )}
              </div>
            </TableCell>
            <TableCell>
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