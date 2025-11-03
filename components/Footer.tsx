"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react"; // npm i lucide-react ก่อน

export default function Footer() {
    return (
        <footer className="bg-blue-600 text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Brand */}
                <div>
                    <h2 className="text-2xl font-bold mb-3">
                        Teera<span className="text-yellow-300">Travel</span>
                    </h2>
                    <p className="text-sm text-blue-100 leading-relaxed">
                        Explore the beauty of Ko Talu and beyond — your snorkeling adventure
                        starts here!
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-blue-100">
                        <li>
                            <Link href="/" className="hover:text-yellow-300 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/tours" className="hover:text-yellow-300 transition">
                                Tours
                            </Link>
                        </li>
                        <li>
                            <Link href="/booking" className="hover:text-yellow-300 transition">
                                Booking
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-yellow-300 transition">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                    <ul className="space-y-2 text-blue-100">
                        <li className="flex items-center space-x-2">
                            <Phone size={18} />
                            <span>+66 88 123 4567</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <Mail size={18} />
                            <span>contact@teeratravel.com</span>
                        </li>
                    </ul>

                    <div className="flex space-x-4 mt-4">
                        <Link href="#" className="hover:text-yellow-300 transition">
                            <Facebook size={22} />
                        </Link>
                        <Link href="#" className="hover:text-yellow-300 transition">
                            <Instagram size={22} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-blue-700 py-4 text-center text-sm text-blue-100">
                © {new Date().getFullYear()} Teera Travel. All rights reserved.
            </div>
        </footer>
    );
}