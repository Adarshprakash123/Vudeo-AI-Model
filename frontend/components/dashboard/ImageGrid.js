"use client";

import toast from "react-hot-toast";
import { toggleFavorite } from "@/lib/features/images/imagesSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { ImageCard } from "@/components/dashboard/ImageCard";

export function ImageGrid({ images }) {
  const dispatch = useAppDispatch();

  const handleToggleFavorite = async (id) => {
    const result = await dispatch(toggleFavorite(id));

    if (!result.error) {
      toast.success("Favorite updated");
    } else {
      toast.error(result.payload || "Unable to update favorite");
    }
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {images.map((item) => (
        <ImageCard key={item._id} item={item} onToggleFavorite={handleToggleFavorite} />
      ))}
    </div>
  );
}
