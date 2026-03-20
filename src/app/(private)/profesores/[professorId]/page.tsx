"use client";

import { use } from "react";
import TeacherForm from "@/components/teacher-form";

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
    // Desempaquetamos los params usando el hook use() de React (compatible con Next.js 13+)
    const { id } = use(params);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Editar Profesor</h1>
                <p className="text-slate-500 text-sm">Actualiza la información del profesor y consulta sus eventos asignados.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 max-w-3xl border border-slate-100">
                <TeacherForm teacherId={id} />
            </div>
        </div>
    );
}
