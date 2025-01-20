'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  useEffect(() => {
    // Add a class to the body to hide the footer
    document.body.classList.add("hide-footer");

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove("hide-footer");
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-900">
      {/* Background image with furniture silhouettes */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/hero/Group 1.png"
          alt="Furniture Silhouettes"
          className="w-full h-full object-cover opacity-20"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            className="w-full max-w-3xl mx-auto mb-6" // Adjusted max width
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Image
              src="/hero/Design.svg"
              alt="Design Furniture"
              width={600} // Adjusted width
              height={300} // Adjusted height proportionally
              className="w-full h-auto"
              priority
            />
          </motion.div>

          <motion.div
            className="w-full max-w-md mx-auto mb-16" // Increased bottom margin
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Image
              src="/hero/Crafting.svg" // Replace with your actual PNG for the subtitle
              alt="Creating perfect lines and imposing presence"
              width={300} // Adjusted width
              height={40} // Adjusted height
              className="w-full h-auto"
            />
          </motion.div>

          <Link href="/shop" passHref>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-white/20 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-colors duration-300"
            >
              Shop Now
            </motion.a>
          </Link>
        </motion.div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
}
