"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { formSchema } from "@/schemas/login-form";
import { createSession } from "@/lib/session";
import { api } from "@/lib/api";

export async function loginAction(values: z.infer<typeof formSchema>) {
    // Aquí es donde harías la llamada a tu API de backend para verificar las credenciales.
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
        }).json(); // .json() ya convierte la respuesta a objeto, no necesitas JSON.parse

        console.log("Respuesta del Backend:", data);

        if (data && data.data) {
            token = data.data;
            console.log("Token asignado:", token);
        } else {
            console.error("El backend no envió la propiedad 'data' con el token");
        }
        // Extraemos el token de la respuesta (usualmente en 'data' por el wrapper del backend)
        // Estructura confirmada: { "data": "token_string", "message": "..." }
        // Si data.data es un string, lo usamos; si no, buscamos anidados por seguridad
        token = typeof data.data === 'string' ? data.data : data.data?.token || data.token;

        if (!token) return { error: "El servidor no devolvió un token." };

        // Si las credenciales son correctas, creamos la sesión.
        await createSession({ username: values.email, token: token });
    } catch (error: any) {
        console.error("Error al crear la sesión:", error);

        if (error?.response) {
            try {
                // Intentamos leer el mensaje que envía helpers.SendError (ej: "Invalid credentials")
                const errorData = await error.response.json();
                console.error("Respuesta del backend:", errorData); // Ver qué dice exactamente el backend
                if (errorData.message) return { error: errorData.message };
                // Algunos backends usan 'error' en lugar de 'message'
                if (errorData.error) return { error: errorData.error };
            } catch { }
        }

        return { error: "No se pudo iniciar sesión. Credenciales inválidas." };
    }

    // Redirigimos al usuario a la página principal.
    redirect("/");
}