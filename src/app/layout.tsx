"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Footer } from "@/component/user/Footer/footer";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";
import CouponPage from "@/component/admin/CouponPage/CouponPage";
import Customer from '@/component/admin/customer/customer';


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const isAdminRoute = pathname.startsWith("/admin");
  const isCouponPage = pathname.startsWith("/admin/coupon");  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              ...new Set(productsInCart.map((item) => item.productId)),
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
  }, [pathname]); // Fixed dependency array to be stable with 'pathname'

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
          {isCouponPage ? (
            <CouponPage />
          ) : isAdminRoute ? (
            <div>{children}</div> // This div seems unnecessary unless you're adding styling here
          ) : (
            children
          )}
          {!isAdminRoute && <Footer />}
        </body>
      </AuthProvider>
    </html>
  );
}
