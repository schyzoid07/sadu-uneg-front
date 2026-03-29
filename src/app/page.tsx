'use client';

import EventCalendar from "@/components/event-calendar";
import TourneyCalendar from "@/components/tourney-calendar";
import { SportsCarousel } from "@/components/sportsCarousel";
import { useAthletes } from "@/hooks/athletes/use-athletes";
import { useEvents } from "@/hooks/events/use-events";
import { useMajors } from "@/hooks/majors/use-major";
import { useTeachers } from "@/hooks/teachers/use-teachers";
import { useTeams } from "@/hooks/teams/use-teams";
import { useTourneys } from "@/hooks/tourneys/use-tourneys";
import { CalendarDays, GraduationCap, Shield, Trophy, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: athletes, isLoading: isLoadingAthletes } = useAthletes();
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers();
  const { data: teams, isLoading: isLoadingTeams } = useTeams();
  const { data: events, isLoading: isLoadingEvents } = useEvents();
  const { data: majors, isLoading: isLoadingMajors } = useMajors();
  const { data: tourneys, isLoading: isLoadingTourneys } = useTourneys();

  const athleteCount = athletes?.length ?? 0;
  const teacherCount = teachers?.length ?? 0;
  const teamCount = teams?.length ?? 0;
  const eventCount = events?.length ?? 0;
  const majorCount = majors?.length ?? 0;
  const tourneyCount = tourneys?.length ?? 0;
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 ">
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className=" p-6 bg-white border rounded-2xl shadow-sm flex-col flex-1 flex items-center group text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
            Centro Administrativo SADUNEG
            <p className="text-lg text-slate-500 mt-2 max-w-2xl mx-auto">
              Panel de control y estadísticas generales del sistema.
            </p>
          </h1>

        </div>

        {/* Sección de Estadísticas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Tarjeta de Conteo de Atletas */}
          <Link href='/atletas' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Atletas Inscritos</p>
                {isLoadingAthletes ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{athleteCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Registrados en sistema</p>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Profesores */}
          <Link href='/profesores' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Profesores</p>
                {isLoadingTeachers ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{teacherCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Entrenadores activos</p>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Carreras */}
          <Link href='/carreras' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Carreras</p>
                {isLoadingMajors ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{majorCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Oferta académica</p>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Equipos */}
          <Link href='/equipos' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Equipos</p>
                {isLoadingTeams ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{teamCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Por disciplina</p>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Eventos */}
          <Link href='/eventos' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <CalendarDays className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Eventos</p>
                {isLoadingEvents ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{eventCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Actividades registradas</p>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Conteo de Torneos */}
          {/* 
          <Link href='/torneos' className="block group">
            <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col justify-between h-full transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
         <Link href='/torneos' className="block group">
            <div className="p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
              <div className="p-4 bg-[#2b50aa] rounded-xl shadow-inner">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">Torneos</p>
                {isLoadingTourneys ? (
                  <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900">{tourneyCount}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Ligas universitarias</p>
              </div>
            </div>
          </Link>
          */}
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">Disciplinas Deportivas</h2>
        <SportsCarousel />

        <div className="mt-16 space-y-16">
          <div>
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

          <div>
            {/* <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">Calendario de Torneos</h2>*/}
            <div
              className="cursor-pointer transition-transform hover:scale-[1.01] duration-200"
              onClick={() => router.push('/torneos')}
              title="Ver torneos organizados"
            >
              {/* <div className="pointer-events-none">
                <TourneyCalendar tourneys={tourneys || []} />
              </div>*/}
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