import Image from "next/image";
import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export async function SportsCarousel() {
  // Simulate fetching sports data
  const disciplinas = [
    { id: 1, name: "Fútbol", image: { LOGO_UNEG } },
    { id: 2, name: "Baloncesto", image: { LOGO_UNEG } },
    { id: 3, name: "Voleibol", image: { LOGO_UNEG } },
    { id: 4, name: "Béisbol", image: { LOGO_UNEG } },
    { id: 5, name: "Natación", image: { LOGO_UNEG } },
    { id: 6, name: "Atletismo", image: { LOGO_UNEG } },
    { id: 7, name: "Boxeo", image: { LOGO_UNEG } },
    { id: 8, name: "Artes Marciales", image: { LOGO_UNEG } },
    { id: 9, name: "Ciclismo", image: { LOGO_UNEG } },
    { id: 10, name: "Tenis", image: { LOGO_UNEG } },
  ];
  return (
    <Carousel>
      <CarouselNext />
      <CarouselContent>
        {disciplinas.map((disciplina) => (
          <CarouselItem key={disciplina.id} className="basis-1/3">
            <div className="p-4 bg-gray-200 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{disciplina.name}</h2>
              {disciplina.image && (
                <Image
                  src={LOGO_UNEG}
                  alt={disciplina.name}
                  width={200}
                  height={200}
                  className="w-full h-auto rounded-lg"
                />
              )}
              <p>Detalles sobre {disciplina.name}...</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
    </Carousel>
  );
}
