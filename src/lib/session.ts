import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Session } from "@/schemas/auth";

// Asegúrate de que estas variables de entorno estén en tu archivo .env.local
// SESSION_PASSWORD debe ser una cadena secreta larga y compleja de al menos 32 caracteres.
const password = process.env.SESSION_PASSWORD;

if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD debe estar configurada en .env.local y tener al menos 32 caracteres.");
}

export const sessionOptions = {
  password: password,
  cookieName: process.env.SESSION_COOKIE_NAME || "sadu-uneg-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

/**
 * Obtiene la sesión actual del usuario desde la cookie encriptada.
 * Se puede usar en Server Components, Server Actions y Route Handlers.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  const tokenCookie = cookieStore.get("session_token");
  // Si la sesión no tiene un username, la consideramos vacía.
  if (!session.username || !tokenCookie) {
    return null;
  }
  // Devolvemos un objeto nuevo con solo los datos necesarios.
  // Esto elimina los métodos ocultos de la sesión que causan el error en Next.js.
  return { username: session.username, token: session.token };
}

/**
 * Crea una nueva sesión para el usuario, guardando sus datos en la cookie.
 */
export async function createSession(data: Session) {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  session.username = data.username;
  session.token = data.token;
  await session.save();

  // Guardamos el token en una cookie visible para el cliente (ky/api.ts)
  if (data.token) {
    cookieStore.set("session_token", data.token, { // Nota: Esta es una cookie separada para acceso JS
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Permitir acceso desde JS del cliente para api.ts
      path: "/",
      sameSite: "lax",
    });
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  session.destroy();
  cookieStore.delete("session_token"); // Borrar también la cookie del token
}
