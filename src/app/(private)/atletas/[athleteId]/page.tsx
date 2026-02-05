import { Button } from "@/components/ui/button";
import { HammerIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CrearAtletaForm from "@/components/atleta-form";
export default async function AthleteDetails({ params }: { params: Promise<{ athleteId: string }> }) {
    const athleteId = (await params).athleteId;
    {/*
    // Edición (se mantiene si lo usas)
    const [editingAthlete, setEditingAthlete] = useState<Athletes | null>(null);
    const [openEdit, setOpenEdit] = useState(false); */}

    return (
        <>
            <div className="no-scrollbar -mx-4 overflow-y-auto px-4">
                <CrearAtletaForm athleteId={athleteId} />
            </div>
            {/*
            <AthleteInfo id={athleteId} />
            <h1>Detalles del atleta {athleteId}</h1>
            <Button
                size="icon"
                variant="ghost"
                className="bg-blue-100 hover:bg-blue-200"
                onClick={() => {
                    // ejemplo: abrir edición si lo deseas
                    setEditingAthlete(athleteId);
                    setOpenEdit(true);
                }}
            >
                <HammerIcon size={16} />
            </Button>


            < Dialog open={openEdit} onOpenChange={(val) => {
                setOpenEdit(val);
                if (!val) setEditingAthlete(null);
            }
            }>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar atleta</DialogTitle>
                    </DialogHeader>

                    {editingAthlete ? (
                        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4"> 
                        <CrearAtletaForm
                            athlete={editingAthlete}
                            onSuccess={() => {
                                setOpenEdit(false);
                                setEditingAthlete(null);
                            }}
                        /> </div>
                    ) : (
                        <p>No se encontró el atleta seleccionado.</p>
                    )}
                </DialogContent>
            </Dialog >
            */}

        </>)
}