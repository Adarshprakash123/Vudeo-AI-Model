import { ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center rounded-[24px] border border-line bg-[#0b0b0b] px-6 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-[#141414] text-[#d7d7d7]">
        <ImageIcon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[32px]">
        No images yet
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-subtle md:text-base">
        Start with a short prompt below and your generated images will appear here.
      </p>
    </div>
  );
}
