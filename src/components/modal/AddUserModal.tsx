"use client";

import React, { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setError("");
    setSuccess("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onSubmit({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      
      setSuccess("User created successfully!");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-10 relative">
        <h2 className="text-lg text-black font-semibold mb-4">
          Create an Account
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border px-3 py-2 rounded-md w-full text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border px-3 py-2 rounded-md w-full text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded-md w-full text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 py-2 rounded-md w-full text-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                👁️
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
