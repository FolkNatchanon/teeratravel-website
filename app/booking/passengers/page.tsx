// app/booking/passengers/page.tsx
import PassengerForm from "./PassengerForm";

type SearchParams = {
    packageId?: string;
    tripDate?: string;
    timeSlot?: string;
    people?: string;
    boatId?: string;
};

export default async function PassengerPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const sp = await searchParams;

    const packageId = sp.packageId;
    const tripDate = sp.tripDate;
    const timeSlot = sp.timeSlot ?? "เช้า";
    const peopleFromPrev = Number(sp.people ?? "1") || 1;
    const boatId = sp.boatId;

    return (
        <PassengerForm
            packageId={packageId}
            tripDate={tripDate}
            timeSlot={timeSlot}
            peopleFromPrev={peopleFromPrev}
            boatId={boatId ? Number(boatId) : undefined}
        />
    );
}