import "server-only";
import { cookies } from "next/headers";
import { unsealData } from "iron-session";
import { Session } from "@/schemas/auth";

// Esta es una implementación de EJEMPLO usando iron-session.
// Debes adaptarla a cómo estés manejando las cookies de sesión en tu backend.
export async function getSession(): Promise<Session | null> {
    const cookieName = process.env.SESSION_COOKIE_NAME!;
    const password = process.env.SESSION_PASSWORD;

    if (!password) {
        console.error("Error: SESSION_PASSWORD no definida.");
        return null;
    }

    const cookie = (await cookies()).get(cookieName)?.value;
    if (!cookie) return null;
    try {
        const session = await unsealData<Session>(cookie, {
            password: password,
        });
        return session;
    } catch (error) {
        console.error("Fallo al desencriptar la sesión:", error);
        return null;
    }
}