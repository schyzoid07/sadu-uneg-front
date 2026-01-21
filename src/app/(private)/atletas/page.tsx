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
import { HammerIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAthletes, Athlete } from "@/hooks/use-athletes"; // Importamos el hook y tipo
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CrearAtletaForm from "@/components/atleta-form";

export default function Atletas() {
  const { data: athletes, isLoading, isError } = useAthletes();
  const [openCreate, setOpenCreate] = useState(false);

  // Edición
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  if (isError) return <p>Error al cargar los atletas...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Atletas</h2>

        {/* Botón Crear */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusIcon size={16} />
              Crear Atleta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear nuevo atleta</DialogTitle>
            </DialogHeader>
            <CrearAtletaForm
              onSuccess={() => {
                setOpenCreate(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

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
            ))}

          {athletes?.map((athlete) => (
            <TableRow key={athlete.ID}>
              <TableCell>{athlete.GovID}</TableCell>
              <TableCell>{athlete.FirstNames}</TableCell>
              <TableCell>{athlete.LastNames}</TableCell>
              <TableCell className="text-left">{athlete.Email}</TableCell>
              <TableCell className="text-right">{athlete.PhoneNum}</TableCell>
              <TableCell className="text-right">{athlete.Gender}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                {/* Botón para editar: abre diálogo controlado pasando el atleta */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-blue-100 hover:bg-blue-200"
                  onClick={() => {
                    setEditingAthlete(athlete);
                    setOpenEdit(true);
                  }}
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

      {/* Dialog de edición controlado */}
      <Dialog open={openEdit} onOpenChange={(val) => {
        setOpenEdit(val);
        if (!val) setEditingAthlete(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar atleta</DialogTitle>
          </DialogHeader>

          {/* Pasamos el atleta a editar; si es null mostramos mensaje */}
          {editingAthlete ? (
            <CrearAtletaForm
              athlete={editingAthlete}
              onSuccess={() => {
                setOpenEdit(false);
                setEditingAthlete(null);
              }}
            />
          ) : (
            <p>No se encontró el atleta seleccionado.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}