"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useTourney, useCreateTourney, useUpdateTourney } from "@/hooks/tourneys/use-tourneys";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useEvents } from "@/hooks/events/use-events";
import Link from "next/link";
import EventCard from "@/components/event-card";
import { Badge } from "@/components/ui/badge";

// Función vacía estable para evitar re-renders innecesarios en EventCard
const noop = () => { };

interface TourneyFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    tourneyId?: string;
}

export function TourneyForm({ tourneyId, onSuccess, onCancel }: TourneyFormProps) {
    const isEditMode = !!tourneyId;

    // Hooks de datos
    const { data: tourney, isLoading: isLoadingTourney } = useTourney(tourneyId);
    console.log(tourney)
    const { data: events, isLoading: isLoadingEvents } = useEvents(); // Obtenemos todos los eventos disponibles
    const { data: disciplines } = useDisciplines();
    const createMutation = useCreateTourney();
    const updateMutation = useUpdateTourney();

    // Estados del formulario
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Pendiente");
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
    const [filterDisciplineId, setFilterDisciplineId] = useState<string>("all");
    const [message, setMessage] = useState<string | null>(null);

    // Cargar datos al editar
    useEffect(() => {
        if (tourney) {
            setName(tourney.Name);
            setStatus(tourney.Status);

            // Si el torneo ya tiene eventos asociados, extraemos sus IDs para marcarlos como seleccionados
            if (tourney.Events && Array.isArray(tourney.Events)) {
                setSelectedEventIds(tourney.Events.map(e => e.ID));
            }
        }
    }, [tourney]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isFormValid = name.length > 0;

    // Manejador para seleccionar/deseleccionar eventos
    const toggleEventSelection = useCallback((eventId: number) => {
        setSelectedEventIds(prev => {
            if (prev.includes(eventId)) {
                return prev.filter(id => id !== eventId);
            } else {
                return [...prev, eventId];
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Construir payload
        const payload = {
            Name: name,
            Status: status as "Activo" | "Finalizado" | "Pendiente",
            EventIDs: selectedEventIds,
            StartDate: tourney?.StartDate,
            EndDate: tourney?.EndDate,

        };

        try {
            if (isEditMode && tourney) {
                await updateMutation.mutateAsync({ id: tourney.ID, data: payload });
                setMessage("Torneo actualizado correctamente.");
            } else {
                await createMutation.mutateAsync(payload);
                setMessage("Torneo creado correctamente.");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving tourney:", error);
            setMessage("Error al guardar el torneo.");
        }
    };

    if (isEditMode && isLoadingTourney) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de feedback */}
            {message && (
                <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                    <Label>Nombre del Torneo</Label>
                    <Input
                        placeholder="Ej: Copa Rector"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Finalizado">Finalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Selección de Eventos */}
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-base">Seleccionar Partidos ({selectedEventIds.length})</Label>
                        <Badge variant="outline" className="font-normal hidden sm:inline-flex">
                            Click para seleccionar
                        </Badge>
                    </div>

                    {/* Filtro de Disciplina */}
                    <div className="w-full md:w-64">
                        <Select value={filterDisciplineId} onValueChange={setFilterDisciplineId}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Filtrar por disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las disciplinas</SelectItem>
                                {disciplines?.map(d => (
                                    <SelectItem key={d.ID} value={d.ID.toString()}>{d.Name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoadingEvents ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2 border rounded-lg bg-slate-50/50">
                        {events?.filter(event => {
                            const dId = event.Discipline?.ID;
                            return filterDisciplineId === "all" || dId?.toString() === filterDisciplineId;
                        }).map((event) => {
                            const isSelected = selectedEventIds.includes(event.ID);
                            return (
                                <div
                                    key={event.ID}
                                    onClick={() => toggleEventSelection(event.ID)}
                                    className={`relative cursor-pointer transition-all duration-200 rounded-xl border-2 ${isSelected ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/10" : "border-transparent opacity-90 hover:opacity-100"}`}
                                >
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="pointer-events-none select-none">
                                        <EventCard event={event} onDelete={noop} />
                                    </div>
                                </div>
                            );
                        })}
                        {events?.length === 0 && (
                            <p className="col-span-full text-center text-muted-foreground py-8">
                                No hay partidos disponibles.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                {onCancel ? (
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancelar
                    </Button>
                ) : (
                    <Link href="/torneos">
                        <Button variant="outline" type="button">
                            Cancelar / Volver
                        </Button>
                    </Link>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? "Guardar Cambios" : "Crear Torneo"}
                </Button>
            </div>
        </form>
    );
}