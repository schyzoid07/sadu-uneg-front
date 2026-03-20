"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Input
} from "@/components/ui/input";
import { EyeIcon, Trash2Icon, PlusIcon, SearchIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteTeacher,
  useTeachers,
} from "@/hooks/teachers/use-teachers";
import TeacherForm from "@/components/teacher-form";

export default function Profesores() {
  const { data: teachers, isLoading } = useTeachers();
  const deleteTeacher = useDeleteTeacher();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  // Lógica de filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    if (!debouncedSearch) return teachers;
    const lowerSearch = debouncedSearch.toLowerCase();
    return teachers.filter((t) =>
      t.FirstNames.toLowerCase().includes(lowerSearch) ||
      t.LastNames.toLowerCase().includes(lowerSearch) ||
      t.GovID.toLowerCase().includes(lowerSearch)
    );
  }, [teachers, debouncedSearch]);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTeacher.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Profesores</h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Input de búsqueda */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o cédula..."
              className="pl-8 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusIcon size={16} />
                Nuevo Profesor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Profesor</DialogTitle>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto px-1">
                <TeacherForm onSuccess={() => setIsOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>
            {filteredTeachers.length === 0 && !isLoading
              ? "No se encontraron profesores con ese criterio."
              : "Lista de profesores registrados."}
          </TableCaption>
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
            {filteredTeachers?.map((teacher) => (
              <TableRow key={teacher.ID}>
                <TableCell>{teacher.GovID}</TableCell>
                <TableCell>{teacher.FirstNames}</TableCell>
                <TableCell>{teacher.LastNames}</TableCell>
                <TableCell className="text-left">{teacher.Email}</TableCell>
                <TableCell className="text-right">{teacher.PhoneNumber}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link href={`/profesores/${teacher.ID}`}>
                      <Button size="icon" variant="ghost" className="bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <EyeIcon size={18} />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-red-100 hover:bg-red-200 text-red-700"
                      onClick={() => setDeleteId(teacher.ID)}
                      disabled={deleteTeacher.isPending}
                    >
                      <Trash2Icon size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-slate-700">
                ¿Estás seguro que quieres eliminar este profesor? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button onClick={confirmDelete} disabled={deleteTeacher.isPending} className="bg-red-600 hover:bg-red-700">
                {deleteTeacher.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
