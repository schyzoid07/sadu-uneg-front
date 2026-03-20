"use client";

import { Event } from "@/schemas/event";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, HammerIcon, Trash2Icon, MapPinIcon } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
    event: Event;
    onDelete: (id: number) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
    const eventDate = new Date(event.Date);

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
            {/* Header: Disciplina y Fecha */}
            <div className="bg-slate-50 p-3 border-b flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider">{event.Discipline?.Name || "General"}</span>
                    {event.Ubication && (
                        <span className="flex items-center gap-1 text-slate-400"><MapPinIcon size={12} /> {event.Ubication}</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <CalendarIcon size={12} />
                    <span>{eventDate.toLocaleDateString()}</span>
                    <span className="text-slate-300">|</span>
                    <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Body: El Enfrentamiento */}
            <div className="p-4 flex-1 flex items-center justify-between gap-2">
                {/* Local */}
                <div className="flex-1 text-center flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mb-1">
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
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-lg mb-1">
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
}