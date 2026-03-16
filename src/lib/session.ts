import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Session } from "@/schemas/auth";

// Asegúrate de que estas variables de entorno estén en tu archivo .env.local
// SESSION_PASSWORD debe ser una cadena secreta larga y compleja de al menos 32 caracteres.
const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "sadu-uneg-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

/**
 * Obtiene la sesión actual del usuario desde la cookie encriptada.
 * Se puede usar en Server Components, Server Actions y Route Handlers.
 */
export async function getSession() {
  const session = await getIronSession<Session>(cookies(), sessionOptions);
  // Si la sesión no tiene un username, la consideramos vacía.
  if (!session.username) {
    return null;
  }
  return session;
}

/**
 * Crea una nueva sesión para el usuario, guardando sus datos en la cookie.
 */
export async function createSession(data: Session) {
  const session = await getIronSession<Session>(cookies(), sessionOptions);
  session.username = data.username;
  await session.save();
}

export async function deleteSession() {
  const session = await getIronSession<Session>(cookies(), sessionOptions);
  session.destroy();
}

