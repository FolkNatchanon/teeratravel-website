"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-blue-100 text-gray-800 border-t border-blue-200">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold mb-3">
                        Teera<span className="text-yellow-500">Travel</span>
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Explore the beauty of Ko Talu and beyond — your snorkeling
                        adventure starts here.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-800">ติดต่อเรา</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                            <Phone size={18} className="text-blue-600" /> 094-715-9333
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-600" /> sales.teeratravel@gmail.com
                        </li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-800">ติดตามเรา</h3>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://www.facebook.com/TeeraTravel/?locale=th_TH"
                            className="hover:text-blue-600 transition"
                        >
                            <Facebook size={22} />
                        </Link>
                        <Link
                            href="https://www.instagram.com/teeratravel/"
                            className="hover:text-pink-600 transition"
                        >
                            <Instagram size={22} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-blue-200 py-4 text-center text-sm text-gray-700">
                © {new Date().getFullYear()} TeeraTravel. All rights reserved.
            </div>
        </footer>
    );
}