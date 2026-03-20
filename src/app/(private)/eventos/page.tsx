"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, ListIcon, SearchIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEvents, useDeleteEvent } from "@/hooks/events/use-events";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCalendar from "@/components/event-calendar";
import EventCard from "@/components/event-card";
import { useUniversities } from "@/hooks/universities/use-universities";

export default function Eventos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchTerm = searchParams.get("search") || "";

  // Lógica de borrado
  const deleteMutation = useDeleteEvent();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Lógica de navegación (URL)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Hook personalizado
  // useEvents no acepta argumentos en el hook definido, así que filtramos en cliente
  const { data: events, isLoading } = useEvents();
  console.log(events);
  const { data: disciplines } = useDisciplines();
  const { data: universities } = useUniversities();
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((e) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = e.Name.toLowerCase().includes(lowerSearch);
      const matchesDiscipline =
        disciplineFilter === "all" ||
        e.Discipline?.ID.toString() === disciplineFilter;

      const homeTeamUniversityId = e.HomeTeam?.University?.ID ?? e.HomeTeam?.UniversityID;
      const oppositeTeamUniversityId = e.OppositeTeam?.University?.ID ?? e.OppositeTeam?.UniversityID;
      const matchesUniversity =
        universityFilter === "all" ||
        homeTeamUniversityId?.toString() === universityFilter ||
        oppositeTeamUniversityId?.toString() === universityFilter;

      return matchesSearch && matchesDiscipline && matchesUniversity;
    });
  }, [events, searchTerm, disciplineFilter, universityFilter]);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <h1 className="text-xl font-bold">Gestión de Eventos</h1>

        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">

          {/*filtro de disciplinas*/}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Disciplina</label>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {disciplines?.map((d) => (
                  <SelectItem key={d.ID} value={d.ID.toString()}>{d.Name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/*filtro de universidades */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Universidad</label>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Universidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {universities?.map((u) => (
                  <SelectItem key={u.ID} value={u.ID.toString()}>{u.Name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              defaultValue={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 bg-white"
            />
          </div>
          <Button className="bg-green-900 hover:bg-green-800 text-white font-bold transition duration-200 flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Añadir Evento
          </Button>
        </div>
      </div>

      {/* Vista de Calendario */}
      <div className="px-4">
        <EventCalendar events={filteredEvents} />
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 mb-2 mt-8">
          <ListIcon className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-700">Listado de Eventos</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((evento) => (
              <EventCard key={evento.ID} event={evento} onDelete={setDeleteId} />
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500">
                No se encontraron eventos con los criterios seleccionados.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Evento</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-slate-600">
            ¿Estás seguro de que deseas eliminar este evento? Se perderán los datos del marcador.
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}