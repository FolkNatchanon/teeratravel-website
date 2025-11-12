"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((v) => !v);

    return (
        <nav className="bg-blue-100/200 text-gray-700/800 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Teera<span className="text-yellow-500">Travel</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                    <Link href="/" className="hover:text-blue-600 transition">หน้าแรก</Link>
                    <Link href="/tours" className="hover:text-blue-600 transition">แพ็กเกจทัวร์</Link>
                    <Link href="/booking" className="hover:text-blue-600 transition">จองทัวร์</Link>
                    <Link href="/history" className="hover:text-blue-600 transition">ประวัติการจอง</Link>
                    <Link href="/about" className="hover:text-blue-600 transition">ติดต่อ</Link>
                </div>

                {/* Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-700 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
                    <div className="flex flex-col px-6 py-3 space-y-3 font-medium text-gray-700">
                        <Link href="/" onClick={toggleMenu} className="hover:text-blue-600 transition">หน้าแรก</Link>
                        <Link href="/tours" onClick={toggleMenu} className="hover:text-blue-600 transition">แพ็กเกจทัวร์</Link>
                        <Link href="/booking" onClick={toggleMenu} className="hover:text-blue-600 transition">จองทัวร์</Link>
                        <Link href="/history" onClick={toggleMenu} className="hover:text-blue-600 transition">ประวัติการจอง</Link>
                        <Link href="/about" onClick={toggleMenu} className="hover:text-blue-600 transition">ติดต่อ</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}