"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EyeIcon, Trash2Icon, CheckIcon, X, PlusIcon, SearchIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams, useDeleteTeam } from "@/hooks/teams/use-teams";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useUniversities } from "@/hooks/universities/use-universities";
import { useDebounce } from "@/hooks/use-debounce";
import EquipoForm from "@/components/equipo-form";
import Link from "next/link";

export default function Equipos() {
  const { data: teams, isLoading } = useTeams();
  const { data: disciplines } = useDisciplines();
  const { data: universities } = useUniversities();
  const deleteTeam = useDeleteTeam();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Estado para controlar la apertura del modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lógica de filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [onlyRegular, setOnlyRegular] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    return teams.filter((t) => {
      const lowerSearch = debouncedSearch.toLowerCase();
      const matchesSearch = t.Name.toLowerCase().includes(lowerSearch);
      const matchesRegular = onlyRegular ? t.Regular : true;
      const matchesCategory = categoryFilter === "all" || t.Category === categoryFilter;
      const matchesDiscipline = disciplineFilter === "all" || t.DisciplineID?.toString() === disciplineFilter;
      const matchesUniversity = universityFilter === "all" || t.UniversityID?.toString() === universityFilter;

      return matchesSearch && matchesRegular && matchesCategory && matchesDiscipline && matchesUniversity;
    });
  }, [teams, debouncedSearch, onlyRegular, categoryFilter, disciplineFilter, universityFilter]);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTeam.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* 1. Encabezado con Buscador y Botón de Creación */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
        <h1 className="text-xl font-bold text-slate-800">Gestión de Equipos</h1>

        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
          {/* Checkbox Filtro Titulares */}
          <div className="flex items-center gap-2 mr-2 mb-3">
            <Checkbox
              id="regular-filter"
              checked={onlyRegular}
              onCheckedChange={(checked) => setOnlyRegular(!!checked)}
            />
            <label
              htmlFor="regular-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Solo Titulares
            </label>
          </div>

          {/* Filtro Categoría */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Categoría</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Disciplina */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Disciplina</label>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-[140px] bg-white">
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

          {/* Filtro Universidad */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Universidad</label>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-[140px] bg-white">
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

          {/* Input de búsqueda */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              className="pl-8 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusIcon size={16} /> Nuevo Equipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Equipo</DialogTitle>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto px-1">
                <EquipoForm onSuccess={() => setIsModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 2. Contenedor de la Tabla */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption>
            {filteredTeams.length === 0 && !isLoading
              ? "No se encontraron equipos con ese criterio."
              : "Lista de equipos deportivos registrados en el sistema."}
          </TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Universidad</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-center">Titular</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Skeletons para estado de carga */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                </TableRow>
              ))
            }

            {/* Renderizado de equipos */}
            {filteredTeams?.map((team) => (
              <TableRow key={team.ID} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{team.Name}</TableCell>
                <TableCell>
                  {disciplines?.find(d => d.ID === team.DisciplineID)?.Name || team.DisciplineID}
                </TableCell>
                <TableCell>
                  {universities?.find(u => u.ID === team.UniversityID)?.Name || team.UniversityID}
                </TableCell>
                <TableCell>{team.Category}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {team.Regular ? (
                      <CheckIcon className="text-green-500" size={20} strokeWidth={3} />
                    ) : (
                      <X className="text-red-400" size={20} strokeWidth={3} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/equipos/${team.ID}`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-blue-50 hover:bg-blue-200 text-blue-600"
                      >
                        <EyeIcon size={16} />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-red-50 hover:bg-red-200 text-red-600"
                      onClick={() => setDeleteId(team.ID)}
                      disabled={deleteTeam.isPending}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-slate-700">
                ¿Estás seguro que quieres eliminar este equipo? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button onClick={confirmDelete} disabled={deleteTeam.isPending} className="bg-red-600 hover:bg-red-700">
                {deleteTeam.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
