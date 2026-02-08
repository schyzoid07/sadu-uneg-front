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
import { useDisciplines, Discipline } from "@/hooks/disciplines/use-disciplines";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DisciplinaForm from "@/components/disciplina-form";
import { useDeleteDiscipline } from "@/hooks/disciplines/use-delete-discipline";

export default function DisciplinasPage() {
  const { data: disciplines, isLoading, isError } = useDisciplines();
  const [openCreate, setOpenCreate] = useState(false);

  // Edición
  const [editing, setEditing] = useState<Discipline | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Eliminación
  const [deleting, setDeleting] = useState<Discipline | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const deleteMutation = useDeleteDiscipline();

  if (isError) return <p>Error al cargar las disciplinas...</p>;

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.ID, {
      onSuccess: () => {
        setOpenDelete(false);
        setDeleting(null);
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold">Disciplinas</h2>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shadow-sm flex items-center gap-2">
              <PlusIcon className="mr-2 h-4 w-4" /> Nueva Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Disciplina</DialogTitle>
            </DialogHeader>

            <DisciplinaForm
              onSuccess={() => {
                setOpenCreate(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>Lista de disciplinas registradas.</TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>ID</TableHead>
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
              ))}

            {disciplines?.map((d) => (
              <TableRow key={d.ID} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{d.ID}</TableCell>
                <TableCell>{d.Name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* EDITAR: HammerIcon abre diálogo de edición */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-blue-100 hover:bg-blue-200"
                      onClick={() => {
                        setEditing(d);
                        setOpenEdit(true);
                      }}
                    >
                      <HammerIcon size={16} />
                    </Button>

                    {/* BORRAR: Trash2Icon abre confirmación de borrado */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-red-100 hover:bg-red-200"
                      onClick={() => {
                        setDeleting(d);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div >

      {/* Dialog edición controlado */}
      < Dialog open={openEdit} onOpenChange={(val) => {
        setOpenEdit(val);
        if (!val) setEditing(null);
      }
      }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Disciplina</DialogTitle>
          </DialogHeader>

          {editing ? (
            <DisciplinaForm
              discipline={editing}
              onSuccess={() => {
                setOpenEdit(false);
                setEditing(null);
              }}
            />
          ) : (
            <p>No se encontró la disciplina seleccionada.</p>
          )}
        </DialogContent>
      </Dialog >

      {/* Dialog confirmación de borrado */}
      < Dialog open={openDelete} onOpenChange={(val) => {
        setOpenDelete(val);
        if (!val) setDeleting(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-slate-700">
              ¿Estás seguro que quieres eliminar la disciplina{" "}
              <strong>{deleting?.Name}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setOpenDelete(false); setDeleting(null); }}>
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