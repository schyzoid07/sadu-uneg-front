"use client";

import { CorreoForm, ContrasenaForm } from "@/components/perfil-form";
import { useProfile } from "@/hooks/users/use-profile";

export default function PerfilPage() {
    const { data: perfil } = useProfile();

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mi perfil</h1>
                <p className="text-slate-500 mt-1">
                    {perfil
                        ? <>Sesión iniciada como <span className="font-medium text-slate-700">{perfil.username}</span>.</>
                        : "Datos de la cuenta con la que iniciaste sesión."}
                </p>
            </div>

            <CorreoForm />
            <ContrasenaForm />
        </div>
    );
}
