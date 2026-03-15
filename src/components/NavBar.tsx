'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Navbar() {
    // Estado local para el usuario.
    // NOTA: En una implementación real, esto vendría de tu contexto de autenticación o hook (ej: useAuth).
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        // Aquí deberías verificar la sesión real (localStorage, cookie, o llamada a API).
        // Ejemplo simple verificando localStorage:
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error al leer usuario", error);
            }
        }

        // Para probar visualmente el estado "logueado", puedes descomentar esto:
        // setUser({ name: "Estudiante UNEG" });
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm h-24">
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                {/* Sección Izquierda: Nombre del sitio */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="text-2xl font-bold text-[#2f34a0] hover:opacity-90 transition-opacity">
                        SADUNEG
                    </Link>
                </div>

                {/* Centro: Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="block hover:opacity-90 transition-opacity">
                        <Image
                            src="/LOGO_UNEG.webp"
                            alt="Logo UNEG"
                            width={80}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Sección Derecha: Login o Usuario */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    {user ? (
                        // Estado Logueado: Muestra nombre y link a perfil
                        <Link href="/profile">
                            <Button
                                variant="ghost"
                                className="font-semibold text-slate-700 hover:text-[#2f34a0] hover:bg-slate-50"
                            >
                                Hola, {user.name}
                            </Button>
                        </Link>
                    ) : (
                        // Estado No Logueado: Botones de Login/Registro
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-slate-600 hover:text-[#2f34a0]">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-[#2f34a0] hover:bg-[#242885] text-white transition-colors">
                                    Registrarse
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
