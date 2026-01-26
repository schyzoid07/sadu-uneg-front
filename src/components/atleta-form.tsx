"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
// Si no tienes select UI, reemplaza por <select> nativo o el componente UI que uses
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useTeams } from "@/hooks/teams/use-teams";
import { useEvents } from "@/hooks/events/use-events";
import { useCreateAthlete } from "@/hooks/athletes/use-create-athlete";
import { useUpdateAthlete } from "@/hooks/athletes/use-update-athlete";
import { Loader2, SearchIcon } from "lucide-react";
import { athleteSchema } from "@/schemas/athletes";
import * as z from "zod";
import { Athlete } from "@/hooks/athletes/use-athletes";

interface CrearAtletaFormProps {
    onSuccess?: () => void;
    athlete?: Athlete | null; // si se pasa, el formulario actúa en modo edición
}

type AthleteInput = Partial<
    z.infer<typeof athleteSchema>
> & {
    Active?: boolean; // atributo extra para status activo/inactivo
    TeamsIDs?: number[];
    DisciplineIDs?: number[];
    EventIDs?: number[];
};

export default function CrearAtletaForm({ onSuccess, athlete }: CrearAtletaFormProps) {
    const [firstNames, setFirstNames] = useState("");
    const [lastNames, setLastNames] = useState("");
    const [govId, setGovId] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("M");
    const [inscriptionDate, setInscriptionDate] = useState<string>("");
    const [majorId, setMajorId] = useState<number | null>(null);
    const [active, setActive] = useState(true);

    // Selecciones múltiples
    const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

    const { data: disciplines } = useDisciplines();
    const { data: teams } = useTeams();
    const { data: events } = useEvents(""); // carga inicial sin filtro

    const createMutation = useCreateAthlete();
    const updateMutation = useUpdateAthlete();

    // Si llega prop athlete, inicializamos campos
    useEffect(() => {
        if (athlete) {
            setFirstNames(athlete.FirstNames ?? "");
            setLastNames(athlete.LastNames ?? "");
            setGovId(athlete.GovID ?? "");
            setPhoneNum(athlete.PhoneNum ?? "");
            setEmail(athlete.Email ?? "");
            setGender(athlete.Gender ?? "M");
            setInscriptionDate(athlete.InscriptionDate ? new Date(athlete.InscriptionDate).toISOString().slice(0, 10) : "");
            setMajorId((athlete.MajorID as number) ?? null);
            // Active no está en el schema original; si tu backend expone Regular vs Active ajusta aquí
            setActive((athlete as any).Active ?? athlete.Regular ?? true);

            // Teams: en schema es array de objetos Team => extraer IDs
            const tIDs = (athlete.Teams ?? []).map((t: any) => t.ID).filter(Boolean);
            setSelectedTeams(tIDs);

            // Si tu athlete trae disciplinas/eventos en un campo distinto ajusta
            // Intentamos extraer IDs desde athlete.Disciplines o RegularIDs etc.
            const dIDs = (athlete as any).Disciplines ? (athlete as any).Disciplines.map((d: any) => d.ID).filter(Boolean) : [];
            setSelectedDisciplines(dIDs);

            const eIDs = (athlete as any).Events ? (athlete as any).Events.map((e: any) => e.ID).filter(Boolean) : [];
            setSelectedEvents(eIDs);
        } else {
            // limpiar si no hay athlete (modo creación)
            setFirstNames("");
            setLastNames("");
            setGovId("");
            setPhoneNum("");
            setEmail("");
            setGender("M");
            setInscriptionDate("");
            setMajorId(null);
            setActive(true);
            setSelectedTeams([]);
            setSelectedDisciplines([]);
            setSelectedEvents([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [athlete]);

    const toggleArray = (arr: number[], setArr: (v: number[]) => void, id: number) => {
        setArr(arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id]);
    };

    const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();

        const payload: AthleteInput = {
            FirstNames: firstNames,
            LastNames: lastNames,
            GovID: govId,
            PhoneNum: phoneNum,
            Email: email,
            Gender: gender,
            InscriptionDate: inscriptionDate ? new Date(inscriptionDate) : null,
            MajorID: majorId ?? undefined,
            Regular: true,
            Active: active,
            TeamsIDs: selectedTeams,
            DisciplineIDs: selectedDisciplines,
            EventIDs: selectedEvents,
        };

        if (athlete && athlete.ID) {
            // modo edición
            updateMutation.mutate(
                { id: athlete.ID, data: payload as any },
                {
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                }
            );
        } else {
            // modo creación
            createMutation.mutate(payload as any, {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium">Nombres</label>
                    <Input value={firstNames} onChange={(e) => setFirstNames(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Apellidos</label>
                    <Input value={lastNames} onChange={(e) => setLastNames(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Cédula (GovID)</label>
                    <Input value={govId} onChange={(e) => setGovId(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Correo</label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Género</label>
                    {/* Si no tienes Select UI utiliza <select> nativo */}
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Fecha de Inscripción</label>
                    <Input type="date" value={inscriptionDate} onChange={(e) => setInscriptionDate(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2 mt-5">
                    <Checkbox id="active-checkbox" checked={active} onCheckedChange={() => setActive(!active)} />
                    <label htmlFor="active-checkbox" className="text-sm">Activo en la universidad</label>
                </div>
            </div>

            {/* Selección de Disciplinas */}
            <div>
                <label className="text-sm font-semibold">Disciplinas seleccionadas ({selectedDisciplines.length})</label>
                <div className="border rounded-md bg-slate-50/30 mt-2">
                    <ScrollArea className="h-40 p-3">
                        {disciplines?.map((d) => (
                            <div key={d.id} className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id={`disc-${d.id}`}
                                    checked={selectedDisciplines.includes(d.id)}
                                    onCheckedChange={() => toggleArray(selectedDisciplines, setSelectedDisciplines, d.id)}
                                />
                                <label htmlFor={`disc-${d.id}`} className="text-sm">{d.name}</label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>

            {/* Selección de Equipos */}
            <div>
                <label className="text-sm font-semibold">Equipos ({selectedTeams.length})</label>
                <div className="border rounded-md bg-slate-50/30 mt-2">
                    <ScrollArea className="h-40 p-3">
                        {teams?.map((t) => (
                            <div key={t.ID} className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id={`team-${t.ID}`}
                                    checked={selectedTeams.includes(t.ID)}
                                    onCheckedChange={() => toggleArray(selectedTeams, setSelectedTeams, t.ID)}
                                />
                                <label htmlFor={`team-${t.ID}`} className="text-sm">{t.Nombre}</label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>

            {/* Selección de Partidos / Eventos */}
            <div>
                <label className="text-sm font-semibold">Partidos / Eventos ({selectedEvents.length})</label>
                <div className="border rounded-md bg-slate-50/30 mt-2">
                    <ScrollArea className="h-40 p-3">
                        {events?.map((ev) => (
                            <div key={ev.id} className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id={`evt-${ev.id}`}
                                    checked={selectedEvents.includes(ev.id)}
                                    onCheckedChange={() => toggleArray(selectedEvents, setSelectedEvents, ev.id)}
                                />
                                <label htmlFor={`evt-${ev.id}`} className="text-sm">{ev.name}</label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>

            {/* Footer acciones */}
            <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => { if (onSuccess) onSuccess(); }}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (athlete ? "Actualizar atleta" : "Crear atleta")}
                </Button>
            </div>
        </form>
    );
}