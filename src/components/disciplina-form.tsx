"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ImageUp } from "lucide-react";
import { useCreateDiscipline, useUpdateDiscipline, Discipline } from "@/hooks/disciplines/use-disciplines";
import { uploadDisciplineImage } from "@/app/actions";
import Image from "next/image";

interface DisciplinaFormProps {
    onSuccess?: () => void;
    discipline?: Discipline | null;
}

function getImageUrl(name: string): string {
    const normalizedName = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
    return `/images/disciplines/${normalizedName}.webp`;
}

export default function DisciplinaForm({ onSuccess, discipline }: DisciplinaFormProps) {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const createMutation = useCreateDiscipline();
    const updateMutation = useUpdateDiscipline();

    useEffect(() => {
        if (discipline) {
            setName(discipline.Name ?? "");
            setImageError(false);
        } else {
            setName("");
            setFile(null);
            setImageError(false);
        }
    }, [discipline]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending || uploading;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault?.();

        if (!name.trim()) return;

        if (file) {
            setUploading(true);
            const result = await uploadDisciplineImage(name, file);
            setUploading(false);

            if (result?.error) {
                console.error("Error al subir imagen:", result.error);
                return;
            }
        }

        if (discipline && discipline.ID) {
            updateMutation.mutate(
                { id: discipline.ID, data: { Name: name } },
                {
                    onSuccess: () => {
                        setFile(null);
                        if (onSuccess) onSuccess();
                    },
                }
            );
        } else {
            createMutation.mutate(
                { Name: name },
                {
                    onSuccess: () => {
                        setFile(null);
                        if (onSuccess) onSuccess();
                    },
                }
            );
        }
    };

    const previewUrl = file ? URL.createObjectURL(file) : null;
    const currentImageUrl = discipline ? getImageUrl(discipline.Name) : null;

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="text-sm font-medium">Nombre de la disciplina</label>
                <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
            </div>

            <div>
                <label className="text-sm font-medium">Imagen</label>
                <p className="text-xs text-amber-600 mb-1">Preferiblemente en formato .webp para mejor rendimiento</p>
                <div className="flex items-center gap-4 mt-1">
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-slate-50 text-sm">
                        <ImageUp className="h-4 w-4" />
                        {file ? file.name : "Seleccionar archivo"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                    {discipline && (
                        <a
                            href={currentImageUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Ver imagen actual
                        </a>
                    )}
                </div>
                {previewUrl && (
                    <div className="mt-2 relative w-20 h-20">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-lg" />
                    </div>
                )}
                {!previewUrl && currentImageUrl && !imageError && (
                    <div className="mt-2 relative w-20 h-20">
                        <Image
                            src={currentImageUrl}
                            alt={discipline?.Name || ""}
                            fill
                            className="object-cover rounded-lg"
                            onError={() => setImageError(true)}
                        />
                    </div>
                )}
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