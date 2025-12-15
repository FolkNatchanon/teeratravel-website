// app/lib/bookingPrice.ts
import type { Package, Boat } from "@prisma/client";

// ใช้ใน API /bookings (ไม่สนใจเรือ แค่คิดราคาตามแพ็กเกจ + จำนวนคน)
// - basePrice = ราคาเหมารวม (สำหรับ PRIVATE) หรือราคาต่อคน (สำหรับ JOIN)
// - base_member_count = จำนวนคนที่รวมอยู่ในราคาเหมารวม (สำหรับ PRIVATE)
//   ถ้า people <= base_member_count → ราคา = basePrice (ไม่เกินราคาเหมารวม)
//   ถ้า people > base_member_count → basePrice + (คนเกิน * extra_price_per_person)
type SimplePackagePricing = {
    price: any;
    base_member_count: number | null;
    extra_price_per_person: any | null;
};

export function calculateTotalPrice(pkg: SimplePackagePricing, people: number) {
    const basePrice = Number(pkg.price);
    const baseCount = pkg.base_member_count ?? 10;
    const extraPricePerPerson = Number(pkg.extra_price_per_person ?? 0);

    if (people <= baseCount) {
        // ❗ ยังไม่เกินจำนวนคนที่ราคาเหมารวมไว้ → ห้ามเกิน basePrice
        return basePrice;
    }

    const extraPeople = people - baseCount;
    const extraPrice = extraPeople * extraPricePerPerson;

    return basePrice + extraPrice;
}

// เผื่อใช้ที่อื่นในอนาคต: คิดราคาทริป PRIVATE + ส่วนเพิ่มของเรือ
export function calculatePrivateTripPrice(
    pkg: Package,
    boat: Boat,
    people: number
) {
    const basePrice = Number(pkg.price);
    const boatExtra = Number(boat.extra_private_price ?? 0);
    const baseCount = pkg.base_member_count ?? 10;
    const extraPricePerPerson = Number(pkg.extra_price_per_person ?? 0);

    let peoplePrice: number;

    if (people <= baseCount) {
        peoplePrice = basePrice;
    } else {
        const extraPeople = people - baseCount;
        peoplePrice = basePrice + extraPeople * extraPricePerPerson;
    }

    return peoplePrice + boatExtra;
}