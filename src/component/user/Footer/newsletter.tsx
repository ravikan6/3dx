'use client';

import React from 'react';

export function NewsletterForm() {
  return (
    <form className="mt-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded-full bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-white px-4 py-2 font-semibold text-black transition-colors hover:bg-gray-100"
      >
        Subscribe
      </button>
    </form>
  );
}