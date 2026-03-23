'use client';

import EventCalendar from "@/components/event-calendar";
import { SportsCarousel } from "@/components/sportsCarousel";
import { useAthletes } from "@/hooks/athletes/use-athletes";
import { useEvents } from "@/hooks/events/use-events";
import { useMajors } from "@/hooks/majors/use-major";
import { useTeachers } from "@/hooks/teachers/use-teachers";
import { useTeams } from "@/hooks/teams/use-teams";
import { CalendarDays, GraduationCap, Shield, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: athletes, isLoading: isLoadingAthletes } = useAthletes();
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers();
  const { data: teams, isLoading: isLoadingTeams } = useTeams();
  const { data: events, isLoading: isLoadingEvents } = useEvents();
  const { data: majors, isLoading: isLoadingMajors } = useMajors();

  const athleteCount = athletes?.length ?? 0;
  const teacherCount = teachers?.length ?? 0;
  const teamCount = teams?.length ?? 0;
  const eventCount = events?.length ?? 0;
  const majorCount = majors?.length ?? 0;
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
            Centro Administrativo SADUNEG
          </h1>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl mx-auto">
            Panel de control y estadísticas generales del sistema.
          </p>
        </div>

        {/* Sección de Estadísticas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Tarjeta de Conteo de Atletas */}
          <Link href='/atletas' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">
                    Atletas Inscritos
                  </p>
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingAthletes ? (
                  <div className="h-10 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{athleteCount}</p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">Total de atletas registrados en el sistema.</p>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Profesores */}
          <Link href='/profesores' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">
                    Profesores
                  </p>
                  <UserCheck className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingTeachers ? (
                  <div className="h-10 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{teacherCount}</p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">Entrenadores y profesores activos.</p>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Carreras */}
          <Link href='/carreras' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">
                    Carreras
                  </p>
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingMajors ? (
                  <div className="h-10 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{majorCount}</p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Carreras universitarias disponibles.
              </p>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Equipos */}
          <Link href='/equipos' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">
                    Equipos
                  </p>
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingTeams ? (
                  <div className="h-10 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{teamCount}</p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">Equipos formados por disciplina.</p>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Eventos */}
          <Link href='/eventos' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">
                    Eventos
                  </p>
                  <CalendarDays className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingEvents ? (
                  <div className="h-10 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{eventCount}</p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">Eventos y torneos organizados.</p>
            </div>
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">Disciplinas Deportivas</h2>
        <SportsCarousel />

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">Calendario de Eventos</h2>
          <div
            className="cursor-pointer transition-transform hover:scale-[1.01] duration-200"
            onClick={() => router.push('/eventos')}
            title="Ir al calendario de eventos"
          >
            <div className="pointer-events-none">
              <EventCalendar events={events || []} />
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col items-center py-6 border-t bg-white">
        <p>© 2025 SADUNEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}