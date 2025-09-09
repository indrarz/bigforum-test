"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/create`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }
      );

      if (res.status === 201 || res.data.success) {
        setMessage("✅ Account created successfully! Please login.");
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Something went wrong.");
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
            src={"/image/illustration/illustration-02.svg"}
            alt="Sign Up Illustration"
            width={400}
            height={400}
          />
        </div>

        {/* Right Form */}
        <div className="flex w-full md:w-1/2 flex-col p-10">
          <h1 className="text-3xl font-bold text-black mb-6">
            Create an Account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            {/* First Name */}
            <div>
              <label className="block text-sm text-black font-medium">
                First Name
              </label>
              <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 px-3">
                <span className="text-gray-500 mr-2">👤</span>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-none text-black bg-transparent outline-none py-2"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-black font-medium">
                Last Name
              </label>
              <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 px-3">
                <span className="text-gray-500 mr-2">👤</span>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-none text-black bg-transparent outline-none py-2"
                />
              </div>
            </div>

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

            {/* Agreement Checkbox */}
            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 mr-2"
              />
              <label htmlFor="agree" className="text-gray-600">
                By creating an account, I agree to our{" "}
                <Link href="#" className="text-indigo-600 hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!agree || loading}
              className={`rounded-md py-2 text-white font-semibold ${
                agree
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-3 text-center text-sm ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="text-indigo-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
