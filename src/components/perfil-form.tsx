"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { useProfile, useChangeEmail, useChangePassword } from "@/hooks/users/use-profile";
import { changeEmailSchema, changePasswordSchema } from "@/schemas/user";
import { sincronizarCorreoDeSesion } from "@/app/(private)/perfil/actions";

/**
 * Traduce el error de `ky` al motivo que explica el backend.
 *
 * Las respuestas de error traen el detalle en `detail` (correo en uso, contraseña
 * actual incorrecta). Sin esto, un 409 o un 400 se verían como si no hubiera
 * pasado nada.
 */
async function mensajeDeError(error: any, porDefecto: string): Promise<string> {
    try {
        const body = await error?.response?.json();
        if (body?.detail) return body.detail;
    } catch { }
    return porDefecto;
}

type Aviso = { tipo: "ok" | "error"; texto: string } | null;

function CajaDeAviso({ aviso }: { aviso: Aviso }) {
    if (!aviso) return null;
    return (
        <div
            className={`p-3 rounded-md text-sm ${aviso.tipo === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                }`}
        >
            {aviso.texto}
        </div>
    );
}

/** Cambio del correo con el que se inicia sesión. */
export function CorreoForm() {
    const { data: perfil, isLoading } = useProfile();
    const mutacion = useChangeEmail();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [aviso, setAviso] = useState<Aviso>(null);

    // El campo arranca con el correo actual para que se vea cuál es el que hay que
    // editar; solo se precarga al llegar el perfil, no en cada render.
    useEffect(() => {
        if (perfil) setCorreo(perfil.username);
    }, [perfil]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAviso(null);

        const datos = { currentPassword: contrasena, newUsername: correo.trim() };
        const validacion = changeEmailSchema.safeParse(datos);
        if (!validacion.success) {
            setAviso({ tipo: "error", texto: validacion.error.issues[0].message });
            return;
        }

        try {
            await mutacion.mutateAsync(validacion.data);
            // El backend guarda el correo en minúsculas, así que la sesión y el campo
            // muestran lo mismo que quedó grabado.
            const guardado = validacion.data.newUsername.toLowerCase();
            setCorreo(guardado);
            await sincronizarCorreoDeSesion(guardado);
            setContrasena("");
            setAviso({ tipo: "ok", texto: "Correo actualizado. Úsalo la próxima vez que inicies sesión." });
        } catch (error: any) {
            setAviso({ tipo: "error", texto: await mensajeDeError(error, "No se pudo cambiar el correo.") });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-white">
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Correo de acceso</h2>
            </div>
            <p className="text-sm text-slate-500">
                Es el correo con el que inicias sesión. Para cambiarlo hay que confirmar la
                contraseña actual.
            </p>

            <CajaDeAviso aviso={aviso} />

            <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                    id="correo"
                    type="email"
                    autoComplete="username"
                    placeholder={isLoading ? "Cargando..." : "admin@uneg.edu.ve"}
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contrasena-actual-correo">Contraseña actual</Label>
                <Input
                    id="contrasena-actual-correo"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Tu contraseña de ahora"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={mutacion.isPending || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {mutacion.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar correo
                </Button>
            </div>
        </form>
    );
}

/** Cambio de contraseña. */
export function ContrasenaForm() {
    const mutacion = useChangePassword();

    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [repetida, setRepetida] = useState("");
    const [aviso, setAviso] = useState<Aviso>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAviso(null);

        // La repetición se comprueba aquí: el backend no la recibe, solo evita el
        // error de tipeo que dejaría al usuario fuera en el siguiente inicio.
        if (nueva !== repetida) {
            setAviso({ tipo: "error", texto: "La contraseña nueva y su repetición no coinciden." });
            return;
        }

        const validacion = changePasswordSchema.safeParse({ oldPassword: actual, newPassword: nueva });
        if (!validacion.success) {
            setAviso({ tipo: "error", texto: validacion.error.issues[0].message });
            return;
        }

        try {
            await mutacion.mutateAsync(validacion.data);
            setActual("");
            setNueva("");
            setRepetida("");
            setAviso({ tipo: "ok", texto: "Contraseña actualizada. La sesión abierta sigue siendo válida." });
        } catch (error: any) {
            setAviso({ tipo: "error", texto: await mensajeDeError(error, "No se pudo cambiar la contraseña.") });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-white">
            <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Contraseña</h2>
            </div>
            <p className="text-sm text-slate-500">
                Mínimo 8 caracteres. Al guardarla, la sesión abierta no se cierra.
            </p>

            <CajaDeAviso aviso={aviso} />

            <div className="space-y-2">
                <Label htmlFor="contrasena-actual">Contraseña actual</Label>
                <Input
                    id="contrasena-actual"
                    type="password"
                    autoComplete="current-password"
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contrasena-nueva">Contraseña nueva</Label>
                    <Input
                        id="contrasena-nueva"
                        type="password"
                        autoComplete="new-password"
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contrasena-repetida">Repetir contraseña nueva</Label>
                    <Input
                        id="contrasena-repetida"
                        type="password"
                        autoComplete="new-password"
                        value={repetida}
                        onChange={(e) => setRepetida(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={mutacion.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {mutacion.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar contraseña
                </Button>
            </div>
        </form>
    );
}
