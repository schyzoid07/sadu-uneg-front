import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import { AppSidebar } from "@/components/app-sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Separator } from "@radix-ui/react-separator";
import { Lato } from "next/font/google";

import Image from "next/image";
import { Providers } from "@/components/Providers";
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
      >
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />

                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </header>

              <div className="flex flex-1 flex-col gap-4 p-4">
                <header
                  className={`flex items-center justify-between p-4 text-(--uneg-blue) ${lato.variable}`}
                >
                  <div>
                    <Image
                      src={LOGO_UNEG}
                      alt="SADUNEG Logo"
                      width={100}
                      height={100}
                      
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">
                      SADUNEG
                    </h1>
                    <p>Sistema de administracion deportiva 2025</p>
                  </div>
                  <div>
                    <button className="hover:bg-blue-500 bg-blue-900 text-white font-bold py-2 px-4 rounded cursor-pointer hover:scale-110 transition duration-200">
                      Iniciar Sesión
                    </button>
                  </div>
                </header>
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
