"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ไอคอน hamburger จาก lucide-react (ติดตั้งด้วย npm install lucide-react)

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Teera<span className="text-gray-800">Travel</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 font-medium text-gray-700">
                    <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link href="/tours" className="hover:text-blue-600 transition">Tours</Link>
                    <Link href="/booking" className="hover:text-blue-600 transition">Booking</Link>
                    <Link href="/about" className="hover:text-blue-600 transition">About</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
                    <div className="flex flex-col px-6 py-3 space-y-3 font-medium text-gray-700">
                        <Link href="/" onClick={toggleMenu} className="hover:text-blue-600 transition">Home</Link>
                        <Link href="/tours" onClick={toggleMenu} className="hover:text-blue-600 transition">Tours</Link>
                        <Link href="/booking" onClick={toggleMenu} className="hover:text-blue-600 transition">Booking</Link>
                        <Link href="/about" onClick={toggleMenu} className="hover:text-blue-600 transition">About</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}