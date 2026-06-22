export default function ItemPhotoCard({
  imageUrl,
  loading,
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[500px]">
      {loading ? (
        <p>Loading...</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Item"
          className="
            w-64
            h-64
            object-cover
            rounded
            border
            shadow-sm
          "
        />
      ) : (
        <div
          className="
            w-64
            h-64
            border-2
            border-dashed
            rounded
            flex
            items-center
            justify-center
            text-slate-400
          "
        >
          No Image
        </div>
      )}
    </div>
  );
}
