import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน" },
                { status: 400 }
            );
        }

        // หา user จาก email หรือ username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { message: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // สร้าง cookie
        const payload = JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        });

        const cookieStore = await cookies();
        cookieStore.set("teera_user", payload, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.redirect(new URL("/", request.url));

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}