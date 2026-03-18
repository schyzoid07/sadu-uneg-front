"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { formSchema } from "@/schemas/login-form";
import { createSession } from "@/lib/session";
import { api } from "@/lib/api";

export async function loginAction(values: z.infer<typeof formSchema>) {
    // Aquí es donde harías la llamada a tu API de backend para verificar las credenciales.
    // Por ahora, simularemos un login exitoso si la contraseña es "Password123@".

    console.log("Intentando iniciar sesión con:", values.email);

    let token;

    try {
        // 1. Hacemos la petición REAL a tu backend
        // El error 404 indica que la ruta no está en la raíz. 
        // Dado que RegisterUserRoutes usa un RouterGroup, probamos con el prefijo "users/".
        // Si en tu main.go el grupo es "/api" o "/auth", cambia "users/login" por esa ruta.
        const data: any = await api.post("users/login", {
            json: {
                // El backend reportó error en 'Username', así que enviamos la clave 'username'
                username: values.email,
                password: values.password
            }
        }).json();

        // Extraemos el token de la respuesta (usualmente en 'data' por el wrapper del backend)
        token = data.data || data.token;

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