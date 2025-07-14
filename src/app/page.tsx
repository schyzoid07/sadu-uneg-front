import { SportsCarousel } from "@/components/sportsCarousel";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <main>
        <SportsCarousel />
      </main>
      <footer className="flex flex-col items-center">
        <p>© 2025 SADUNEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
