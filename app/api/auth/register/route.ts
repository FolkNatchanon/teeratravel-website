import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, user_fname, user_lname, password, phone_number } = body;

        if (!username || !email || !password || !phone_number) {
            return NextResponse.json(
                { message: "กรอกข้อมูลให้ครบทุกช่อง" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "อีเมลนี้ถูกใช้งานแล้ว" },
                { status: 400 }
            );
        }

        // create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                user_fname,
                user_lname,
                password,
                phone_number,
                role: "user",
            },
        });

        // auto login
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
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}