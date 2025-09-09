import React, { useState, useEffect } from "react";

interface EditUserModalProps {
  isOpen: boolean;
  userData: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  onClose: () => void;
  onSubmit: (data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    current_password: string;
    new_password: string;
  }) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  userData,
  onClose,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [current_password, setCPassword] = useState("");
  const [new_password, setNPassword] = useState("");
  const [showCPassword, setShowCPassword] = useState(false);
  const [showNPassword, setShowNPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userData) {
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setCPassword("");
      setNPassword("");
      setError("");
      setSuccess("");
      setLoading(false);
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  const handleClose = () => {
    setError("");
    setSuccess("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setCPassword("");
    setNPassword("");
    setShowCPassword(false);
    setShowNPassword(false);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onSubmit({
        id: userData.id,
        first_name: firstName,
        last_name: lastName,
        email,
        current_password,
        new_password
      });

      setSuccess("User updated successfully!");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-10 relative">
        <h2 className="text-lg text-black font-semibold mb-4">Edit Account</h2>
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
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                placeholder="Current Password"
                value={current_password}
                onChange={(e) => setCPassword(e.target.value)}
                className="border px-3 py-2 rounded-md w-full text-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                👁️
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNPassword ? "text" : "password"}
                placeholder="New Password"
                value={new_password}
                onChange={(e) => setNPassword(e.target.value)}
                className="border px-3 py-2 rounded-md w-full text-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNPassword(!showNPassword)}
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
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
