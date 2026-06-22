export default function Alert({
  type,
  message,
  onClose,
}) {
  if (!message) return null;

  return (
    <div
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
        className="ml-4 text-lg font-bold"
      >
        &times;
      </button>
    </div>
  );
}
