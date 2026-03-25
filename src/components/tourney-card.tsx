"use client";

import { useState, memo } from "react";
import { Tourney } from "@/schemas/tourney";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import EventCard from "@/components/event-card";
// Nota: Si 'date-fns' no se reconoce, asegúrate de haberlo instalado con: npm install date-fns
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TourneyCardProps {
    tourney: Tourney;
    totalEvents?: number;
    startDate?: Date;
    endDate?: Date;
}

export const TourneyCard = memo(function TourneyCard({ tourney, totalEvents, startDate, endDate }: TourneyCardProps) {
    console.log("no se quejesto " + tourney)
    const [showMatches, setShowMatches] = useState(false);

    // Colores según estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case "En Progreso": return "bg-green-500 hover:bg-green-600";
            case "Finalizado": return "bg-slate-700 hover:bg-slate-800";
            case "Cancelado": return "bg-red-500 hover:bg-red-600";
            default: return "bg-blue-500 hover:bg-blue-600"; // Pendiente
        }
    };

    const eventsCount = totalEvents || 0;

    // Función placeholder para onDelete, ya que EventCard la requiere
    const handleDelete = (id: number) => {
        console.log("Intento de eliminar evento con ID:", id);
    };

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
            {/* Header y Contenido */}
            <div className="p-4 border-b">
                <div className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            {tourney.Name}
                        </h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {(startDate && endDate) ? (
                                <span>
                                    {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
                                </span>
                            ) : (
                                <span>Fechas por definir</span>
                            )}
                        </div>
                    </div>
                    <Badge className={`${getStatusColor(tourney.Status)} text-white`}>
                        {tourney.Status}
                    </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">{eventsCount}</span> {eventsCount === 1 ? "Partido" : "Partidos"} programados
                </div>
            </div>

            {/* Footer desplegable */}
            <div className="flex flex-col items-stretch gap-2 border-t bg-slate-50/50 p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMatches(!showMatches);
                    }}
                    disabled={eventsCount === 0}
                >
                    {showMatches ? "Ocultar Partidos" : "Ver Partidos del Torneo"}
                    {showMatches ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {showMatches && tourney.Events && (
                    <div className="grid gap-4 mt-2 animate-in fade-in slide-in-from-top-2 pt-2">
                        {tourney.Events.length > 0 ? (
                            tourney.Events.map((event) => (
                                <div key={event.ID} className="scale-95 origin-top">
                                    <EventCard event={event} onDelete={handleDelete} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                No hay partidos registrados en este torneo.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});
