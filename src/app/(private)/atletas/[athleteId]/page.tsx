import CrearAtletaForm from "@/components/atleta-form";
export default async function AthleteDetails({ params }: { params: Promise<{ athleteId: string }> }) {
    const athleteId = (await params).athleteId;

    return (
        <>
            <div className="no-scrollbar -mx-4 overflow-y-auto px-4">
                <CrearAtletaForm athleteId={athleteId} />
            </div>


        </>)
}