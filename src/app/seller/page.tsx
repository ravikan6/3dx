"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OtpResponse {
  message: string;
}

interface LoginResponse {
  message: string;
  sellerId: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string>("");
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifySeller = async () => {
      try {
        const sellerId = localStorage.getItem('sellerId');
        
        if (!sellerId) {
          router.push('/seller');
          return;
        }

        const response = await fetch('https://backend3dx.onrender.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        });

        const data = await response.json();

        if (response.ok || data.loggedIn !== 'loggedin') {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Error verifying seller:', error);
        router.push('/seller');
      }
    };

    verifySeller();
  }, [router]);

  const handleSendOtp = async (): Promise<void> => {
    if (!emailOrPhone) {
      setError("Please enter your email or phone.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/admin/seller/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailId: emailOrPhone,
          }),
        }
      );

      const data: OtpResponse = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string): Promise<void> => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/admin/seller/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailId: emailOrPhone,
            otp,
          }),
        }
      );

      const data: OtpResponse = await response.json();

      if (response.ok && data.message === "OTP verified successfully") {
        setOtpVerified(true);
        setError("");
      } else if (data.message === "OTP has expired") {
        setShowResendButton(true);
        setError(data.message);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/admin/seller/resend-otp",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailOrPhone,
          }),
        }
      );

      const data: OtpResponse = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setShowResendButton(false);
        setError("");
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!sellerId || !emailOrPhone || !password || !otpVerified) {
      setError("Please fill all fields and verify OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://backend3dx.onrender.com/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId,
          emailOrPhone,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.message === "Login successful") {
        localStorage.setItem('sellerId', data.sellerId);
        router.push(`/admin`);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Store className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-black">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sellerId" className="text-sm font-medium text-gray-700">
                Seller ID
              </Label>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-700" />
                <Input
                  id="sellerId"
                  type="text"
                  placeholder="Enter your seller ID"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-700" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {!otpSent ? (
              <Button
                type="button"
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP
                </Label>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-700" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtp(value);
                        if (value.length === 6) {
                          handleVerifyOtp(value);
                        }
                      }
                    }}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            )}

            {showResendButton && (
              <Button
                type="button"
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={handleResendOtp}
                disabled={loading}
              >
                {loading ? "Resending OTP..." : "Resend OTP"}
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="flex items-center space-x-2 relative">
                <Lock className="h-4 w-4 text-gray-700" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={loading || !otpVerified}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
