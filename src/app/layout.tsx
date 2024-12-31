"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Footer } from "@/component/user/Footer/footer";
import { useState } from "react";
import { Navbar } from '@/components/navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // State for managing mobile menu in Navbar
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const cartItemCount = 3; // You can update this value dynamically if needed

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isAdminRoute && (
          <Navbar
            cartItemCount={cartItemCount}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
          />
        )}
        {children}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
