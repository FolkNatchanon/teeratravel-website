// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            username,
            email,
            user_fname,
            user_lname,
            password,
            phone_number,
        } = body;

        // 1) เช็คกรอกครบไหม
        if (
            !username ||
            !email ||
            !user_fname ||
            !user_lname ||
            !password ||
            !phone_number
        ) {
            return NextResponse.json(
                { message: "กรอกข้อมูลให้ครบทุกช่อง" },
                { status: 400 }
            );
        }

        // เช็คความยาว (กันหลุดจากข้อจำกัด column)
        if (username.length > 30) {
            return NextResponse.json(
                { message: "ชื่อผู้ใช้ต้องไม่เกิน 30 ตัวอักษร" },
                { status: 400 }
            );
        }
        if (email.length > 30) {
            return NextResponse.json(
                { message: "อีเมลต้องไม่เกิน 30 ตัวอักษร" },
                { status: 400 }
            );
        }
        if (password.length > 20) {
            return NextResponse.json(
                { message: "รหัสผ่านต้องไม่เกิน 20 ตัวอักษร" },
                { status: 400 }
            );
        }
        if (phone_number.length !== 10) {
            return NextResponse.json(
                { message: "กรุณากรอกเบอร์โทร 10 หลัก" },
                { status: 400 }
            );
        }

        // 2) เช็คว่ามี username หรือ email ซ้ำไหม
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existing) {
            return NextResponse.json(
                { message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว" },
                { status: 409 }
            );
        }

        // 3) สร้าง user ใหม่ (role = U เสมอ)
        const newUser = await prisma.user.create({
            data: {
                username,
                user_fname,
                user_lname,
                email,
                role: "U",
                password, // ถ้าจะ hash ทีหลังค่อยมาปรับตรงนี้
                phone_number,
            },
        });

        // 4) set cookie login ทันที (เหมือนตอน login)
        const payload = JSON.stringify({
            user_id: newUser.user_id,
            username: newUser.username,
            role: newUser.role,
        });

        const cookieStore = await cookies();
        cookieStore.set("teera_user", payload, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 วัน
        });

        // สมัครเสร็จ → เด้งกลับหน้าแรก
        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}