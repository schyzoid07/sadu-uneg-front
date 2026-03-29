'use client'
import { useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";

// Componente para intentar cargar la imagen en múltiples formatos
function DisciplineImage({ name }: { name: string }) {
  const extensions = ["webp", "jpg", "png", "jpeg", "svg", "jfif", "tiff", "bmp", "avif"];
  const [extIndex, setExtIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  // Normalización del nombre: "Fútbol Campo" -> "futbol-campo"
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  // Intentamos la extensión actual o usamos el logo si ya agotamos todas
  const currentSrc = useFallback
    ? "/loading.avif"
    : `/images/disciplines/${normalizedName}.${extensions[extIndex]}`;

  return (
    <Image
      src={currentSrc}
      alt={name}
      width={200}
      height={200}
      className="w-full h-auto rounded-lg"
      onError={() => {
        if (extIndex < extensions.length - 1) {
          setExtIndex(extIndex + 1); // Prueba la siguiente extensión
        } else {
          setUseFallback(true); // Agotó opciones, usa el logo
        }
      }}
    />
  );
}

export function SportsCarousel() {
  const { data: disciplines, isLoading } = useDisciplines();

  return (
    <Carousel className="mx-10">
      <CarouselContent>

        {isLoading ? (
          <div className="p-4 w-full text-center text-slate-500">Cargando disciplinas...</div>
        ) : disciplines?.map((disciplina) => (
          <CarouselItem
            key={disciplina.ID}

            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 flex flex-col items-center justify-center p-4 border-4 rounded-2xl mx-2"
          >
            <div className="flex flex-col items-center bg-white rounded-t-full">

              <DisciplineImage name={disciplina.Name} />

              <h3 className="text-lg font-semibold pt-4">{disciplina.Name}</h3>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
