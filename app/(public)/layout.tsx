// app/(public)/layout.tsx
import UserNavbar from "@/components/nav/UserNavbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic"; // ✅ ทำให้ Navbar ไม่ค้าง

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UserNavbar />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}