import React, { useState, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSuccess("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await onConfirm();
      setSuccess("User successfully deactivated!");
      setTimeout(() => {
        onCancel();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to deactivate user!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-sm p-6">
        <p className="text-black font-semibold text-sm mb-4">{message}</p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-[#F87171] text-white"
          >
            {loading ? "Processing..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
