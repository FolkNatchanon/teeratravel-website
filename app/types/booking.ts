import type { Passenger } from "./passenger";

export type Booking = {
    booking_id: number;
    status: string;
    booking_date: Date;
    passengers: Passenger[];
};