import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  message: string;
  onButtonClick: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, message, onButtonClick }) => {
  if (!isOpen) return null;

  const handleClick = () => {
    onButtonClick();
  };

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/50">
      <div className="modal relative z-60 rounded-sm bg-white shadow-default border-l-6 border-[#F87171]">
        <div className="border-b border-stroke py-4 px-7">
          <h2 className="mb-3 text-lg font-semibold text-[#F87171]">{message}</h2>
          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2.5 rounded-md py-3 px-7 text-center font-medium text-white bg-indigo-700 hover:bg-indigo-500"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
