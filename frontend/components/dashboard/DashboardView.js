"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowUpRight } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/shared/Loader";
import { ImageGrid } from "@/components/dashboard/ImageGrid";
import { PromptBar } from "@/components/dashboard/PromptBar";
import { fetchImages } from "@/lib/features/images/imagesSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { useAppSelector } from "@/lib/hooks/useAppSelector";

const sectionContent = {
  Explore: {
    eyebrow: "Creative discovery",
    title: "Explore fresh visual directions",
    description:
      "Browse trending looks, test new prompts, and use this space to discover what style you want to generate next."
  },
  Images: {
    eyebrow: "Image studio",
    title: "Manage your generated images",
    description:
      "Review your latest outputs, compare variations, and keep the strongest image concepts ready for delivery."
  },
  Videos: {
    eyebrow: "Motion workspace",
    title: "Video ideas live here",
    description:
      "Use this section for short-form concepts, motion references, and upcoming video generation workflows."
  },
  Likes: {
    eyebrow: "Saved inspiration",
    title: "Keep track of the visuals you love",
    description:
      "Liked items can act as your moodboard so you can quickly return to strong references and repeat winning styles."
  },
  "My Media": {
    eyebrow: "Personal library",
    title: "Your uploaded and generated assets",
    description:
      "This area is a simple home for all media connected to your account, so your files stay easy to find."
  },
  Favorites: {
    eyebrow: "Pinned collection",
    title: "Favorites are ready for quick access",
    description:
      "Surface your best assets here to speed up reviews, approvals, and repeat creative work."
  },
  Uploads: {
    eyebrow: "Source material",
    title: "Uploaded references and assets",
    description:
      "Track the files you brought into the studio and reuse them whenever you want to build a new prompt or variation."
  }
};

function SectionPlaceholder({ title, description, activeSection }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-[24px] border border-line bg-[#0b0b0b] px-6 text-center">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d5d5d]">
          {activeSection}
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-[34px]">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-subtle md:text-base">{description}</p>
      </div>
    </div>
  );
}

export function DashboardView() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, isLoading, error } = useAppSelector((state) => state.images);
  const [activeSection, setActiveSection] = useState("Images");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentSection = sectionContent[activeSection] || sectionContent.Images;
  const isImageSection = activeSection === "Images";

  const renderSectionContent = () => {
    if (!isImageSection) {
      return (
        <SectionPlaceholder
          activeSection={activeSection}
          title={currentSection.title}
          description={currentSection.description}
        />
      );
    }

    if (isAuthenticated && isLoading) {
      return (
        <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-line bg-[#0b0b0b]">
          <Loader label="Loading studio assets..." />
        </div>
      );
    }

    if (items.length === 0) {
      return <EmptyState />;
    }

    return <ImageGrid images={items} />;
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchImages());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error && isAuthenticated) {
      toast.error(error);
    }
  }, [error, isAuthenticated]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeSection]);

  return (
    <div className="h-screen overflow-hidden bg-[#080808]">
      <div className="flex h-full overflow-hidden xl:flex-row">
        <Sidebar
          user={user}
          isAuthenticated={isAuthenticated}
          activeItem={activeSection}
          onItemSelect={setActiveSection}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <section className="grid min-w-0 flex-1 grid-rows-[auto_1fr_auto] overflow-hidden">
          <TopBar
            user={user}
            isAuthenticated={isAuthenticated}
            activeTab={activeSection === "Videos" ? "Videos" : "Images"}
            onTabChange={setActiveSection}
            onMenuOpen={() => setMobileSidebarOpen(true)}
          />

          <div className="flex min-h-0 flex-col overflow-hidden px-4 py-4 md:px-7 md:py-5">
            <div className="mb-4 rounded-[24px] border border-line bg-[#101010] p-4 md:mb-5 md:rounded-[28px] md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d6d6d]">
                    {currentSection.eyebrow}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-white md:text-[28px]">
                    {currentSection.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-subtle">
                    {currentSection.description}
                  </p>
                </div>

                <div className="hidden rounded-full border border-line bg-[#151515] px-3 py-1.5 text-xs text-subtle md:flex md:items-center md:gap-2">
                  <span>Selected</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                  <span className="text-white">{activeSection}</span>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">{renderSectionContent()}</div>
          </div>

          <div className="border-t border-line px-4 py-3.5 md:px-7 md:py-4">
            <PromptBar isAuthenticated={isAuthenticated} />
          </div>
        </section>
      </div>
    </div>
  );
}
