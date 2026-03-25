"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
    const { data: events, isLoading: isLoadingEvents } = useEvents(); // Obtenemos todos los eventos disponibles
    console.log(tourneyId)
    const createMutation = useCreateTourney();
    const updateMutation = useUpdateTourney();

    // Estados del formulario
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Pendiente");
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    // Cargar datos al editar
    useEffect(() => {
        if (tourney) {
            setName(tourney.Name || "");
            setStatus(tourney.Status || "Pendiente");

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

    // Creamos un Set para búsquedas O(1) dentro del render
    const selectedIdsSet = useMemo(() => new Set(selectedEventIds), [selectedEventIds]);

    // Memoizamos la lista renderizada para que solo se recalcule si cambian los eventos o la selección
    const renderedEvents = useMemo(() => {
        if (!events) return null;
        if (events.length === 0) {
            return (
                <p className="col-span-full text-center text-muted-foreground py-8">
                    No hay eventos disponibles para agregar. Crea eventos primero.
                </p>
            );
        }

        return events.map((event) => {
            const isSelected = selectedIdsSet.has(event.ID);
            return (
                <div
                    key={event.ID}
                    onClick={() => toggleEventSelection(event.ID)}
                    className={`relative cursor-pointer transition-all duration-200 rounded-xl border-2 ${isSelected ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/10" : "border-transparent opacity-90 hover:opacity-100"}`}
                >
                    {/* Indicador de Selección */}
                    {isSelected && (
                        <div className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    )}

                    {/* Bloqueamos la interacción interna de la card para que el click cuente como selección */}
                    <div className="pointer-events-none select-none">
                        <EventCard event={event} onDelete={noop} />
                    </div>
                </div>
            );
        });
    }, [events, selectedIdsSet, toggleEventSelection]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Construir payload
        const payload = {
            Name: name,
            Status: status as "Pendiente" | "En Progreso" | "Finalizado" | "Cancelado", // Tipado forzado seguro por el Select
            EventIDs: selectedEventIds,
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
                            <SelectItem value="En Progreso">En Progreso</SelectItem>
                            <SelectItem value="Finalizado">Finalizado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Selección de Eventos */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Seleccionar Partidos del Torneo ({selectedEventIds.length})</Label>
                    <Badge variant="outline" className="font-normal">
                        Click en una tarjeta para seleccionar
                    </Badge>
                </div>

                {isLoadingEvents ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2 border rounded-lg bg-slate-50/50">
                        {renderedEvents}
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