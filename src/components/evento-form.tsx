"use client";

import { useState, useEffect, useMemo } from "react";
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
    const isEditMode = !!eventId;

    // Hooks de datos
    // Convertimos eventId a número si es necesario, dependiendo de la implementación de tu hook useEvent
    const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);


    const { data: disciplines } = useDisciplines();
    const { data: teams } = useTeams();
    const { data: teachers } = useTeachers();

    const createMutation = useCreateEvent();
    const updateMutation = useUpdateEvent();

    // Estados del formulario
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Pendiente");
    const [disciplineId, setDisciplineId] = useState<string>("");
    const [homeTeamId, setHomeTeamId] = useState<string>("");
    const [oppositeTeamId, setOppositeTeamId] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [ubication, setUbication] = useState("");
    const [observation, setObservation] = useState("");
    const [homePoints, setHomePoints] = useState<number>(0);
    const [oppositePoints, setOppositePoints] = useState<number>(0);
    const [message, setMessage] = useState<string | null>(null);

    // Cargar datos al editar
    useEffect(() => {
        if (event) {
            console.log(event);
            setName(event.Name || "");

            // Formatear fecha para el input datetime-local (YYYY-MM-DDThh:mm)
            if (event.Date) {
                const d = new Date(event.Date);
                // Ajuste simple para zona horaria local
                const offset = d.getTimezoneOffset() * 60000;
                const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
                setDate(localISOTime);
            } else {
                setDate("");
            }

            setStatus(event.Status || "Pendiente");
            console.log(event.Status)

            const dId = event.Discipline?.ID;
            setDisciplineId(dId ? dId.toString() : "");
            const hId = event.HomeTeam?.ID;

            console.log(event.HomeTeam?.ID)
            setHomeTeamId(hId ? hId.toString() : "");
            const oId = event.OppositeTeam?.ID;

            console.log(event.OppositeTeam?.ID)
            setOppositeTeamId(oId ? oId.toString() : "");
            const tId = event.ResponsableTeacher?.ID;
            setTeacherId(tId ? tId.toString() : "");


            setUbication(event.Ubication || "");
            setObservation(event.Observation || "");
            setHomePoints(event.HomePoints ?? 0);
            setOppositePoints(event.OppositePoints ?? 0);
        }
    }, [event]);

    // Filtrar equipos por disciplina seleccionada
    const filteredTeams = useMemo(() => {
        if (!teams) return [];
        if (!disciplineId) return []; // No mostrar equipos hasta que se elija disciplina
        return teams.filter(t =>
            t.DisciplineID?.toString() === disciplineId ||
            t.Discipline?.ID?.toString() === disciplineId
        );
    }, [teams, disciplineId]);

    // Filtrar equipos visitantes para que no sean el mismo que el local.
    const availableOppositeTeams = useMemo(() => {
        return filteredTeams.filter(t => t.ID.toString() !== homeTeamId);
    }, [filteredTeams, homeTeamId]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    // Validación básica: campos requeridos
    const isFormValid = name && date && disciplineId && homeTeamId && oppositeTeamId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Construir payload
        const payload = {
            Name: name,
            Date: new Date(date).toISOString(), // Enviar como ISO string
            Status: status,
            DisciplineID: parseInt(disciplineId),
            Ubication: ubication,
            Observation: observation,
            HomePoints: homePoints,
            OppositePoints: oppositePoints,
            HomeTeamID: parseInt(homeTeamId),
            OppositeTeamID: parseInt(oppositeTeamId),
            ResponsableTeacherID: teacherId ? parseInt(teacherId) : null,
        };

        try {
            if (isEditMode && event) {
                // Usamos 'json' o 'data' según la convención de tus hooks (TeacherForm usaba json)
                await updateMutation.mutateAsync({ id: event.ID, data: payload });
                setMessage("Evento actualizado correctamente.");
            } else {
                await createMutation.mutateAsync(payload);
                setMessage("Evento creado correctamente.");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving event:", error);
            setMessage("Error al guardar el evento.");
        }
    };

    if (isEditMode && isLoadingEvent) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de éxito/error */}
            {message && (
                <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2 md:col-span-2">
                    <Label>Nombre del Evento</Label>
                    <Input
                        placeholder="Ej: Final de Voleibol"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                    <Label>Fecha y Hora</Label>
                    <Input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select defaultValue={event?.Status || "Pendiente"} onValueChange={setStatus}>
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

                {/* Disciplina */}
                <div className="space-y-2 md:col-span-2">
                    <Label>Disciplina</Label>
                    <Select defaultValue={(event?.Discipline?.ID)?.toString() || ""} onValueChange={(val) => {
                        setDisciplineId(val);
                        // Resetear equipos si cambia la disciplina para evitar inconsistencias
                        setHomeTeamId("");
                        setOppositeTeamId("");
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                            {disciplines?.map((d) => (
                                <SelectItem key={d.ID} value={d.ID.toString()}>
                                    {d.Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Equipos */}
                <div className="space-y-2">
                    <Label>Equipo Local</Label>
                    <Select defaultValue={(event?.HomeTeam?.ID)?.toString() || ""} onValueChange={setHomeTeamId} disabled={!disciplineId}>
                        <SelectTrigger>
                            <SelectValue placeholder={disciplineId ? "Seleccionar equipo local" : "Seleccione disciplina primero"} />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredTeams?.map((t) => (
                                <SelectItem key={t.ID} value={t.ID.toString()}>
                                    {t.Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Equipo Visitante</Label>
                    <Select defaultValue={(event?.OppositeTeam?.ID)?.toString() || ""} onValueChange={setOppositeTeamId} disabled={!disciplineId || !homeTeamId}>
                        <SelectTrigger>
                            <SelectValue placeholder={homeTeamId ? "Seleccionar equipo visitante" : "Seleccione local primero"} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableOppositeTeams?.map((t) => (
                                <SelectItem key={t.ID} value={t.ID.toString()}>
                                    {t.Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Marcador */}
                <div className="space-y-2">
                    <Label>Puntos Local</Label>
                    <Input
                        type="number"
                        min="0"
                        value={homePoints}
                        onChange={(e) => setHomePoints(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Puntos Visitante</Label>
                    <Input
                        type="number"
                        min="0"
                        value={oppositePoints}
                        onChange={(e) => setOppositePoints(parseInt(e.target.value) || 0)}
                    />
                </div>

                {/* Profesor Responsable */}
                <div className="space-y-2 md:col-span-2">
                    <Label>Profesor Responsable</Label>
                    <Select defaultValue={(event?.ResponsableTeacher?.ID)?.toString() || ""} onValueChange={setTeacherId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar profesor (Opcional)" />
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

                {/* Ubicación */}
                <div className="space-y-2 md:col-span-2">
                    <Label>Ubicación</Label>
                    <Input
                        placeholder="Ej: Cancha A, Sede Villa Asia"
                        value={ubication}
                        onChange={(e) => setUbication(e.target.value)}
                    />
                </div>

                {/* Observación */}
                <div className="space-y-2 md:col-span-2">
                    <Label>Observaciones</Label>
                    <Input
                        placeholder="Notas adicionales..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Link href="/eventos">
                    <Button variant="outline" type="button">
                        Cancelar / Volver
                    </Button>
                </Link>
                <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? "Guardar Cambios" : "Crear Evento"}
                </Button>
            </div>
        </form>
    );
}
