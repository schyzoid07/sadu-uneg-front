"use client";

import { useMemo, useState } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";

export default function Atletas() {
  const { data: athletes, isLoading, isError } = useAthletes();
  const [openCreate, setOpenCreate] = useState(false);

  //logica de filtrado
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 400)

  const filteredAthletes = useMemo(() => {
    if (!athletes) return [];
    if (!debouncedSearch) return athletes;

    const lowerSearch = debouncedSearch.toLowerCase()

    return athletes.filter((a) => {
      return (
        a.FirstNames.toLowerCase().includes(lowerSearch) ||
        a.LastNames.toLowerCase().includes(lowerSearch) ||
        a.GovID.toLowerCase().includes(lowerSearch)
      )
    })
  }, [athletes, debouncedSearch])

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

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/*input de busqueda */}
          <div className="relative w-full sm:w-64">
            <search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar por nombre o cédula..."
              className="block w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
          <TableCaption>
            {filteredAthletes.length === 0 && !isLoading
              ? "No se encontraron atletas con ese criterio."
              : "Lista de atletas registrados."}
          </TableCaption>
          <TableHeader className="">
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

            {filteredAthletes?.map((athlete) => (

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