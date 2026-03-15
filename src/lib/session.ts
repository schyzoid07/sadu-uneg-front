import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session_token";

export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: false, // Allow client-side access for API calls
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}
