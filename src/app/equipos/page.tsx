"use client";

import { useState } from "react";
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { HammerIcon, Trash2Icon, CheckIcon, X, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/hooks/use-teams";
import CrearEquipoForm from "@/components/equipo-form";

export default function Equipos() {
  const { data: teams, isLoading } = useTeams();
  
  // Estado para controlar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4 p-4">
      {/* 1. Encabezado con Título y Botón de Creación */}
      <div className="flex justify-between items-center px-2">
        <h1 className="text-xl font-bold text-slate-800">Gestión de Equipos</h1>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-800 text-white shadow-sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Equipo</DialogTitle>
            </DialogHeader>
            
            {/* Formulario que recibe la función para cerrar el modal */}
            <CrearEquipoForm onSuccess={() => setIsModalOpen(false)} />
            
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Contenedor de la Tabla */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>Lista de equipos deportivos registrados en el sistema.</TableCaption>
          <TableHeader className="bg-slate-50">
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
            {/* Skeletons para estado de carga */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                </TableRow>
              ))
            }

            {/* Renderizado de equipos */}
            {teams?.map((team) => (
              <TableRow key={team.ID} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{team.Nombre}</TableCell>
                <TableCell>{team.DisciplinaID}</TableCell>
                <TableCell>{team.UniversidadID}</TableCell>
                <TableCell>{team.Categoria}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {team.Regular ? (
                      <CheckIcon className="text-green-500" size={20} strokeWidth={3} />
                    ) : (
                      <X className="text-red-400" size={20} strokeWidth={3} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-blue-50 hover:bg-blue-200 text-blue-600"
                    >
                      <HammerIcon size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-red-50 hover:bg-red-200 text-red-600"
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}