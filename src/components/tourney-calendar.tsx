"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Tourney } from "@/schemas/tourney";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TourneyCalendarProps {
    tourneys: Tourney[];
}

export default function TourneyCalendar({ tourneys = [] }: TourneyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(currentDate);
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getTourneysForDay = (day: number) => {
        const checkDate = new Date(year, month, day);
        checkDate.setHours(0, 0, 0, 0);

        return tourneys.filter((tourney) => {
            if (!tourney.StartDate || !tourney.EndDate) return false;

            const start = new Date(tourney.StartDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(tourney.EndDate);
            end.setHours(23, 59, 59, 999);

            return checkDate >= start && checkDate <= end;
        });
    };

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);

    return (
        <div className="bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {capitalizedMonthName} (Torneos)
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

            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="bg-slate-50 p-2 text-center text-sm font-semibold text-slate-600">
                        {day}
                    </div>
                ))}

                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
                ))}

                {daysArray.map((day) => {
                    const dayTourneys = getTourneysForDay(day);
                    return (
                        <div key={day} className="bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors flex flex-col gap-1 border-t sm:border-t-0">
                            <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                                ? "bg-blue-600 text-white"
                                : "text-slate-700"
                                }`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1 mt-1">
                                {dayTourneys.map((tourney) => (
                                    <Dialog key={tourney.ID}>
                                        <DialogTrigger asChild>
                                            <div className="text-[10px] sm:text-xs px-1.5 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-200 truncate cursor-pointer hover:bg-yellow-200 transition-colors" title={tourney.Name}>
                                                🏆 {tourney.Name}
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                                    {tourney.Name}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <p><strong>Estado:</strong> <Badge variant="outline">{tourney.Status}</Badge></p>
                                                    <p><strong>Inicio:</strong> {tourney.StartDate ? format(new Date(tourney.StartDate), "PPP", { locale: es }) : "N/A"}</p>
                                                    <p><strong>Fin:</strong> {tourney.EndDate ? format(new Date(tourney.EndDate), "PPP", { locale: es }) : "N/A"}</p>
                                                </div>

                                                {tourney.Events && tourney.Events.length > 0 && (
                                                    <div className="mt-4">
                                                        <p className="font-semibold mb-2">Partidos incluidos:</p>
                                                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                                                            {tourney.Events.map(e => (
                                                                <li key={e.ID}>{e.Name || `Partido #${e.ID}`}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
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