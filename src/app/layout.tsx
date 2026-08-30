import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/components/AuthProvider";
import { getSession } from "@/lib/session";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SADUNEG",
  description: "App para la administracion de SADUNEG",
};

/**
 * Layout raíz: solo lo que necesitan todas las pantallas, con y sin sesión.
 *
 * La barra lateral vive en el layout de `(private)`, no aquí: montada en la raíz
 * también se dibujaba sobre el login —que es adonde manda `middleware.ts` a quien
 * no ha iniciado sesión— con enlaces a secciones que en ese momento devuelven al
 * propio login.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
      >
        <AuthProvider session={session}>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
