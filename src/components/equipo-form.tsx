"use client";

import { useState } from "react";
import { useAthletes } from "@/hooks/athletes/use-athletes";
import { useCreateTeam } from "@/hooks/teams/use-teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, Loader2 } from "lucide-react";

// Definimos la interfaz para recibir la función de cierre del padre
interface CrearEquipoFormProps {
  onSuccess?: () => void;
}

export default function CrearEquipoForm({ onSuccess }: CrearEquipoFormProps) {
  // 1. Hooks de datos
  const { data: athletes, isLoading: loadingAthletes } = useAthletes();
  const createTeamMutation = useCreateTeam();

  // 2. Estados locales
  const [teamName, setTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  // 4. Función de envío
  const handleSave = () => {
    createTeamMutation.mutate(
      {
        Nombre: teamName,
        DisciplinaID: 1,   // Temporal: podrías añadir un Select para esto
        UniversidadID: 1,  // Temporal: podrías añadir un Select para esto
        AtletasIDs: selectedIds,
      },
      {
        onSuccess: () => {
          // Si la mutación es exitosa, avisamos al padre para cerrar el modal
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <div className="space-y-6 py-2">
      {/* Campo: Nombre del Equipo */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Nombre del Equipo</label>
        <Input
          placeholder="Ej: Selección de Voleibol Masculino"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
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
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedIds([])}
          disabled={createTeamMutation.isPending}
        >
          Limpiar
        </Button>
        <Button
          onClick={handleSave}
          disabled={!teamName || selectedIds.length === 0 || createTeamMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {createTeamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Equipo
        </Button>
      </div>
    </div>
  );
}