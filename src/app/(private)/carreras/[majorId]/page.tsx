import CrearCarreraForm from "@/components/carrera-form";
export default async function MajorDetails({ params }: { params: Promise<{ majorId: string }> }) {
    const majorId = (await params).majorId;

    return (
        <>
            <div className="no-scrollbar -mx-4 overflow-y-auto px-4">
                <CrearCarreraForm majorId={majorId} />
            </div>


        </>)
}