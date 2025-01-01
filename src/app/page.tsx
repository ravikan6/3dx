'use client';

import FeaturedProducts from '@/component/user/FeaturedProducts/featuredproduct';
import Hero from '@/component/user/Hero/hero';

export default function Home() {
  return (
    <main >
      <Hero />
      <FeaturedProducts />
    </main>
  );
}
