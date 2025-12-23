import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);

        const username = body?.username?.toString()?.trim();
        const user_fname = body?.user_fname?.toString()?.trim();
        const user_lname = body?.user_lname?.toString()?.trim();
        const email = body?.email?.toString()?.trim()?.toLowerCase();
        const phone_number = body?.phone_number?.toString()?.trim();
        const password = body?.password?.toString();

        if (!username || !user_fname || !user_lname || !email || !phone_number || !password) {
            return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
        }

        if (!isEmail(email)) {
            return NextResponse.json({ message: "อีเมลไม่ถูกต้อง" }, { status: 400 });
        }

        if (phone_number.length !== 10) {
            return NextResponse.json({ message: "เบอร์โทรต้องมี 10 หลัก" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว" }, { status: 400 });
        }

        const exists = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
            select: { user_id: true },
        });

        if (exists) {
            return NextResponse.json(
                { message: "มีผู้ใช้นี้อยู่แล้ว (username หรือ email ซ้ำ)" },
                { status: 409 }
            );
        }

        const user = await prisma.user.create({
            data: {
                username,
                user_fname,
                user_lname,
                email,
                phone_number,
                password, // ✅ ตอนนี้เก็บ plain-text ให้ตรงกับ login เดิม
                role: "U", // ✅ user ปกติ
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
            },
        });

        // ✅ optional: set cookie ให้ login เลยหลัง register
        const payload = JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        });

        const res = NextResponse.json({ ok: true, user }, { status: 201 });

        res.cookies.set("teera_user", payload, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}
