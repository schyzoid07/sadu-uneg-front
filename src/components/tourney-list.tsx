"use client";

import { useMemo, useState } from "react";
import { useTourneys, useDeleteTourney, Tourney } from "@/hooks/tourneys/use-tourneys";
import { TourneyCard } from "@/components/tourney-card";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TourneyListProps {
    searchTerm?: string;
    selectedDiscipline?: string;
    selectedTeam?: string;
}

export function TourneyList({ searchTerm, selectedDiscipline }: TourneyListProps) {
    const { data: tourneys, isLoading, isError } = useTourneys();
    const deleteMutation = useDeleteTourney();

    const [deletingTourney, setDeletingTourney] = useState<Tourney | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

    console.log("TourneyList - Data recibida del hook:", tourneys);

    const filteredTourneys = useMemo(() => {
        if (!tourneys) return [];

        let result = tourneys;

        // 1. Filtrar por nombre del torneo
        if (searchTerm) {
            result = result.filter(tourney =>
                tourney.Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filtrar por disciplina
        if (selectedDiscipline) {
            result = result.filter(tourney =>
                tourney.Events?.some(event =>
                    (event.Discipline?.ID?.toString()) === selectedDiscipline
                )
            );
        }

        return result;
    }, [tourneys, searchTerm, selectedDiscipline,]);

    console.log("TourneyList - Data filtrada a renderizar:", filteredTourneys);

    const handleConfirmDelete = async () => {
        if (!deletingTourney) return;
        try {
            await deleteMutation.mutateAsync(deletingTourney.ID);
            setOpenDelete(false);
            setDeletingTourney(null);
        } catch (error) {
            console.error("Error deleting tourney:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
                Error al cargar los torneos. Por favor intente nuevamente.
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredTourneys?.map((tourney) => (
                    <Link key={tourney.ID} href={`/torneos/${tourney.ID}`} className="block h-full">
                        <TourneyCard
                            tourney={tourney}
                            totalEvents={tourney.TotalEvents}
                            startDate={tourney.StartDate}
                            endDate={tourney.EndDate}
                            onDelete={() => {
                                setDeletingTourney(tourney);
                                setOpenDelete(true);
                            }}
                        />
                    </Link>
                ))}
                {filteredTourneys?.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-8">No se encontraron torneos con los filtros aplicados.</p>
                )}
            </div>

            {/* Dialog de confirmación de eliminación */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-700">
                            ¿Estás seguro que quieres eliminar el torneo <strong>{deletingTourney?.Name}</strong>? Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar Torneo"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
