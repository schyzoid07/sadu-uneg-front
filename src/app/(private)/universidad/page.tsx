"use client";

import { useMemo, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, HammerIcon, PlusIcon, SearchIcon, Trash2Icon, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUniversities, useDeleteUniversity } from "@/hooks/universities/use-universities";
import UniversidadForm from "@/components/universidad-form";
import { University } from "@/schemas/universities";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function Universidad() {
  const { data: universities, isLoading, isError } = useUniversities();
  console.log(universities)
  const deleteMutation = useDeleteUniversity();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [openCreate, setOpenCreate] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [deletingUniversity, setDeletingUniversity] = useState<University | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const filteredUniversities = useMemo(() => {
    if (!universities) return [];
    if (!debouncedSearch) return universities;
    return universities.filter((u) =>
      u.Name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [universities, debouncedSearch]);

  const confirmDelete = async () => {
    if (!deletingUniversity) return;
    try {
      await deleteMutation.mutateAsync(deletingUniversity.ID);
      setOpenDelete(false);
      setDeletingUniversity(null);
    } catch (error) {
      console.error("Error al eliminar universidad:", error);
    }
  };

  if (isError) return (
    <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
      Error al cargar las universidades. Por favor, intenta de nuevo.
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 shrink-0">Universidades</h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative flex-1 md:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar universidad..."
              className="pl-9 bg-white h-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botón Crear con el estilo "azul claro" solicitado */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-2 h-10 px-4">
                <PlusIcon size={16} />
                <span className="hidden sm:inline">Nueva Universidad</span>
                <span className="sm:hidden">Añadir</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Universidad</DialogTitle>
              </DialogHeader>
              <UniversidadForm onSuccess={() => setOpenCreate(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>
            {filteredUniversities.length === 0 && !isLoading
              ? "No se encontraron universidades."
              : "Lista oficial de universidades registradas."}
          </TableCaption>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[80px]">Id</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-center">Local (UNEG)</TableHead>
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

            {/* Renderizado de datos */}
            {filteredUniversities?.map((uni) => (
              <TableRow key={uni.ID} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-muted-foreground">{uni.ID}</TableCell>
                <TableCell className="font-medium">{uni.Name}</TableCell>
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
                      className="bg-blue-50 hover:bg-blue-200 text-blue-600 h-8 w-8"
                      onClick={() => {
                        setEditingUniversity(uni);
                        setOpenEdit(true);
                      }}
                    >
                      <HammerIcon size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-red-50 hover:bg-red-200 text-red-600 h-8 w-8"
                      onClick={() => {
                        setDeletingUniversity(uni);
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
      </div>

      {/* Dialog para Editar */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Universidad</DialogTitle>
          </DialogHeader>
          <UniversidadForm
            university={editingUniversity}
            onSuccess={() => {
              setOpenEdit(false);
              setEditingUniversity(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-700">
              ¿Estás seguro que quieres eliminar la universidad <strong>{deletingUniversity?.Name}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}