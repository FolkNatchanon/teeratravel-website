import { requireAdmin } from "@/app/lib/auth/currentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    try {
        await requireAdmin();
    } catch {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
                    <aside className="h-fit">
                        <AdminSidebar />
                    </aside>

                    {/* ✅ full width + scroll ใน card */}
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-[calc(100vh-64px)] overflow-auto">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}