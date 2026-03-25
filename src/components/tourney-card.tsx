"use client";

import { memo } from "react";
import { Tourney } from "@/schemas/tourney";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy, Trash2 } from "lucide-react";
// Nota: Si 'date-fns' no se reconoce, asegúrate de haberlo instalado con: npm install date-fns
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TourneyCardProps {
    tourney: Tourney;
    totalEvents?: number;
    startDate?: Date;
    endDate?: Date;
    onDelete?: (id: number) => void;
}

export const TourneyCard = memo(function TourneyCard({ tourney, totalEvents, startDate, endDate, onDelete }: TourneyCardProps) {
    console.log("no se quejesto " + tourney)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete(tourney.ID);
    };

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

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col group relative">
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
                    <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(tourney.Status)} text-white`}>
                            {tourney.Status}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={handleDeleteClick}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">{eventsCount}</span> {eventsCount === 1 ? "Partido" : "Partidos"} programados
                </div>
            </div>



        </div>
    );
});
