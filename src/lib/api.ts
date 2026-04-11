import ky from "ky";

const API_BASE_URL = "http://localhost:8080";
const SESSION_COOKIE_NAME = "session_token";

// Helper to get a cookie value (client or server)
async function getSessionToken(): Promise<string | undefined> {
  // Client side
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${SESSION_COOKIE_NAME}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  } else {
    // Server side
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch (error) {
      console.warn("Could not access cookies on server", error);
    }
  }
  return undefined;
}

// Helper to delete a cookie on the client
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}


export const api = ky.create({
  prefixUrl: API_BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getSessionToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          if (typeof document !== 'undefined') {
            deleteCookie(SESSION_COOKIE_NAME);
            // Si el token es rechazado, redirigir al login
            window.location.href = '/login';
          }
        }
      }
    ]
  },

});
