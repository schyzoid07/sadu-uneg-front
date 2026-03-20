"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useCreateTeacher, useUpdateTeacher, useTeacher } from "@/hooks/teachers/use-teachers";
import { Loader2 } from "lucide-react";
import { TeacherInput } from "@/schemas/teachers";
import Link from "next/link";
import { Label } from "@/components/ui/label";

interface TeacherFormProps {
    teacherId?: string;
    onSuccess?: () => void;
}

export default function TeacherForm({ teacherId, onSuccess }: TeacherFormProps) {
    // Hooks
    const { data: teacher, isLoading: isLoadingTeacher } = useTeacher(teacherId);
    console.log(teacher)
    const { data: disciplines } = useDisciplines();
    const createMutation = useCreateTeacher();
    const updateMutation = useUpdateTeacher();

    // Estados del formulario
    const [govId, setGovId] = useState("");
    const [firstNames, setFirstNames] = useState("");
    const [lastNames, setLastNames] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    // Cargar datos al editar
    useEffect(() => {
        if (teacher) {
            setGovId(teacher.GovID || "");
            setFirstNames(teacher.FirstNames || "");
            setLastNames(teacher.LastNames || "");
            setEmail(teacher.Email || "");
            setPhoneNumber(teacher.PhoneNumber || "");
            setSelectedDisciplines(teacher.Disciplines?.map((d) => d.ID) || []);
        }
    }, [teacher]);

    // Manejo de envío
    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isFormValid = govId && firstNames && lastNames && email && phoneNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const payload: TeacherInput = {
            GovID: govId,
            FirstNames: firstNames,
            LastNames: lastNames,
            Email: email,
            PhoneNumber: phoneNumber,
            DisciplineIDs: selectedDisciplines,
            // No enviamos EventIDs ya que son solo de lectura/asignados desde Eventos
        };

        try {
            if (teacherId && teacher) {
                await updateMutation.mutateAsync({ id: teacher.ID, json: payload });
                setMessage("Profesor actualizado correctamente.");
            } else {
                await createMutation.mutateAsync(payload);
                setMessage("Profesor creado correctamente.");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving teacher:", error);
            setMessage("Error al guardar el profesor.");
        }
    };

    if (teacherId && isLoadingTeacher) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Cédula</Label>
                    <Input
                        placeholder="V-12345678"
                        value={govId}
                        onChange={(e) => setGovId(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                        placeholder="0414-1234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Nombres</Label>
                    <Input
                        placeholder="Juan"
                        value={firstNames}
                        onChange={(e) => setFirstNames(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Apellidos</Label>
                    <Input
                        placeholder="Pérez"
                        value={lastNames}
                        onChange={(e) => setLastNames(e.target.value)}
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Correo Electrónico</Label>
                    <Input
                        type="email"
                        placeholder="juan@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {/* Disciplinas (Editable) */}
                <div className="space-y-2">
                    <Label>Disciplinas</Label>
                    <ScrollArea className="h-32 rounded-md border p-3 bg-slate-50/50">
                        <div className="space-y-2">
                            {disciplines?.map((discipline) => (
                                <div key={discipline.ID} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`d-${discipline.ID}`}
                                        checked={selectedDisciplines.includes(discipline.ID)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedDisciplines([...selectedDisciplines, discipline.ID]);
                                            } else {
                                                setSelectedDisciplines(selectedDisciplines.filter((id) => id !== discipline.ID));
                                            }
                                        }}
                                    />
                                    <label htmlFor={`d-${discipline.ID}`} className="text-sm font-medium leading-none cursor-pointer">
                                        {discipline.Name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Eventos Asignados (Solo lectura) */}
                {teacherId && (
                    <div className="space-y-2">
                        <Label>Eventos Asignados (Solo lectura)</Label>
                        <div className="rounded-md border p-3 bg-gray-100 h-32 overflow-y-auto">
                            {teacher?.Events && teacher.Events.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {teacher.Events.map((event) => (
                                        <li key={event.ID} className="text-sm text-slate-700">
                                            {event.Name || `Evento #${event.ID}`}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No tiene eventos asignados.</p>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-500 text-right">
                            * Los eventos se gestionan desde la sección de Eventos.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Link href="/profesores">
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
                    {teacherId ? "Guardar Cambios" : "Registrar Profesor"}
                </Button>
            </div>
        </form>
    );
}
