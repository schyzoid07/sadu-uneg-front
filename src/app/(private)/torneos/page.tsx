"use client";

import { useState } from "react";
import { TourneyList } from "@/components/tourney-list";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { TourneyForm } from "@/components/tourney-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDisciplines } from "@/hooks/disciplines/use-disciplines";
import { useDebounce } from "@/hooks/use-debounce";

export default function TorneosPage() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDiscipline, setSelectedDiscipline] = useState("");

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: disciplines } = useDisciplines();

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedDiscipline("");
    };

    const hasFilters = searchTerm || selectedDiscipline;

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Torneos</h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona los campeonatos y visualiza sus partidos.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Torneo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full sm:max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Torneo</DialogTitle>
                        </DialogHeader>
                        <TourneyForm
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters Section */}
            <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Buscar por nombre de torneo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white"
                    />
                    <Select value={selectedDiscipline} onValueChange={(val) => setSelectedDiscipline(val === "all" ? "" : val)}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Filtrar por disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las disciplinas</SelectItem>
                            {disciplines?.map(d => (
                                <SelectItem key={d.ID} value={d.ID.toString()}>{d.Name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {hasFilters && (
                    <Button variant="ghost" onClick={handleClearFilters} className="h-8 px-2 text-sm text-blue-600 hover:bg-blue-50">
                        <X className="mr-2 h-4 w-4" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            <TourneyList
                searchTerm={debouncedSearchTerm}
                selectedDiscipline={selectedDiscipline}

            />
        </div >

    );
}