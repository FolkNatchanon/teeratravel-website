import Link from "next/link";
import { getAuthCookie } from "@/app/lib/auth/cookie";
import UserMenuClient from "./UserMenu.client";

export default async function Navbar() {
    const user = await getAuthCookie(); // อ่าน cookie บน server ได้ชัวร์

    return (
        <div className="w-full bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-extrabold text-xl">
                    <span className="text-sky-500">Teera</span>
                    <span className="text-amber-400">Travel</span>
                </Link>

                <div className="flex items-center gap-5">
                    <Link className="text-slate-700 hover:text-slate-900" href="/">หน้าแรก</Link>
                    <Link className="text-slate-700 hover:text-slate-900" href="/package">แพ็กเกจ</Link>
                    <Link className="text-slate-700 hover:text-slate-900" href="/history">ประวัติการจอง</Link>
                    <Link className="text-slate-700 hover:text-slate-900" href="/contact">ติดต่อ</Link>

                    {/* โยน user ให้ client component แสดงปุ่ม login/logout */}
                    <UserMenuClient user={user} />
                </div>
            </div>
        </div>
    );
}