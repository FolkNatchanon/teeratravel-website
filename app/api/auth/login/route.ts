import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const identifier = body?.identifier?.toString()?.trim();
        const password = body?.password?.toString();

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                password: true,
                user_fname: true,
                user_lname: true,
            },
        });

        // NOTE: ตอนนี้ยังเทียบ plain-text ตามโค้ดเดิม
        // ถ้าใน DB เป็น hash ต้องเปลี่ยนมาใช้ bcrypt.compare
        if (!user || user.password !== password) {
            return NextResponse.json(
                { message: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        const payload = JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            role: user.role, // "A" | "U"
        });

        const res = NextResponse.json(
            {
                ok: true,
                role: user.role,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    user_fname: user.user_fname,
                    user_lname: user.user_lname,
                },
            },
            { status: 200 }
        );

        res.cookies.set("teera_user", payload, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}