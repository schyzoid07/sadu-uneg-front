"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { formSchema } from "@/schemas/login-form";
import { createSession } from "@/lib/session";

export async function loginAction(values: z.infer<typeof formSchema>) {
    // Aquí es donde harías la llamada a tu API de backend para verificar las credenciales.
    // Por ahora, simularemos un login exitoso si la contraseña es "Password123@".

    console.log("Intentando iniciar sesión con:", values.username);

    // --- SIMULACIÓN DE LLAMADA A API ---
    if (values.password !== "Password123@") {
        return { error: "Contraseña o correo incorrecto." };
    }
    // --- FIN DE SIMULACIÓN ---

    try {
        // Si las credenciales son correctas, creamos la sesión.
        await createSession({ username: values.username });
    } catch (error) {
        console.error("Error al crear la sesión:", error);
        return { error: "No se pudo iniciar sesión. Inténtalo de nuevo." };
    }

    // Redirigimos al usuario a la página principal.
    redirect("/");
}