"use client";

import { useMemo } from "react";
import { useTourneys } from "@/hooks/tourneys/use-tourneys";
import { TourneyCard } from "@/components/tourney-card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface TourneyListProps {
    searchTerm?: string;
    selectedDiscipline?: string;
    selectedTeam?: string;
}

export function TourneyList({ searchTerm, selectedDiscipline, selectedTeam }: TourneyListProps) {
    const { data: tourneys, isLoading, isError } = useTourneys();

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
                    (event.Discipline?.ID?.toString() ?? event.DisciplineID?.toString()) === selectedDiscipline
                )
            );
        }

        // 3. Filtrar por equipo participante
        if (selectedTeam) {
            result = result.filter(tourney =>
                tourney.Events?.some(event =>
                    (event.HomeTeam?.ID?.toString() ?? event.HomeTeamID?.toString()) === selectedTeam ||
                    (event.OppositeTeam?.ID?.toString() ?? event.OppositeTeamID?.toString()) === selectedTeam
                )
            );
        }

        return result;
    }, [tourneys, searchTerm, selectedDiscipline, selectedTeam]);

    console.log("TourneyList - Data filtrada a renderizar:", filteredTourneys);

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
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTourneys?.map((tourney) => (
                <Link key={tourney.ID} href={`/torneos/${tourney.ID}`} className="block h-full">
                    <TourneyCard tourney={tourney} totalEvents={tourney.TotalEvents} startDate={tourney.StartDate} endDate={tourney.EndDate} />
                </Link>
            ))}
            {filteredTourneys?.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-8">No se encontraron torneos con los filtros aplicados.</p>
            )}
        </div>
    );
}
