"use client";

import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import "../app/globals.css";
import { Lato } from "next/font/google";
import Image from "next/image";
import { logoutAction } from "@/lib/actions";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";


const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export default function HeaderBar() {
  const { session } = useAuth();

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between ${lato.variable} font-sans`}
    >
      <div className=" flex-col flex-1 flex items-center group">
      <Link href='https://uneg.edu.ve/' className="hover:opacity-80 transition-opacity">
        <div className="mb-1">
          <Image
            src={LOGO_UNEG}
            alt="SADUNEG Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </Link>
      <Link href='/'>
        <div className="flex flex-col items-center">
          <h1 className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 
               bg-clip-text text-transparent text-4xl font-extrabold  tracking-tight leading-none">
            SADUNEG
          </h1>
        </div>
      </Link>
      </div>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </form>
          </>
        ) : (
          // Opcional: Mostrar botón de inicio si no hay sesión
          <Link href="/login">
            <Button className="bg-black text-white hover:bg-gray-800">
              Iniciar Sesión
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
