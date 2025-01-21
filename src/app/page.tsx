'use client';

import FeaturedProducts from '@/component/user/FeaturedProducts/featuredproduct';
import Hero from '@/component/user/Hero/hero';

export default function Home() {
  return (
    <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <Hero />

      {/* Featured Products section */}
      <FeaturedProducts />
    </main>
  );
}
