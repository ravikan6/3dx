"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Footer } from "@/component/user/Footer/footer";
import { useState, useEffect } from "react";
import { Navbar } from '@/components/navbar';
import { AuthProvider } from "@/context/AuthContext";

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
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (userId) {
      // If userId exists, fetch the cart items
      const fetchCartData = async () => {
        try {
          const response = await fetch("https://backend3dx.onrender.com/cart/get-cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();

          if (data.success) {
            // Parse the products in cart, remove duplicates based on productId
            const productsInCart = JSON.parse(data.cart.productsInCart);
            const uniqueProductIds = [
              ...new Set(productsInCart.map((item: any) => item.productId)),
            ];
            setCartItemCount(uniqueProductIds.length); // Set the cart item count
          } else {
            setCartItemCount(0); // If no cart found
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
          setCartItemCount(0); // In case of error, set count to 0
        }
      };

      fetchCartData();
    } else {
      // If no userId, set cartItemCount to 0
      setCartItemCount(0);
    }
  }, []);

  return (
    <html lang="en">
    <AuthProvider>
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
    </AuthProvider>
    </html>
  );
}
