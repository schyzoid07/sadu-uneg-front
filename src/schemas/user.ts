import { z } from "zod";

/**
 * Perfil de la cuenta con la sesión abierta (`GET /users/me`).
 *
 * Las rutas de `/users` usan claves en minúscula (`id`, `username`), a diferencia
 * de los DTO de los recursos, que copian los nombres exportados de Go.
 *
 * `username` es el correo con el que se inicia sesión: el backend lo busca en esa
 * misma columna al validar las credenciales.
 */
export const profileSchema = z.object({
    id: z.number(),
    username: z.string(),
});

/** Cambio del correo de acceso (`PUT /users/change-username`). */
export const changeEmailSchema = z.object({
    currentPassword: z.string().min(1, "Escribe tu contraseña actual."),
    newUsername: z.string().email("Escribe un correo electrónico válido."),
});

/**
 * Cambio de contraseña (`PUT /users/change-password`). El mínimo de 8 caracteres
 * es el que valida el backend (`binding:"min=8"`); pedirlo aquí evita un 400 que
 * el formulario tendría que traducir.
 */
export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Escribe tu contraseña actual."),
    newPassword: z.string().min(8, "La contraseña nueva debe tener al menos 8 caracteres."),
});

export type Profile = z.infer<typeof profileSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
