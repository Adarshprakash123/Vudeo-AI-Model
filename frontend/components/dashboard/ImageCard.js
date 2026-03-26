"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import clsx from "clsx";

export function ImageCard({ item, onToggleFavorite }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-line bg-panel">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.prompt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(item._id)}
          className={clsx(
            "absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur",
            item.isFavorite
              ? "border-red-400/50 bg-red-500/20 text-red-300"
              : "border-white/10 bg-black/35 text-white"
          )}
        >
          <Heart className={clsx("h-5 w-5", item.isFavorite && "fill-current")} />
        </button>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-2 text-base font-medium text-white">{item.prompt}</p>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-subtle">
            {item.aspectRatio || "1:1"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-subtle">
          <span className="capitalize">{item.source}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
