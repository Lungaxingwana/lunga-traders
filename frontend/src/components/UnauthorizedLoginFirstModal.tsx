import { FaTimes, FaUser } from "react-icons/fa";
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function UnauthorizedLoginFirstModal({ isOpen, onClose, onConfirm, title, message, isLoading=false }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000008f] z-50">
      <motion.div className="bg-white p-6 rounded-lg shadow-lg w-96"
      initial={{ opacity: 0, y:50 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0, y:50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}>
        <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <FaUser className="text-stone-500" /> {title}
        </h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-1/2 flex items-center shadow-black shadow-xl justify-center gap-2 hover:opacity-70 active:opacity-40 cursor-pointer"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading} // Disable button while processing
            className={`px-4 py-2 bg-gradient-to-r from-stone-800  to-stone-500 text-white shadow-black shadow-xl rounded w-1/2 flex items-center justify-center gap-2 hover:opacity-70 active:opacity-40 cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-x-2 align-middle">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-x-2 align-middle">
                <FaUser />
                <p>Login</p>
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
