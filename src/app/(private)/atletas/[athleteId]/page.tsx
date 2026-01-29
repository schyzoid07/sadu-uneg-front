export default async function AthleteDetails({ params }: { params: Promise<{ athleteId: string }> }) {
    const athleteId = (await params).athleteId;

    return (
        <>
            <h1>Detalles del atleta {athleteId}</h1>
        </>
    )
}