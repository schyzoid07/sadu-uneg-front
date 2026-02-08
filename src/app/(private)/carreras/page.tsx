"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
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
import { Trash2Icon, PlusIcon, EyeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Major, useMajors } from "@/hooks/majors/use-major";
import Link from "next/link";

import { useDeleteMajor } from "@/hooks/majors/use-delete-major";


export default function Carreras() {
    const { data: majors, isLoading, isError } = useMajors();

    //logica de filtrado
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 400)

    const filteredMajors = useMemo(() => {
        if (!majors) return [];
        if (!debouncedSearch) return majors;

        const lowerSearch = debouncedSearch.toLowerCase()

        return majors.filter((m) => {
            return (
                m.Name.toLowerCase().includes(lowerSearch)
            )
        })
    }, [majors, debouncedSearch])



    //eliminacion
    const [deletingMajor, setDeletingMajor] = useState<Major | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const deleteMutation = useDeleteMajor();

    if (isError) return <p>Error al cargar las carreras...</p>;

    const confirmDelete = () => {
        if (!deletingMajor) return;
        deleteMutation.mutate(deletingMajor.ID, {
            onSuccess: () => {
                setOpenDelete(false);
                setDeletingMajor(null);
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
                            Crear Carrera
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Crear nueva Carrera</DialogTitle>
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
                    <TableCaption>{filteredMajors.length === 0 && !isLoading
                        ? "No se encontraron carreras con ese criterio."
                        : "Lista de Carreras disponibles."}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Nombre</TableHead>

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
                            ))
                        }

                        {filteredMajors?.map((major) => (
                            <TableRow key={major.ID}>
                                <TableCell>{major.ID}</TableCell>
                                <TableCell>{major.Name}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/*boton para ver detalles de carrera*/}
                                        <Link href={`/atletas/${major.ID}`} passHref>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="bg-blue-100 hover:bg-blue-200"

                                            >
                                                <EyeIcon size={16} />
                                            </Button>
                                        </Link>

                                        {/*boton para borrar */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-red-100 hover:bg-red-200"
                                        >
                                            <Trash2Icon size={18} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog de confirmación de eliminación */}
            < Dialog open={openDelete} onOpenChange={(val) => {
                setOpenDelete(val);
                if (!val) setDeletingMajor(null);
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-slate-700">
                            ¿Estás seguro que quieres eliminar al atleta
                            <strong>{deletingMajor?.Name}</strong>?
                            Esta acción no se puede deshacer.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => { setOpenDelete(false); setDeletingMajor(null); }}>
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