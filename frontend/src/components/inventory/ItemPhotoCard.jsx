import { memo } from "react";

function ItemPhotoCard({ imageUrl, loading }) {
  return (
    <div className="flex min-h-[500px] flex-1 items-center justify-center p-8">
      {loading ? (
        <p>Loading...</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Item"
          className="h-64 w-64 rounded border object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-64 w-64 items-center justify-center rounded border-2 border-dashed text-slate-400">
          No Image
        </div>
      )}
    </div>
  );
}

export default memo(ItemPhotoCard);
