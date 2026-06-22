export default function ItemPhotoFooter({
  imageUrl,
  loading,
  onEdit,
  onClear,
}) {
  return (
    <div className="border-t bg-slate-100 p-3 flex justify-end gap-2">
      <button
        onClick={onEdit}
        disabled={loading}
        className="
          px-6 py-2
          bg-emerald-500
          text-white
          rounded
          hover:bg-emerald-600
          disabled:opacity-50
        "
      >
        Edit
      </button>

      <button
        onClick={onClear}
        disabled={!imageUrl || loading}
        className="
          px-6 py-2
          bg-slate-500
          text-white
          rounded
          hover:bg-slate-600
          disabled:opacity-50
        "
      >
        Clear
      </button>
    </div>
  );
}
