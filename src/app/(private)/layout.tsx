import HeaderBar from "@/components/HeaderBar";
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

/**
 * Chrome de la aplicación con sesión iniciada: barra lateral, cabecera y el área
 * de contenido. El grupo `(private)` no cambia las URLs, solo delimita qué
 * pantallas llevan esta envoltura; el login queda fuera a propósito.
 */
export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger className="-ml-1" />

                <HeaderBar />
                <Separator />
                <main className="min-h-[calc(100vh-64px)]">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
