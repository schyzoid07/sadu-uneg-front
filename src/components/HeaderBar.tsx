import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import "../app/globals.css";
import { Lato } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export default function HeaderBar() {
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
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
          SADUNEG
        </h1>
        <p>Sistema de administracion deportiva 2025</p>
      </div>
      <div>
        <Link href="/login">
          <button className="hover:bg-blue-800 bg-blue-900 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-100">
            Iniciar Sesión
          </button>
        </Link>
      </div>
    </header>
  );
}
