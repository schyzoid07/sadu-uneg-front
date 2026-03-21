import { EventoForm } from "@/components/evento-form";
export default async function EventDetails({ params }: { params: Promise<{ eventId: string }> }) {
    const eventId = (await params).eventId;

    return (
        <div className="no-scrollbar -mx-4 overflow-y-auto px-10">
            <EventoForm eventId={eventId} />
        </div>)
}