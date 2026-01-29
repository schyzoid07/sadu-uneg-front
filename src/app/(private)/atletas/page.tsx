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
import { useAthletes, Athlete } from "@/hooks/athletes/use-athletes"; // Importamos el hook y tipo
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

  // Edición (se mantiene si lo usas)
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Eliminación
  const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const deleteMutation = useDeleteAthlete();

  if (isError) return <p>Error al cargar los atletas...</p>;

  const confirmDelete = () => {
    if (!deletingAthlete) return;
    deleteMutation.mutate(deletingAthlete.id, {
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
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4"><CrearAtletaForm
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

              <TableRow key={athlete.id}>
                <Link href="#">
                  <TableCell>{athlete.id_personal}</TableCell>
                  <TableCell>{athlete.name}</TableCell>
                  <TableCell>{athlete.lastname}</TableCell>
                  <TableCell className="text-left">{athlete.email}</TableCell>
                  <TableCell className="text-right">{athlete.phonenumber}</TableCell>
                  <TableCell className="flex gap-2 justify-end">

                    {/* Mantengo Trash2Icon (puedes reasignarlo o eliminarlo) */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-blue-100 hover:bg-blue-200"
                      onClick={() => {
                        // ejemplo: abrir edición si lo deseas
                        setEditingAthlete(athlete);
                        setOpenEdit(true);
                      }}
                    >
                      <HammerIcon size={16} />
                    </Button>

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
                </Link>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </div >
      {/* Dialog de edición controlado (si lo usas) */}
      < Dialog open={openEdit} onOpenChange={(val) => {
        setOpenEdit(val);
        if (!val) setEditingAthlete(null);
      }
      }>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar atleta</DialogTitle>
          </DialogHeader>

          {editingAthlete ? (
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4"> <CrearAtletaForm
              athlete={editingAthlete}
              onSuccess={() => {
                setOpenEdit(false);
                setEditingAthlete(null);
              }}
            /> </div>
          ) : (
            <p>No se encontró el atleta seleccionado.</p>
          )}
        </DialogContent>
      </Dialog >

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
              <strong>{deletingAthlete?.name} {deletingAthlete?.lastname}</strong> (Cédula: {deletingAthlete?.id_personal})?
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setOpenDelete(false); setDeletingAthlete(null); }}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
}