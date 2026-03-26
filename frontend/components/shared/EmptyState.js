import { ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center rounded-[24px] bg-[#090909] px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-yellow-300/90 to-yellow-600/90 text-black shadow-panel">
        <ImageIcon className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[36px]">
        Generate your first AI image
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-subtle md:text-base">
        Describe anything you imagine and QRT Studio will generate a polished mock visual for your
        dashboard.
      </p>
    </div>
  );
}
