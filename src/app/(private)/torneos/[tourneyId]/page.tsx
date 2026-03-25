import { TourneyForm } from "@/components/tourney-form";

interface PageProps {
    params: {
        tourneyId: string;
    };
}

export default function EditarTorneoPage({ params }: PageProps) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Editar Torneo</h1>
            <TourneyForm tourneyId={params.tourneyId} />
        </div>
    );
}