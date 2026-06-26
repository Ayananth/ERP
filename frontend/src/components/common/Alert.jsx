import { useEffect, useRef } from "react";

export default function Alert({
  type,
  message,
  onClose,
}) {
  const alertRef = useRef(null);

  useEffect(() => {
    if (!message) return;

    alertRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={alertRef}
      className={`mb-4 flex items-center justify-between rounded border px-4 py-3 ${
        type === "success"
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-red-300 bg-red-50 text-red-700"
      }`}
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="ml-4 rounded text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500"
      >
        &times;
      </button>
    </div>
  );
}
