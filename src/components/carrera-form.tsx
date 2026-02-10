"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { } from "@/hooks/majors/use-major";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { useMajor } from "@/hooks/majors/use-major";
import Link from "next/link";
import { MajorInputType } from "@/schemas/majors";
import { useUpdateMajor } from "@/hooks/majors/use-update-major";
import { useCreateMajor } from "@/hooks/majors/use-create-major";




interface CrearCarreraFormProps {

    onSuccess?: () => void;
    majorId?: string; // si se pasa, el formulario actúa en modo edición
}

type MajorInput = z.infer<typeof MajorInputType>

export default function CrearCarreraForm({ majorId, onSuccess }: CrearCarreraFormProps) {

    const { data: major } = useMajor(majorId)
    const [id, setId] = useState<number | null>(null)
    const [name, setName] = useState("");
    const [mensaje, setMensaje] = useState<string | null>(null);

    const createMutation = useCreateMajor();
    const updateMutation = useUpdateMajor();

    // Si llega prop major, inicializamos campos
    useEffect(() => {
        if (major) {
            setId(major.ID ?? null)
            setName(major.Name ?? "");





        } else {
            // limpiar si no hay carrera (modo creación)
            setName("");

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [major]);


    // --- LÓGICA DE VALIDACIÓN ---

    const isInvalid = name.trim().length === 0;

    const isUnchanged = major ? name.trim() === major.Name : false;

    const canSubmit = !isInvalid && !isUnchanged;

    const isSubmitting = createMutation.isLoading || updateMutation.isLoading;
    // ----------------------------





    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();
        if (!canSubmit) return;


        const payload: MajorInput = {
            Name: name.trim(),
        };


        if (major && major.ID) {
            // modo edición
            updateMutation.mutate(
                { id: major.ID, data: payload },
                {
                    onSuccess: () => {
                        setMensaje("Carrera modificada con éxito");
                        setTimeout(() => setMensaje(null), 3000);
                        if (onSuccess) onSuccess();// Se borra tras 3 segundos
                    },
                }
            );
        } else {
            // modo creación
            createMutation.mutate(payload, {
                onSuccess: () => {
                    setMensaje("Carrera creada con éxito");
                    setTimeout(() => setMensaje(null), 3000);
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    return (

        <>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium">Nombre de la Carrera</label>
                        <Input className={`w-full ${isInvalid ? 'border-red-300 focus:ring-red-200' : ''}`}
                            value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ingenieria Informatica" />
                        {!isInvalid && (
                            <p className="text-[10px] text-amber-600 mt-1 italic text-right">Requerido</p>
                        )}
                    </div>

                </div>


                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/carreras">
                        <Button variant="outline" type="button" >
                            Retroceder
                        </Button>
                    </Link>
                    <Button type="submit" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (major ? "Guardar cambios" : "Crear carrera")}
                    </Button>
                </div>
            </form>

        </>

    );
}