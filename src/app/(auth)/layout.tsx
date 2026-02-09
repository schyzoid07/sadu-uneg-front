import "../globals.css";
import { Separator } from "@radix-ui/react-separator";
import { Lato } from "next/font/google";
import HeaderBar from "@/components/HeaderBar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <HeaderBar />
        {children}
      </div>
    </div>
  );
}
