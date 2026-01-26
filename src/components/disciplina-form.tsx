"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateDiscipline } from "@/hooks/disciplines/use-create-discipline";
import { useUpdateDiscipline } from "@/hooks/disciplines/use-update-discipline";
import { Discipline } from "@/hooks/disciplines/use-disciplines";

interface DisciplinaFormProps {
    onSuccess?: () => void;
    discipline?: Discipline | null; // si se pasa, entra en modo edición
}

export default function DisciplinaForm({ onSuccess, discipline }: DisciplinaFormProps) {
    const [name, setName] = useState("");
    const createMutation = useCreateDiscipline();
    const updateMutation = useUpdateDiscipline();

    useEffect(() => {
        if (discipline) {
            setName(discipline.name ?? "");
        } else {
            setName("");
        }
    }, [discipline]);

    const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault?.();

        if (discipline && discipline.id) {
            updateMutation.mutate(
                { id: discipline.id, data: { name } },
                {
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                }
            );
        } else {
            createMutation.mutate(
                { name },
                {
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                }
            );
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="text-sm font-medium">Nombre de la disciplina</label>
                <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => { if (onSuccess) onSuccess(); }}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (discipline ? "Actualizar" : "Crear")}
                </Button>
            </div>
        </form>
    );
}