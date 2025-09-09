"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const cookies = new Cookies();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router, cookies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { content } = response.data;

        cookies.set("token", content.token, { path: "/", maxAge: 3600 });
        router.push("/dashboard");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl rounded-2xl bg-white shadow-lg overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden w-1/2 bg-gray-100 md:flex items-center justify-center">
          <Image
            src={"/image/illustration/illustration-01.svg"}
            alt="Login Illustration"
            width={400}
            height={400}
          />
        </div>

        {/* Right Form */}
        <div className="flex w-full md:w-1/2 flex-col p-10">
          <h2 className="text-1xl font-medium text-black">Welcome to</h2>
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-6">
            BIGFORUM
          </h1>

          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm text-black font-medium">
                Email
              </label>
              <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 px-3">
                <span className="text-gray-500 mr-2">📧</span>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-none text-black bg-transparent outline-none py-2"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-black font-medium">
                Password
              </label>
              <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 px-3">
                <span className="text-gray-500 mr-2">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-none text-black bg-transparent outline-none py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  👁️
                </button>
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            {/* Remember + Forgot Password */}
            <div className="flex items-center justify-between text-sm text-black">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link href="#" className="text-indigo-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`rounded-md py-2 text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-indigo-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
