"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { formSchema } from "@/schemas/login-form";
import { createSession } from "@/lib/session";

export async function loginAction(values: z.infer<typeof formSchema>) {
    // Aquí es donde harías la llamada a tu API de backend para verificar las credenciales.
    // Por ahora, simularemos un login exitoso si la contraseña es "Password123@".

    console.log("Intentando iniciar sesión con:", values.email);

    let token;

    try {
        // 1. Hacemos la petición REAL a tu backend
        // Asumo que tu endpoint es /login o /auth/login, ajusta la URL si es distinta.
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // Ajusta las claves según lo que espere tu backend (ej: email o username)
                email: values.email,
                password: values.password
            })
        });

        if (!response.ok) {
            return { error: "Credenciales incorrectas o error en el servidor." };
        }

        const data = await response.json();
        // 2. Extraemos el token real. Ajusta 'token' si tu API devuelve 'accessToken' u otro nombre.
        token = data.token;

        if (!token) return { error: "El servidor no devolvió un token." };

        // Si las credenciales son correctas, creamos la sesión.
        await createSession({ username: values.email, token: token });
    } catch (error) {
        console.error("Error al crear la sesión:", error);
        return { error: "No se pudo iniciar sesión. Inténtalo de nuevo." };
    }

    // Redirigimos al usuario a la página principal.
    redirect("/");
}