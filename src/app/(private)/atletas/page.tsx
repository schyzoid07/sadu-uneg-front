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
import { Trash2Icon, PlusIcon, EyeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAthletes, Athletes, Athlete } from "@/hooks/athletes/use-athletes"; // Importamos el hook y tipo
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CrearAtletaForm from "@/components/atleta-form";
import { useDeleteAthlete } from "@/hooks/athletes/use-delete-athlete";
import Link from "next/link";

export default function Atletas() {
  const { data: athletes, isLoading, isError } = useAthletes();
  const [openCreate, setOpenCreate] = useState(false);



  // Eliminación
  const [deletingAthlete, setDeletingAthlete] = useState<Athletes | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const deleteMutation = useDeleteAthlete();

  if (isError) return <p>Error al cargar los atletas...</p>;

  const confirmDelete = () => {
    if (!deletingAthlete) return;
    deleteMutation.mutate(deletingAthlete.ID, {
      onSuccess: () => {
        setOpenDelete(false);
        setDeletingAthlete(null);
      },
    });
  };

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
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <CrearAtletaForm
                onSuccess={() => {
                  setOpenCreate(false);
                }}
              /></div>

          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>Lista de atletas registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Cedula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead className="text-left">Correo</TableHead>
              <TableHead className="text-right">Telefono</TableHead>
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
                <TableCell className="text-right">{athlete.PhoneNumber}</TableCell>
                <TableCell className="flex gap-2 justify-end">

                  {/*Boton para ver  detalles de un atleta*/}
                  <Link href={`/atletas/${athlete.ID}`} passHref>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-blue-100 hover:bg-blue-200"

                    >
                      <EyeIcon size={16} />
                    </Button>
                  </Link>

                  {/* Botón para BORRAR usando HammerIcon */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-red-100 hover:bg-red-200"
                    onClick={() => {
                      setDeletingAthlete(athlete);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2Icon size={16} />
                  </Button>


                </TableCell>

              </TableRow>

            ))}
          </TableBody>
        </Table>
      </div >


      {/* Dialog de confirmación de eliminación */}
      < Dialog open={openDelete} onOpenChange={(val) => {
        setOpenDelete(val);
        if (!val) setDeletingAthlete(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-slate-700">
              ¿Estás seguro que quieres eliminar al atleta{" "}
              <strong>{deletingAthlete?.FirstNames} {deletingAthlete?.LastNames}</strong> (Cédula: {deletingAthlete?.GovID})?
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setOpenDelete(false); setDeletingAthlete(null); }}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
}