"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useCreateUniversity, useUpdateUniversity } from "@/hooks/universities/use-universities";
import { University, UniversityInput } from "@/schemas/universities";

interface UniversidadFormProps {
    onSuccess?: () => void;
    university?: University | null;
}

export default function UniversidadForm({ onSuccess, university }: UniversidadFormProps) {
    const [name, setName] = useState("");
    const [isLocal, setIsLocal] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const createMutation = useCreateUniversity();
    const updateMutation = useUpdateUniversity();

    useEffect(() => {
        if (university) {
            setName(university.Name ?? "");
            setIsLocal(!!university.Local);
        } else {
            setName("");
            setIsLocal(false);
        }
    }, [university]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isInvalid = name.trim().length === 0;
    const isUnchanged = university ? (name.trim() === university.Name && isLocal === (university.Local ?? false)) : false;
    const canSubmit = !isInvalid && !isUnchanged;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();
        if (!canSubmit) return;

        const payload: UniversityInput = {
            Name: name.trim(),
            Local: isLocal,
        };

        if (university && university.ID) {
            updateMutation.mutate(
                { id: university.ID, json: payload },
                {
                    onSuccess: () => {
                        setMensaje("Universidad actualizada con éxito");
                        if (onSuccess) setTimeout(onSuccess, 1000);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    setMensaje("Universidad creada con éxito");
                    if (onSuccess) setTimeout(onSuccess, 1000);
                },
            });
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {mensaje && (
                <div className="p-3 rounded-md text-sm bg-green-50 text-green-600 border border-green-200">
                    {mensaje}
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Universidad</label>
                <Input
                    className={isInvalid ? "border-amber-200" : ""}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Universidad Nacional Experimental de Guayana"
                />
                {isInvalid && (
                    <p className="text-[10px] text-amber-600 italic text-right">Requerido</p>
                )}
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <Checkbox
                    id="local-checkbox"
                    checked={isLocal}
                    onCheckedChange={(checked) => setIsLocal(!!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="local-checkbox" className="text-sm font-semibold leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Sede Local (UNEG)
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                        Marcar si esta es una sede local de la universidad.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" type="button" onClick={() => onSuccess?.()} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={!canSubmit || isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                        university ? "Guardar Cambios" : "Crear Universidad"
                    )}
                </Button>
            </div>
        </form>
    );
}