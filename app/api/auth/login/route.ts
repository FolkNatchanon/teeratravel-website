import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { message: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // สร้าง cookie (เก็บเฉพาะข้อมูลที่ต้องใช้ฝั่ง server / middleware)
        const payload = JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            user_fname: user.user_fname,
            user_lname: user.user_lname,
            email: user.email,
            role: user.role, // 'A' | 'U'
        });

        // สำคัญ: ไม่ redirect ใน API
        // ให้ client เป็นคนตัดสินใจว่า role ไหนควรไปหน้าไหน
        const res = NextResponse.json(
            {
                ok: true,
                role: user.role,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    user_fname: user.user_fname,
                    user_lname: user.user_lname,
                    email: user.email,
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