"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, LogOut, Menu } from "lucide-react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();

  const token = cookies.get("token");
  let userId: string | null = null;

  if (token && typeof token === "string") {
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Fetch user data
  useEffect(() => {
    if (!token || !userId) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data.content);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [token, userId]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.clear();
      cookies.remove("token");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Burger button for mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-500 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#f3e9e0] p-6 flex flex-col justify-between z-40
          transform transition-transform duration-300 ease-in-out min-h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative
        `}
      >
        <div>
          {/* Logo / Title */}
          <h1 className="font-bold text-lg text-black mb-6">CRUD OPERATIONS</h1>

          {/* User Info */}
          <div className="flex flex-col items-center text-center mb-6">
            <Image
              src="/image/user/user-01.png"
              alt="User"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h2 className="mt-3 text-black font-semibold">
              {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
            </h2>
            <p className="text-sm text-purple-600">{user?.email}</p>
          </div>

          {/* Menu */}
          <nav>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-500 text-white"
            >
              <Home size={18} /> Home
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:text-purple-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}
