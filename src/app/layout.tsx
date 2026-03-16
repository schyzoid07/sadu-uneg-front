import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import HeaderBar from "@/components/HeaderBar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { getSession } from "@/lib/session";
import { Separator } from "@/components/ui/separator";


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
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <SidebarTrigger className="-ml-1" />

                <HeaderBar />
                <Separator />
                <div className="min-h-[calc(100vh-64px)]">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
