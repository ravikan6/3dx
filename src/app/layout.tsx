"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Footer } from "@/component/user/Footer/footer";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react"; // Import ReactNode for type checking

// Fonts from Google
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const isAdminRoute = pathname.startsWith("/admin");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle Menu state (for mobile or dynamic menu)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      const fetchCartData = async () => {
        try {
          const response = await fetch(
            "https://backend3dx.onrender.com/cart/get-cart",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            }
          );

          if (!response.ok) throw new Error("Failed to fetch cart data");

          const data = await response.json();
          if (data.success) {
            const productsInCart = JSON.parse(data.cart.productsInCart);
            const uniqueProductIds = [
              ...new Set(productsInCart.map((item: any) => item.productId)),
            ];
            setCartItemCount(uniqueProductIds.length);
          } else {
            setCartItemCount(0);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
          setCartItemCount(0);
        }
      };

      fetchCartData();
    } else {
      setCartItemCount(0);
    }
  }, [pathname]); // Dependency on pathname to refresh cart when path changes

  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply custom fonts globally
        >
          {/* Conditionally render Navbar for non-admin routes */}
          {!isAdminRoute && (
            <Navbar
              cartItemCount={cartItemCount}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
            />
          )}

          {/* Conditionally render content based on route */}
          {isAdminRoute ? (
            <div>{children}</div>
          ) : (
            children
          )}

          {/* Conditionally render Footer for non-admin routes */}
          {!isAdminRoute && <Footer />}
        </body>
      </AuthProvider>
    </html>
  );
}
