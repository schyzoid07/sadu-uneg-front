"use client";

import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import "../app/globals.css";
import { Lato } from "next/font/google";
import Image from "next/image";
import { logoutAction } from "@/lib/actions";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { LogOut, User, UserCircle } from "lucide-react";
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
      <Link href='/'>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
            SADUNEG
          </h1>
          <p>Sistema de administracion deportiva 2025</p>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/perfil" title="Ir al perfil">
              <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100 rounded-full">
                <UserCircle className="h-8 w-8" />
              </Button>
            </Link>
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
