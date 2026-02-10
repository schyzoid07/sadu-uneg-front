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
import { AthleteInputType } from "@/schemas/athletes";
import * as z from "zod";
import { useAthlete } from "@/hooks/athletes/use-athletes";
import Link from "next/link";




interface CrearAtletaFormProps {

    onSuccess?: () => void;
    athleteId?: string; // si se pasa, el formulario actúa en modo edición
}

type AthleteInput = z.infer<typeof AthleteInputType>

export default function CrearAtletaForm({ athleteId, onSuccess }: CrearAtletaFormProps) {

    const { data: athlete } = useAthlete(athleteId)
    const [id, setId] = useState<number | null>()
    const [firstNames, setFirstNames] = useState("");
    const [lastNames, setLastNames] = useState("");
    const [govId, setGovId] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("M");
    const [inscriptionDate, setInscriptionDate] = useState<string>("");
    const [majorId, setMajorId] = useState<number | null>(1);
    const [enrolled, setEnrolled] = useState(true);

    // Selecciones múltiples
    const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);
    const [selectedDisciplinesNames, setSelectedDisciplinesNames] = useState<string[] | undefined>([""])
    const [mensaje, setMensaje] = useState<string | null>(null);

    const { data: disciplines } = useDisciplines();
    const { data: teams } = useTeams();
    const { data: majors } = useMajors()


    const createMutation = useCreateAthlete();
    const updateMutation = useUpdateAthlete();

    // Si llega prop athlete, inicializamos campos
    useEffect(() => {
        if (athlete) {
            setId(athlete.ID ?? null)
            setFirstNames(athlete.FirstNames ?? "");
            setLastNames(athlete.LastNames ?? "");
            setGovId(athlete.GovID ?? "");
            setPhoneNum(athlete.PhoneNumber ?? "");
            setEmail(athlete.Email ?? "");
            setGender(athlete.Gender ?? "M");
            setInscriptionDate(athlete.InscriptionDate ? new Date(athlete.InscriptionDate).toISOString().slice(0, 10) : "");
            setMajorId(athlete.MajorID);

            // Active no está en el schema original; si tu backend expone Regular vs Active ajusta aquí
            setEnrolled(athlete.Enrolled ?? true);


            // Teams: en schema es array de objetos Team => extraer IDs

            const tIDs = [...new Set(athlete.Teams.map(team => team.ID))]
            setSelectedTeams(tIDs);

            // Si tu athlete trae disciplinas/eventos en un campo distinto ajusta
            // Intentamos extraer IDs desde athlete.Disciplines o RegularIDs etc.
            const dIDs = [...new Set(athlete.Teams.map(team => team.DisciplineID))]
            setSelectedDisciplines(dIDs);

            const dNames = (disciplines?.filter((discipline) => dIDs.includes(discipline.ID)))

            const namesOnly = dNames?.map(d => d.Name)

            setSelectedDisciplinesNames(namesOnly);




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

    // --- LÓGICA DE VALIDACIÓN ---
    const isFormValid =
        firstNames.trim() !== "" &&
        lastNames.trim() !== "" &&
        govId.trim() !== "" &&
        email.trim() !== "" &&
        phoneNum.trim() !== "" &&
        majorId !== null;

    const hasChanges = () => {
        if (!athlete) return true; // En creación siempre "hay cambios"

        const currentTeamsSorted = [...selectedTeams].sort().join(",");
        const originalTeamsSorted = (athlete.Teams?.map(t => t.ID) || []).sort().join(",");

        return (
            firstNames.trim() !== (athlete.FirstNames || "") ||
            lastNames.trim() !== (athlete.LastNames || "") ||
            govId.trim() !== (athlete.GovID || "") ||
            phoneNum.trim() !== (athlete.PhoneNumber || "") ||
            email.trim() !== (athlete.Email || "") ||
            majorId !== athlete.MajorID ||
            currentTeamsSorted !== originalTeamsSorted ||
            gender !== (athlete.Gender || "M") ||
            enrolled !== (athlete.Enrolled ?? true)
        );
    };

    const canSubmit = isFormValid && hasChanges();
    const isSubmitting = createMutation.isLoading || updateMutation.isLoading;




    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();
        if (!canSubmit) return;

        const payload: AthleteInput = {

            FirstNames: firstNames.trim(),
            LastNames: lastNames.trim(),
            GovID: govId.trim(),
            PhoneNumber: phoneNum.trim(),
            Email: email.trim(),
            Gender: gender,
            InscriptionDate: inscriptionDate ? new Date(inscriptionDate) : null,
            MajorID: Number(majorId),
            Regular: true,
            Enrolled: enrolled,
            Teams: selectedTeams.map(id => ({ ID: id })),

        };


        if (athlete && athlete.ID) {
            // modo edición
            updateMutation.mutate(
                { id: athlete.ID, data: payload },
                {
                    onSuccess: () => {
                        setMensaje("Atleta modificado con éxito");
                        setTimeout(() => setMensaje(null), 3000); // Se borra tras 3 segundos
                        if (onSuccess) onSuccess();
                    },
                }
            );
        } else {
            // modo creación
            createMutation.mutate(payload, {
                onSuccess: () => {
                    setMensaje("Atleta creado con éxito");
                    setTimeout(() => setMensaje(null), 3000);
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
                        <Input className={!firstNames.trim() ? "border-amber-200" : ""} value={firstNames} placeholder="Ej. Juan" onChange={(e) => setFirstNames(e.target.value)} />
                        {!firstNames.trim() && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido </p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Apellidos</label>
                        <Input className={!lastNames.trim() ? "border-amber-200" : ""}
                            value={lastNames} placeholder="Ej. Pérez" onChange={(e) => setLastNames(e.target.value)} />
                        {!lastNames.trim() && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido </p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Cédula</label>
                        <Input placeholder="V-00000000"
                            className={!govId.trim() ? "border-amber-200" : ""} value={govId} onChange={(e) => setGovId(e.target.value)} />
                        {!govId.trim() && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido para contacto</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Teléfono</label>
                        <Input className={!phoneNum.trim() ? "border-amber-200 focus:ring-amber-100" : "border-gray-200"}
                            value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                        {!phoneNum.trim() && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido para contacto</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Correo</label>
                        <Input type="email" value={email} placeholder="correo@ejemplo.com"
                            className={!email.trim() ? "border-amber-200" : ""} onChange={(e) => setEmail(e.target.value)} />
                        {!email.trim() && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido para contacto</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Carrera</label>
                        <select value={majorId ?? ""}
                            onChange={(e) => { setMajorId(e.target.value ? parseInt(e.target.value) : null) }}
                            className={`w-full text-sm p-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${!majorId ? "border-amber-200" : "border-gray-200"}`}>

                            <option value="" disabled>Selecciona una carrera</option> {/* Opción neutra */}
                            {majors?.map((m) => (

                                <option value={m.ID} key={m.ID}>{m.Name}</option>
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

                {athlete ? <div>
                    <label className="text-sm font-semibold">Disciplinas ({selectedDisciplines.length})</label>
                    <div className="border rounded-md bg-slate-50/30 mt-2">
                        <ScrollArea className="h-40 p-3">
                            {selectedDisciplinesNames?.map((d, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-3 py-1">

                                    <label className="text-sm">{d}</label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div> : ''}



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



                <div className="flex justify-end gap-3 pt-2 border-t mt-4">
                    <Link href="/atletas">
                        <Button variant="outline" type="button" >
                            Retroceder
                        </Button>
                    </Link>
                    <Button className={canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"}
                        type="submit" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (athlete ? "Guardar cambios" : "Crear atleta")}
                    </Button>
                </div>

                {!isFormValid && (
                    <p className="text-[10px] text-amber-600 text-right mt-1">
                        * Los campos con asterisco son obligatorios
                    </p>
                )}
            </form>

        </>

    );
}