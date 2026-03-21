"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useEvent, useCreateEvent, useUpdateEvent } from "@/hooks/events/use-events";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useTeams } from "@/hooks/teams/use-teams";
import { useTeachers } from "@/hooks/teachers/use-teachers";
import Link from "next/link";

interface EventFormProps {
    onSuccess?: () => void;
    eventId?: string;
}

export function EventoForm({ eventId, onSuccess }: EventFormProps) {
    // 1. Hooks de datos
    const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
    console.log(event);
    const { data: disciplines } = useDisciplines();
    const { data: teams } = useTeams();
    const { data: teachers } = useTeachers();

    const createMutation = useCreateEvent();
    const updateMutation = useUpdateEvent();

    // 2. Estados locales
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [status, setStatus] = useState("Programado");
    const [homePoints, setHomePoints] = useState("0");
    const [oppositePoints, setOppositePoints] = useState("0");
    const [homeTeamId, setHomeTeamId] = useState<string>("");
    const [oppositeTeamId, setOppositeTeamId] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [disciplineId, setDisciplineId] = useState<string>("");
    const [observation, setObservation] = useState("");
    const [ubication, setUbication] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    // Cargar datos al editar
    useEffect(() => {
        if (event) {
            setName(event.Name || "");
            if (event.Date) {
                try {
                    const d = new Date(event.Date);
                    // Formato YYYY-MM-DD para input date
                    setDate(d.toISOString().split('T')[0]);
                    // Formato HH:MM para input time
                    setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                } catch (e) {
                    console.error("Error parsing date", e);
                }
            }
            setStatus(event.Status || "Programado");
            setHomePoints(event.HomePoints?.toString() || "0");
            setOppositePoints(event.OppositePoints?.toString() || "0");
            // Validamos que el ID sea "truthy" (distinto de 0) para evitar seleccionar un valor "0" inválido
            setHomeTeamId(event.HomeTeam?.ID ? event.HomeTeam.ID.toString() : "");
            setOppositeTeamId(event.OppositeTeam?.ID ? event.OppositeTeam.ID.toString() : "");
            setTeacherId(event.ResponsableTeacher?.ID?.toString() || "");
            setDisciplineId(event.Discipline?.ID?.toString() || "");
            setObservation(event.Observation || "");
            setUbication(event.Ubication || "");
        }
    }, [event]);

    // Filtrar equipos por disciplina seleccionada
    const filteredTeams = teams?.filter(t => {
        const tDiscId = t.Discipline?.ID || t.DisciplineID;
        return !disciplineId || tDiscId?.toString() === disciplineId;
    }) || [];

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isFormValid = name && date && disciplineId && homeTeamId && oppositeTeamId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Construir fecha ISO
        const isoDate = new Date(`${date}T${time || "00:00"}:00`).toISOString();

        const payload: any = {
            Name: name,
            Date: isoDate,
            Status: status,
            HomePoints: parseInt(homePoints),
            OppositePoints: parseInt(oppositePoints),
            HomeTeamID: parseInt(homeTeamId),
            OppositeTeamID: parseInt(oppositeTeamId),
            ResponsableTeacherID: teacherId ? parseInt(teacherId) : null,
            DisciplineID: parseInt(disciplineId),
            Observation: observation,
            Ubication: ubication,
        };

        try {
            if (eventId && event) {
                await updateMutation.mutateAsync({ id: event.ID, data: payload });
                setMessage("Evento actualizado correctamente.");
            } else {
                await createMutation.mutateAsync(payload);
                setMessage("Evento creado correctamente.");
            }
            // Retraso breve para mostrar mensaje antes de cerrar/redirigir
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Error al guardar evento:", error);
            setMessage("Error al guardar el evento.");
        }
    };

    if (eventId && isLoadingEvent) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {message && (
                <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label>Nombre del Evento</Label>
                    <Input
                        placeholder="Ej: Final de Voleibol"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Ubicación</Label>
                    <Input
                        placeholder="Cancha A"
                        value={ubication}
                        onChange={(e) => setUbication(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Programado">Programado</SelectItem>
                            <SelectItem value="En Curso">En Curso</SelectItem>
                            <SelectItem value="Finalizado">Finalizado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Disciplina</Label>
                    <Select value={disciplineId} onValueChange={(val) => {
                        setDisciplineId(val);
                    }}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                            {disciplines?.map((d) => (
                                <SelectItem key={d.ID} value={d.ID.toString()}>{d.Name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Equipo Local</Label>
                    <Select value={homeTeamId} onValueChange={setHomeTeamId} disabled={!disciplineId}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder={disciplineId ? "Seleccionar equipo" : "Primero seleccione disciplina"} />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredTeams.map((t) => (
                                <SelectItem key={t.ID} value={t.ID.toString()}>{t.Name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Puntos Local</Label>
                    <Input
                        type="number"
                        min="0"
                        value={homePoints}
                        onChange={(e) => setHomePoints(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Equipo Visitante</Label>
                    <Select value={oppositeTeamId} onValueChange={setOppositeTeamId} disabled={!disciplineId}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder={disciplineId ? "Seleccionar equipo" : "Primero seleccione disciplina"} />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredTeams.map((t) => (
                                <SelectItem key={t.ID} value={t.ID.toString()}>{t.Name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Puntos Visitante</Label>
                    <Input
                        type="number"
                        min="0"
                        value={oppositePoints}
                        onChange={(e) => setOppositePoints(e.target.value)}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Profesor Responsable</Label>
                    <Select value={teacherId} onValueChange={setTeacherId}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar profesor" />
                        </SelectTrigger>
                        <SelectContent>
                            {teachers?.map((t) => (
                                <SelectItem key={t.ID} value={t.ID.toString()}>
                                    {t.FirstNames} {t.LastNames}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Observaciones</Label>
                    <Input
                        placeholder="Notas adicionales..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                {eventId ? (
                    <Link href="/eventos">
                        <Button variant="outline" type="button">Volver</Button>
                    </Link>
                ) : (
                    <Button variant="outline" type="button" onClick={() => onSuccess?.()}>Cancelar</Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {eventId ? "Guardar Cambios" : "Crear Evento"}
                </Button>
            </div>
        </form>
    );
}
