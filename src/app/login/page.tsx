"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/"); // Redirect to dashboard after successful login
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-12 pt-8 pb-8 mb-4 transform transition-all hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <Label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </Button>
            <Link
              href="/signup"
              className="inline-block align-baseline font-bold text-sm text-gray-800 hover:text-gray-700"
            >
              Need an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
