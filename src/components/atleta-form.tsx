"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDisciplines } from "@/hooks/use-disciplines";
import { useTeams } from "@/hooks/use-teams";
import { useEvents } from "@/hooks/use-events";
import { useCreateAthlete } from "@/hooks/use-create-athlete";
import { Loader2, SearchIcon } from "lucide-react";
import { athleteSchema } from "@/schemas/athletes";
import * as z from "zod";

interface CrearAtletaFormProps {
    onSuccess?: () => void;
}

type AthleteInput = Partial<
    z.infer<typeof athleteSchema>
> & {
    Active?: boolean; // atributo extra para status activo/inactivo
    TeamsIDs?: number[];
    DisciplineIDs?: number[];
    EventIDs?: number[];
};

export default function CrearAtletaForm({ onSuccess }: CrearAtletaFormProps) {
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

    const toggleArray = (arr: number[], setArr: (v: number[]) => void, id: number) => {
        setArr(arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id]);
    };

    const isSubmitting = createMutation.isLoading;

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

        createMutation.mutate(payload as any, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form className="space-y-6 mt-4 mb-4" onSubmit={handleSubmit}>
            {/* Grid principal - 1 columna en móvil, 2 en tablets/pc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Nombres</label>
                    <Input value={firstNames} placeholder="Pepito Antonio" onChange={(e) => setFirstNames(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Apellidos</label>
                    <Input value={lastNames} placeholder="Gonzalez Jimenez" onChange={(e) => setLastNames(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Cédula</label>
                    <Input value={govId} placeholder="V-12345678" onChange={(e) => setGovId(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input value={phoneNum} placeholder="04124512365" onChange={(e) => setPhoneNum(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Correo</label>
                    <Input value={email} placeholder="correoejemplo@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Género</label>
                    <Select onValueChange={(v) => setGender(v)} defaultValue={gender}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Fecha de Inscripción</label>
                    <Input className="w-full" type="date" value={inscriptionDate} onChange={(e) => setInscriptionDate(e.target.value)} />
                </div>

                {/* Checkbox alineado mejor para móvil */}
                <div className="flex items-center space-x-2 md:mt-8 pt-2">
                    <Checkbox id="active-checkbox" checked={active} onCheckedChange={() => setActive(!active)} />
                    <label htmlFor="active-checkbox" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Activo en la universidad
                    </label>
                </div>
            </div>

            {/* Secciones de Selección (Disciplinas y Equipos) */}
            <div className="grid grid-cols-1 gap-6">
                {/* Disciplinas */}
                <div>
                    <label className="text-sm font-semibold">Disciplinas seleccionadas ({selectedDisciplines.length})</label>
                    <div className="border rounded-md bg-slate-50/30 mt-2">
                        <ScrollArea className="h-40 p-3">
                            {disciplines?.map((d) => (
                                <div key={d.id} className="flex items-center space-x-3 py-1.5">
                                    <Checkbox
                                        id={`disc-${d.id}`}
                                        checked={selectedDisciplines.includes(d.id)}
                                        onCheckedChange={() => toggleArray(selectedDisciplines, setSelectedDisciplines, d.id)}
                                    />
                                    <label htmlFor={`disc-${d.id}`} className="text-sm cursor-pointer">{d.name}</label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>

                {/* Equipos */}
                <div>
                    <label className="text-sm font-semibold">Equipos ({selectedTeams.length})</label>
                    <div className="border rounded-md bg-slate-50/30 mt-2">
                        <ScrollArea className="h-40 p-3">
                            {teams?.map((t) => (
                                <div key={t.ID} className="flex items-center space-x-3 py-1.5">
                                    <Checkbox
                                        id={`team-${t.ID}`}
                                        checked={selectedTeams.includes(t.ID)}
                                        onCheckedChange={() => toggleArray(selectedTeams, setSelectedTeams, t.ID)}
                                    />
                                    <label htmlFor={`team-${t.ID}`} className="text-sm cursor-pointer">{t.Nombre}</label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>

            {/* Footer acciones - En móvil se ven mejor uno sobre otro o con gap amplio */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button className="w-full sm:w-auto" variant="outline" type="button">
                    Cancelar
                </Button>
                <Button className="w-full sm:w-auto" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Crear atleta"}
                </Button>
            </div>
        </form>
    );
}