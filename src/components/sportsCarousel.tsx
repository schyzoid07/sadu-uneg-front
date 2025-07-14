import Image from "next/image";
import LOGO_UNEG from "@/../public/LOGO_UNEG.webp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export async function SportsCarousel() {
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
    <Carousel className="mx-10">
      <CarouselContent>
        {disciplinas.map((disciplina) => (
          <CarouselItem
            key={disciplina.id}
            className="basis=1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 flex flex-col items-center justify-center p-4  border-4 rounded-2xl mx-2"
          >
            <div className="flex flex-col items-center bg-white rounded-t-full">
              {disciplina.image && (
                <Image
                  src={LOGO_UNEG}
                  alt={disciplina.name}
                  aspect-ratio={1 / 3}
                  className="w-full h-auto rounded-lg"
                />
              )}
              <h3 className="text-lg font-semibold pt-4">{disciplina.name}</h3>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
