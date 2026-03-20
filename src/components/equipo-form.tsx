"use client";

import { useState, useEffect } from "react";
import { useAthletes } from "@/hooks/athletes/use-athletes";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useUniversities } from "@/hooks/universities/use-universities";
import { useCreateTeam, useUpdateTeam, useTeam } from "@/hooks/teams/use-teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";

interface EquipoFormProps {
  onSuccess?: () => void;
  teamId?: string; // Agregamos la prop opcional para el ID
}

export default function EquipoForm({ onSuccess, teamId }: EquipoFormProps) {
  // 1. Hooks de datos
  const { data: athletes, isLoading: loadingAthletes } = useAthletes();
  // Hook para obtener datos del equipo si estamos editando
  const { data: team, isLoading: loadingTeam } = useTeam(teamId);
  const { data: disciplines } = useDisciplines();
  const { data: universities } = useUniversities();

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  // 2. Estados locales
  const [teamName, setTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [regular, setRegular] = useState(false);
  const [disciplineId, setDisciplineId] = useState<string>("");
  const [universityId, setUniversityId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Cargar datos al editar cuando 'team' esté disponible
  useEffect(() => {
    if (teamId && team) {
      console.log("📝 [FORM] Datos cargados para editar:", team);
      setTeamName(team.Name || "");
      setRegular(team.Regular || false);

      // Buscar ID en la propiedad plana o dentro del objeto anidado
      // Nos aseguramos de manejar el caso donde DisciplineID puede ser 0 o undefined
      const dId = team.Discipline?.ID || team.DisciplineID;
      if (dId) {
        setDisciplineId(dId.toString());
      }

      // Cargar ID de Universidad
      const uId = team.University?.ID || team.UniversityID;
      if (uId) {
        setUniversityId(uId.toString());
      }

      // Asumiendo que team.Athletes es un array de objetos y queremos sus IDs
      if (team.Athletes && Array.isArray(team.Athletes)) {
        setSelectedIds(team.Athletes.map((a: any) => a.ID));
      } else if (team.AthleteIDs && Array.isArray(team.AthleteIDs)) {
        // Si el backend envía directamente los IDs
        setSelectedIds(team.AthleteIDs);
      }
    }
  }, [team, teamId]);

  // 3. Lógica de filtrado de atletas para la lista
  const filteredAthletes = athletes?.filter((a) =>
    `${a.FirstNames} ${a.LastNames}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.GovID.includes(searchTerm)
  );

  const toggleAtleta = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSubmitting = createTeamMutation.isPending || updateTeamMutation.isPending;

  // 4. Función de envío
  const handleSave = async () => {
    const payload: any = { // Usamos any temporalmente o la interfaz actualizada TeamInput
      Name: teamName,
      DisciplineID: parseInt(disciplineId),
      // Usar ID de universidad existente (plano u objeto) o 1 por defecto
      UniversityID: parseInt(universityId) || 1,
      AthleteIDs: selectedIds,
      Regular: regular,
    };

    console.log("🚀 [POST/PUT] Payload a enviar:", payload);

    try {
      if (teamId && team) {
        // Modo Edición
        await updateTeamMutation.mutateAsync({ id: team.ID, data: payload });
        setMensaje("Equipo actualizado correctamente.");
      } else {
        // Modo Creación
        await createTeamMutation.mutateAsync(payload);
        setMensaje("Equipo creado correctamente.");
      }

      // Limpiar mensaje y notificar éxito
      setTimeout(() => setMensaje(null), 3000);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      setMensaje("Error al guardar el equipo.");
    }
  };

  // Mostrar loading mientras se cargan los datos del equipo a editar
  if (teamId && loadingTeam) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {mensaje && (
        <div className={`p-3 rounded-md text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {mensaje}
        </div>
      )}

      {/* Campo: Nombre del Equipo */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Nombre del Equipo</label>
        <Input
          placeholder="Ej: Selección de Voleibol Masculino"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {/* Campo: Selección de Disciplina */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Disciplina</label>
        <select
          className="w-full text-sm p-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          value={disciplineId}
          onChange={(e) => setDisciplineId(e.target.value)}
        >
          <option value="" disabled>Selecciona una disciplina</option>
          {disciplines?.map((d) => (
            <option key={d.ID} value={d.ID}>
              {d.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo: Selección de Universidad */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Universidad</label>
        <select
          className="w-full text-sm p-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
        >
          <option value="" disabled>Selecciona una universidad</option>
          {universities?.map((u) => (
            <option key={u.ID} value={u.ID}>
              {u.Nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="regular"
          checked={regular}
          onCheckedChange={(checked) => setRegular(!!checked)}
        />
        <label htmlFor="regular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
          Equipo Titular
        </label>
      </div>

      {/* Buscador e Integrantes */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Seleccionar Atletas ({selectedIds.length})
          </label>
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o cédula..."
              className="pl-8 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Atletas con Scroll */}
        <div className="border rounded-md bg-slate-50/30">
          <ScrollArea className="h-[280px] p-4">
            {loadingAthletes ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-2">
                <Loader2 className="animate-spin text-blue-600" />
                <p className="text-xs text-slate-500">Cargando lista de atletas...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAthletes?.map((athlete) => (
                  <div
                    key={athlete.ID}
                    className="flex items-center space-x-3 bg-white p-2 rounded-md border border-transparent hover:border-slate-200 transition-all shadow-sm"
                  >
                    <Checkbox
                      id={`athlete-${athlete.ID}`}
                      checked={selectedIds.includes(athlete.ID)}
                      onCheckedChange={() => toggleAtleta(athlete.ID)}
                    />
                    <label
                      htmlFor={`athlete-${athlete.ID}`}
                      className="flex flex-col flex-1 cursor-pointer"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {athlete.FirstNames} {athlete.LastNames}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Cédula: {athlete.GovID}
                      </span>
                    </label>
                  </div>
                ))}

                {filteredAthletes?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-slate-400">No se encontraron atletas con ese nombre.</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Footer del Formulario */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {teamId ? (
          <Link href="/equipos">
            <Button variant="outline" type="button">Cancelar / Volver</Button>
          </Link>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => { setSelectedIds([]); setTeamName(""); setRegular(false); setDisciplineId(""); setUniversityId(""); }}
            disabled={isSubmitting}
          >
            Limpiar
          </Button>
        )}

        <Button
          onClick={handleSave}
          disabled={!teamName || !disciplineId || !universityId || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {teamId ? "Guardar Cambios" : "Crear Equipo"}
        </Button>
      </div>
    </div>
  );
}
