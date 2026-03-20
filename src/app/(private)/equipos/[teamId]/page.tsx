"use client";

import { use } from "react";
import EquipoForm from "@/components/equipo-form";

// Definimos el tipo de params como una Promesa
export default function EditTeamPage({ params }: { params: Promise<{ teamId: string }> }) {
    // Desempaquetamos los params usando el hook use()
    const { teamId } = use(params);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Editar Equipo</h1>
                <p className="text-slate-500 text-sm">Actualiza la información del equipo y sus integrantes.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-slate-100 max-w-3xl">
                <EquipoForm teamId={teamId} />
            </div>
        </div>
    );
}
