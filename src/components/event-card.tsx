"use client";

import { memo } from "react";
import { Event, EventBare } from "@/schemas/event"; // Importamos EventBare
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, HammerIcon, Trash2Icon, MapPinIcon } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
    // Aceptamos Event (que es el detallado) o EventBare (el de la lista)
    event: Event | EventBare;
    onDelete: (id: number) => void;
}

export const EventCard = memo(function EventCard({ event, onDelete }: EventCardProps) {
    const eventDate = new Date(event.Date || "");

    // Hacemos un cast a 'any' o 'Event' para acceder a propiedades que podrían no estar en el Bare (como Ubication)
    // De esta forma, si 'Ubication' viene undefined (como en la lista), simplemente no se renderiza.
    const fullEvent = event as Event;

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
            {/* Header: Disciplina y Fecha */}
            <div className="bg-slate-50 p-3 border-b flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider">{event.Discipline?.Name || "General"}</span>
                    {/* Solo mostramos Ubicación si existe en el objeto (en la lista Bare no saldrá, en detalle sí) */}
                    {fullEvent.Ubication && (
                        <span className="flex items-center gap-1 text-slate-400"><MapPinIcon size={12} /> {fullEvent.Ubication}</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <CalendarIcon size={12} />
                    <span>{eventDate.toLocaleDateString()}</span>
                    <span className="text-slate-300">|</span>
                    <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Nombre del Evento */}
            {event.Name && (
                <div className="px-4 pt-2 text-center">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider line-clamp-1">{event.Name}</span>
                </div>
            )}

            {/* Body: El Enfrentamiento */}
            <div className="p-4 pt-2 flex-1 flex items-center justify-between gap-2">
                {/* Local */}
                <div className="flex-1 text-center flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 ${event.HomeTeam?.Regular ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                        }`}>
                        {(event.HomeTeam?.Name || "L").charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{event.HomeTeam?.Name || "Local"}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center px-2">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {event.HomePoints} - {event.OppositePoints}
                    </div>
                    <Badge variant={event.Status === "Finalizado" ? "secondary" : "outline"} className="mt-1 text-[10px] h-5">
                        {event.Status}
                    </Badge>
                </div>

                {/* Visitante */}
                <div className="flex-1 text-center flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 ${event.OppositeTeam?.Regular ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>
                        {(event.OppositeTeam?.Name || "V").charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{event.OppositeTeam?.Name || "Visitante"}</span>
                </div>
            </div>

            {/* Footer: Acciones */}
            <div className="p-2 border-t flex justify-end gap-2 bg-slate-50/50">
                <Link href={`/eventos/${event.ID}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <HammerIcon size={16} />
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(event.ID)}
                >
                    <Trash2Icon size={16} />
                </Button>
            </div>
        </div>
    );
});

export default EventCard;
