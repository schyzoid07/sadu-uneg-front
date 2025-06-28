import { SportsCarousel } from "@/components/sportsCarousel";
import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <header>
        <div>
          <Image src={LOGO_UNEG} alt="SADUNEG Logo" width={100} height={100} />
        </div>
        <div>
          <h1>SADUNEG</h1>
          <p>Sistema de administracion deportiva 2025</p>
        </div>
        <div></div>
      </header>
      <main>
        <SportsCarousel />
      </main>
      <footer>
        <p>© 2025 SADUNEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
