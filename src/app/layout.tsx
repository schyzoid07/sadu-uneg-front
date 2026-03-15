import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import HeaderBar from "@/components/HeaderBar";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
              <SidebarTrigger className="-ml-1" />

              <HeaderBar />
              <div className="min-h-[calc(100vh-64px)]">
                {children}
              </div>

            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
