"use client";

import { useState } from "react";
import { ArrowUp, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { generateImage, uploadMockImage } from "@/lib/features/images/imagesSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { useAppSelector } from "@/lib/hooks/useAppSelector";

const aspectRatios = ["1:1", "16:9", "9:16", "4:5"];

export function PromptBar({ isAuthenticated = false }) {
  const dispatch = useAppDispatch();
  const { isGenerating, isUploading } = useAppSelector((state) => state.images);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast("Guest mode only: login later to save generations.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please describe the image you want to generate");
      return;
    }

    const result = await dispatch(generateImage({ prompt, aspectRatio }));

    if (!result.error) {
      toast.success("Mock image generated");
      setPrompt("");
    } else {
      toast.error(result.payload || "Generation failed");
    }
  };

  const handleMockUpload = async () => {
    if (!isAuthenticated) {
      toast("Guest mode only: login later to save uploads.");
      return;
    }

    const result = await dispatch(
      uploadMockImage({
        prompt: prompt.trim() || "Uploaded reference media"
      })
    );

    if (!result.error) {
      toast.success("Mock upload added");
    } else {
      toast.error(result.payload || "Upload failed");
    }
  };

  return (
    <div className="mx-auto h-[120px] w-full max-w-[1280px]">
      <div className="flex h-full flex-col justify-between rounded-[24px] border border-line bg-[#171717]/95 px-4 py-3.5 backdrop-blur md:px-5 md:py-4">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={1}
          placeholder="Describe an image..."
          className="min-h-[28px] w-full resize-none bg-transparent text-sm leading-6 text-white placeholder:text-[#555] md:text-base"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMockUpload}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-full border border-line bg-[#101010] px-4 py-2 text-sm text-white transition hover:bg-[#1b1b1b] disabled:opacity-60"
            >
              <ImagePlus className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Image"}
            </button>

            <select
              value={aspectRatio}
              onChange={(event) => setAspectRatio(event.target.value)}
              className="rounded-full border border-line bg-[#101010] px-4 py-2 text-sm text-white"
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-60"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
