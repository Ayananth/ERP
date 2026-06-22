export default function PriceListFooter({
  editing,
  handleClear,
  handleSave,
  setEditing,
}) {
  return (
    <div className="border-t bg-slate-50 px-4 py-3 flex justify-end gap-3">
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="px-6 py-2 rounded bg-emerald-500 text-white"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded bg-emerald-500 text-white"
        >
          Save
        </button>
      )}

      <button className="px-6 py-2 rounded bg-violet-500 text-white">
        List
      </button>

      <button
        onClick={handleClear}
        className="px-6 py-2 rounded bg-slate-600 text-white"
      >
        Clear
      </button>
    </div>
  );
}
