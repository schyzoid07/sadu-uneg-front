import { TourneyForm } from "@/components/tourney-form";

interface PageProps {
    params: Promise<{
        tourneyId: string;
    }>;
}

export default async function EditarTorneoPage({ params }: PageProps) {
    const { tourneyId } = await params;

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Editar Torneo</h1>
            <TourneyForm tourneyId={tourneyId} />
        </div>
    );
}