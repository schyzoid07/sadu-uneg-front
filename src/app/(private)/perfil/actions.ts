"use server";

import { getSession, createSession } from "@/lib/session";

/**
 * Reescribe el correo guardado en la cookie de sesión de iron-session.
 *
 * La cookie encriptada guarda el correo con el que se entró, y `middleware.ts`
 * exige que exista para dar por autenticado al usuario. Al cambiar el correo
 * desde el perfil, esa copia queda vieja: no rompe la sesión (el token del API
 * identifica por id y se conserva), pero mostraría el correo anterior.
 *
 * Se llama después de que el backend confirma el cambio, nunca antes.
 */
export async function sincronizarCorreoDeSesion(correo: string) {
    const session = await getSession();
    if (!session) return;

    await createSession({ username: correo, token: session.token });
}
