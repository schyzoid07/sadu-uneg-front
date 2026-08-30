import HeaderBar from "@/components/HeaderBar";
import { Separator } from "@/components/ui/separator";

/**
 * Pantallas sin sesión. Conservan la cabecera con la marca, pero no la barra
 * lateral: sus enlaces exigen sesión y `middleware.ts` los devolvería aquí mismo.
 */
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full">
            <HeaderBar />
            <Separator />
            <main className="min-h-[calc(100vh-64px)]">
                {children}
            </main>
        </div>
    );
}
