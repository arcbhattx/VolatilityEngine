import { useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center justify-between gap-4 px-4 py-3 text-white rounded-lg shadow-lg ${typeStyles[type]}`}
      >
        <span>{message}</span>

        <button
          onClick={onClose}
          className="text-white text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}