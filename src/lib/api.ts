import ky from "ky";

const API_BASE_URL = "http://localhost:8080";
const SESSION_COOKIE_NAME = "session_token";

// Helper to get a cookie value on the client
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
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
      (request) => {
        const token = getCookie(SESSION_COOKIE_NAME);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          deleteCookie(SESSION_COOKIE_NAME);
          // Si el token es rechazado, redirigir al login
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      }
    ]
  },

});
