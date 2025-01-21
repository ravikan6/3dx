'use client';

import React, { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Clear error message on valid email
    setError(null);

    // Handle subscription logic here (e.g., API call)
    console.log(`Subscribed with email: ${email}`);
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="w-full rounded-full bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Email address"
          required
        />
        {error && (
          <span className="absolute text-red-500 text-sm mt-1">{error}</span>
        )}
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-white px-4 py-2 font-semibold text-black transition-colors hover:bg-gray-100"
      >
        Subscribe
      </button>
    </form>
  );
}
