"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Event } from "@/schemas/event";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EventCalendarProps {
    events: Event[];
}

export default function EventCalendar({ events = [] }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(currentDate);
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month); // 0 (Domingo) a 6 (Sábado)

    // Ajustar para que la semana empiece en Lunes (si se prefiere) o Domingo. 
    // Aquí usaremos Domingo como 0 para simplificar con getDay().

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getEventsForDay = (day: number) => {
        return events.filter((event) => {
            if (!event.Date) return false;
            const eventDate = new Date(event.Date);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });
    };

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);

    return (
        <div className="bg-white rounded-lg shadow border p-4">
            {/* Cabecera del Calendario */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="h-8 w-8 text-blue-600" />
                    {capitalizedMonthName}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grilla del Calendario */}
            <div className="grid grid-cols-7 gap-px bg-slate-600 border border-slate-800 rounded-lg overflow-hidden">
                {/* Días de la semana */}
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="bg-slate-50 p-2 text-center text-sm font-bold text-slate-800">
                        {day}
                    </div>
                ))}

                {/* Celdas vacías previas */}
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
                ))}

                {/* Días del mes */}
                {daysArray.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    return (
                        <div key={day} className="bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors flex flex-col gap-1 border-t sm:border-t-0">
                            <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                                ? "bg-blue-600 text-white"
                                : "text-slate-700"
                                }`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1 mt-1">
                                {dayEvents.map((event) => (
                                    <Dialog key={event.ID}>
                                        <DialogTrigger asChild>
                                            <div className="text-[10px] sm:text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200 transition-colors">
                                                {event.Name}
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{event.Name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Fecha:</strong> {new Date(event.Date).toLocaleDateString()}</p>
                                                <p><strong>Disciplina:</strong> {event.Discipline?.Name || "Sin asignar"}</p>
                                                <p><strong>Estado:</strong> <Badge variant="outline">{event.Status}</Badge></p>
                                                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-md">
                                                    <div className="text-center">
                                                        <p className="font-bold text-lg">{event.HomeTeam?.Name || "Equipo Local"}</p>
                                                        <p className="text-2xl font-black">{event.HomePoints}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-lg">{event.OppositeTeam?.Name || "Equipo Visitante"}</p>
                                                        <p className="text-2xl font-black">{event.OppositePoints}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
