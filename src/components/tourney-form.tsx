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
import { useTourney, useCreateTourney, useUpdateTourney, TourneyInput } from "@/hooks/tourneys/use-tourneys";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useEvents } from "@/hooks/events/use-events";
import Link from "next/link";
import EventCard from "@/components/event-card";
import { Badge } from "@/components/ui/badge";

// Función vacía estable para evitar re-renders innecesarios en EventCard
const noop = () => { };

/**
 * Convierte una fecha del backend al valor de un `<input type="date">`.
 * Los torneos guardados sin fechas llegan con el cero de Go (`0001-01-01`), que hay
 * que mostrar como campo vacío. Se lee en UTC para no correr el día.
 */
const aValorDeFecha = (fecha?: Date | null): string => {
    if (!fecha || Number.isNaN(fecha.getTime()) || fecha.getUTCFullYear() < 1900) return "";
    return fecha.toISOString().slice(0, 10);
};

/** Convierte el valor de un `<input type="date">` a ISO 8601, que es lo que espera Go. */
const aISO = (valor: string): string => new Date(`${valor}T00:00:00Z`).toISOString();

interface TourneyFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    tourneyId?: string;
}

export function TourneyForm({ tourneyId, onSuccess, onCancel }: TourneyFormProps) {
    const isEditMode = !!tourneyId;

    // Estados del formulario
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Pendiente");
    const [disciplineId, setDisciplineId] = useState<string>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    // Las fechas se sugieren a partir de los partidos elegidos, pero solo mientras
    // nadie las haya escrito a mano: a partir de ahí manda lo que puso el usuario.
    const [fechasEditadas, setFechasEditadas] = useState(false);
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    // Hooks de datos
    const { data: tourney, isLoading: isLoadingTourney } = useTourney(tourneyId);
    const { data: disciplines } = useDisciplines();
    // El filtro por disciplina lo resuelve el backend. Un torneo pertenece a una
    // disciplina, así que solo se pueden elegir partidos de esa misma disciplina.
    const { data: events, isLoading: isLoadingEvents } = useEvents({ discipline_id: disciplineId });
    const createMutation = useCreateTourney();
    const updateMutation = useUpdateTourney();

    // Cargar datos al editar
    useEffect(() => {
        if (tourney) {
            setName(tourney.Name);
            setStatus(tourney.Status);
            setDisciplineId(tourney.DisciplineID ? tourney.DisciplineID.toString() : "");
            setStartDate(aValorDeFecha(tourney.StartDate));
            setEndDate(aValorDeFecha(tourney.EndDate));
            // Lo guardado no se sobrescribe con una sugerencia.
            setFechasEditadas(true);

            // Si el torneo ya tiene eventos asociados, extraemos sus IDs para marcarlos como seleccionados
            if (tourney.Events && Array.isArray(tourney.Events)) {
                setSelectedEventIds(tourney.Events.map(e => e.ID));
            }
        }
    }, [tourney]);

    // Sugerir el rango de fechas a partir de los partidos seleccionados.
    useEffect(() => {
        if (fechasEditadas || selectedEventIds.length === 0) return;

        const fechas = (events ?? [])
            .filter(e => selectedEventIds.includes(e.ID) && e.Date)
            .map(e => e.Date!.slice(0, 10))
            .sort();
        if (fechas.length === 0) return;

        setStartDate(fechas[0]);
        setEndDate(fechas[fechas.length - 1]);
    }, [selectedEventIds, events, fechasEditadas]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isFormValid = name.trim().length > 0 && disciplineId !== "";

    // Al cambiar de disciplina la selección anterior deja de ser válida. Se limpia
    // aquí, en el manejador, y no en un efecto, para no pisar la precarga al editar.
    const handleDisciplineChange = (valor: string) => {
        setDisciplineId(valor);
        setSelectedEventIds([]);
    };

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

        if (startDate && endDate && endDate < startDate) {
            setMessage("Error: la fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        // El tipo explícito hace que `tsc` compare las claves con lo que espera el
        // backend: un nombre mal escrito no llega en silencio a la petición.
        const payload: TourneyInput = {
            Name: name.trim(),
            Status: status as "Activo" | "Finalizado" | "Pendiente",
            DisciplineID: parseInt(disciplineId),
            EventIDs: selectedEventIds,
            ...(startDate ? { StartDate: aISO(startDate) } : {}),
            ...(endDate ? { EndDate: aISO(endDate) } : {}),
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Disciplina del torneo */}
                <div className="space-y-2">
                    <Label>Disciplina del Torneo</Label>
                    <Select value={disciplineId} onValueChange={handleDisciplineChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                            {disciplines?.map(d => (
                                <SelectItem key={d.ID} value={d.ID.toString()}>{d.Name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Fecha de inicio */}
                <div className="space-y-2">
                    <Label>Fecha de Inicio</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setFechasEditadas(true); }}
                    />
                </div>

                {/* Fecha de fin */}
                <div className="space-y-2">
                    <Label>Fecha de Fin</Label>
                    <Input
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => { setEndDate(e.target.value); setFechasEditadas(true); }}
                    />
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
                    {!fechasEditadas && selectedEventIds.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Las fechas se sugieren según los partidos seleccionados.
                        </p>
                    )}
                </div>

                {!disciplineId ? (
                    <p className="text-center text-muted-foreground py-8 border rounded-lg bg-slate-50/50">
                        Elige primero la disciplina del torneo para ver sus partidos.
                    </p>
                ) : isLoadingEvents ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2 border rounded-lg bg-slate-50/50">
                        {events?.map((event) => {
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
                                No hay partidos de esta disciplina.
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
