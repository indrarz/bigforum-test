"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Sidebar from "./sidebar";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/modal/LogoutModal";
import AddUserModal from "@/components/modal/AddUserModal";
import EditUserModal from "@/components/modal/EditUserModal";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export default function Dashboard() {
  const cookies = new Cookies();
  const router = useRouter();

  // State modals & data
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Token & userId
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

  // Logout jika token tidak ada
  useEffect(() => {
    if (!token) {
      setIsLogoutModalOpen(true);
    }
  }, [token]);

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const usersWithStatus = response.data.content.map((user: any) => ({
        ...user,
        status: user.status ? "Aktif" : "Nonaktif",
      }));

      const sortedUsers = usersWithStatus.sort((a: any, b: any) => a.id - b.id);

      setUsers(sortedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      if (err.response?.status === 401) {
        setIsLogoutModalOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Add user
  const handleAddUser = async (newUser: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/create`,
        newUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newUser = {
          ...response.data.content,
          status: response.data.content.status ? "Aktif" : "Nonaktif",
        };
        setUsers((prev) => [...prev, newUser]);
        return;
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    }
  };

  // Edit user
  const handleEditUser = async (updatedUser: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/edit/${updatedUser.id}`,
        {
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          currentPassword: updatedUser.current_password,
          newPassword: updatedUser.new_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updated = {
          ...response.data.content,
          status: response.data.content.status ? "Aktif" : "Nonaktif",
        };
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updated : u))
        );
        return;
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    }
  };

  // Delete user
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/delete/${userToDelete.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userToDelete.id ? { ...u, status: "Nonaktif" } : u
          )
        );
        return;
      } else {
        throw new Error(response.data.message || "Failed to deactivate user");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Failed to deactivate user. Please try again."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    cookies.remove("token");
    router.push("/");
  };

  // Filter & search
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "aktif" && user.status === "Aktif") ||
      (statusFilter === "nonaktif" && user.status === "Nonaktif");

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination slice
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl text-black font-bold">User List</h2>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add User
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm text-gray-600"
          >
            <option value="all" disabled>Filter</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md text-sm text-gray-600"
          />
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default">
          <div className="overflow-auto max-h-[365px]">
            {" "}
            <table className="w-full table-auto min-w-[600px]">
              <thead className="bg-gray-50 text-left text-sm text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-4 font-medium text-black">Name</th>
                  <th className="py-4 px-4 font-medium text-black">Email</th>
                  <th className="py-4 px-4 font-medium text-black">Status</th>
                  <th className="py-4 px-4 font-medium text-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {user.status}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 flex gap-3">
                      {user.status === "Aktif" && (
                        <>
                          <button
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={() => {
                              setEditUserData(user);
                              setIsEditUserModalOpen(true);
                            }}
                          >
                            <Pencil size={18} />
                          </button>
                          {user.id !== Number(userId) && (
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-1 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded-md text-sm ${
                page === currentPage
                  ? "bg-indigo-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </main>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        message="Your session has expired. Please log in again."
        onButtonClick={handleLogout}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />
      {editUserData && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          userData={editUserData}
          onClose={() => setIsEditUserModalOpen(false)}
          onSubmit={handleEditUser}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={`Are you sure you want to delete ${userToDelete?.first_name} ${userToDelete?.last_name}?`}
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
