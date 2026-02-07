"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useTeams } from "@/hooks/teams/use-teams";
import { useMajors } from "@/hooks/majors/use-major";
import { useCreateAthlete } from "@/hooks/athletes/use-create-athlete";
import { useUpdateAthlete } from "@/hooks/athletes/use-update-athlete";
import { Loader2 } from "lucide-react";
import { baseAthletesSchema, detailAthleteSchema, AthleteInputType } from "@/schemas/athletes";
import * as z from "zod";
import { useAthlete } from "@/hooks/athletes/use-athletes";
import Link from "next/link";
import { id } from "zod/v4/locales";



interface CrearAtletaFormProps {

    onSuccess?: () => void;
    athleteId?: string; // si se pasa, el formulario actúa en modo edición
}

type AthleteInput = z.infer<typeof AthleteInputType>

export default function CrearAtletaForm({ athleteId }: CrearAtletaFormProps) {

    const { data: athlete } = useAthlete(athleteId)
    const [firstNames, setFirstNames] = useState("");
    const [lastNames, setLastNames] = useState("");
    const [govId, setGovId] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("M");
    const [inscriptionDate, setInscriptionDate] = useState<string>("");
    const [majorId, setMajorId] = useState<number | null>(null);
    const [enrolled, setEnrolled] = useState(true);

    // Selecciones múltiples
    const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);


    const { data: disciplines } = useDisciplines();
    const { data: teams } = useTeams();
    const { data: majors } = useMajors()


    const createMutation = useCreateAthlete();
    const updateMutation = useUpdateAthlete();

    // Si llega prop athlete, inicializamos campos
    useEffect(() => {
        if (athlete) {
            setFirstNames(athlete.FirstNames ?? "");
            setLastNames(athlete.LastNames ?? "");
            setGovId(athlete.GovID ?? "");
            setPhoneNum(athlete.PhoneNumber ?? "");
            setEmail(athlete.Email ?? "");
            setGender(athlete.Gender ?? "M");
            setInscriptionDate(athlete.InscriptionDate ? new Date(athlete.InscriptionDate).toISOString().slice(0, 10) : "");
            setMajorId(athlete.MajorID ?? null);
            // Active no está en el schema original; si tu backend expone Regular vs Active ajusta aquí
            setEnrolled(athlete.Enrolled ?? true);
            console.log(athlete.Enrolled)

            // Teams: en schema es array de objetos Team => extraer IDs

            const tIDs = [...new Set(athlete.Teams.map(team => team.ID))]
            setSelectedTeams(tIDs);

            // Si tu athlete trae disciplinas/eventos en un campo distinto ajusta
            // Intentamos extraer IDs desde athlete.Disciplines o RegularIDs etc.
            const dIDs = [...new Set(athlete.Teams.map(discipline => discipline.DisciplineID))]
            setSelectedDisciplines(dIDs);


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
            setEnrolled(true);
            setSelectedTeams([]);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [athlete]);

    const toggleArray = (arr: number[], setArr: (v: number[]) => void, id: number) => {
        setArr(arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id]);
    };

    const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

    // Edición (se mantiene si lo usas)
    const [editingAthlete, setEditingAthlete] = useState<Athletes | null>(null);
    const [openEdit, setOpenEdit] = useState(false);


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();

        const payload: AthleteInput = {
            FirstNames: firstNames,
            LastNames: lastNames,
            GovID: govId,
            PhoneNumber: phoneNum,
            Email: email,
            Gender: gender,
            InscriptionDate: inscriptionDate ? new Date(inscriptionDate) : null,
            MajorID: majorId,
            Regular: true,
            Enrolled: enrolled,
            Teams: selectedTeams,

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

        <>

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
                        <label className="text-sm font-medium">Cédula</label>
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
                        <label className="text-sm font-medium">Carrera</label>
                        <select className="w-full text-sm font-medium p-1.75 bg-white border border-gray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none">

                            {majors?.map((m) => (
                                <option key={m.ID} value={m.ID}>{m.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Género</label>

                        <select
                            className="w-full border rounded px-2 py-1"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>

                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Fecha de Inscripción</label>
                        <Input type="date" value={inscriptionDate} onChange={(e) => setInscriptionDate(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2 mt-5">
                        <Checkbox id="active-checkbox" checked={enrolled} onCheckedChange={() => setEnrolled(!enrolled)} />
                        <label htmlFor="active-checkbox" className="text-sm">Activo en la universidad</label>
                    </div>
                </div>


                <div>
                    <label className="text-sm font-semibold">Disciplinas seleccionadas ({selectedDisciplines.length})</label>
                    <div className="border rounded-md bg-slate-50/30 mt-2">
                        <ScrollArea className="h-40 p-3">
                            {disciplines?.map((d) => (
                                <div key={d.ID} className="flex items-center space-x-3 py-1">
                                    <Checkbox
                                        id={`disc-${d.ID}`}
                                        checked={selectedDisciplines.includes(d.ID)}
                                        onCheckedChange={() => toggleArray(selectedDisciplines, setSelectedDisciplines, d.ID)}
                                    />
                                    <label htmlFor={`disc-${d.ID}`} className="text-sm">{d.Name}</label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>


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
                                    <label htmlFor={`team-${t.ID}`} className="text-sm">{t.Name}</label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>



                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/atletas">
                        <Button variant="outline" type="button" >
                            Retroceder
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (athlete ? "Modificar atleta" : "Crear atleta")}
                    </Button>
                </div>
            </form>

        </>








    );
}