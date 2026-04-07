"use client";

import Link from "next/link";
import clsx from "clsx";
import { Compass, FolderOpen, Heart, ImageIcon, Search, Star, Upload, Video, X } from "lucide-react";

const primaryItems = [
  { label: "Explore", icon: Compass },
  { label: "Images", icon: ImageIcon },
  { label: "Videos", icon: Video },
  { label: "Likes", icon: Heart }
];

const libraryItems = [
  { label: "My Media", icon: FolderOpen },
  { label: "Favorites", icon: Star },
  { label: "Uploads", icon: Upload }
];

export function Sidebar({
  user,
  isAuthenticated = false,
  activeItem = "Images",
  onItemSelect,
  mobileOpen = false,
  onClose
}) {
  const handleSelect = (label) => {
    onItemSelect?.(label);
    onClose?.();
  };

  const content = (
    <>
      <div className="border-b border-line px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-accent text-base font-bold text-black">
              Q
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">QRT Studio</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[#171717] text-subtle transition hover:text-white xl:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="rounded-[20px] border border-line bg-[#151515] p-1">
          <div className="flex items-center gap-2 rounded-[16px] bg-[#1a1a1a] px-3 py-2.5">
            <Search className="h-4 w-4 text-subtle" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-subtle"
            />
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelect(item.label)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-[13px] transition",
                  isActive ? "bg-[#1f1f1f] text-white" : "text-subtle hover:bg-muted hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-7 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f4f4f]">
          Library
        </div>

        <nav className="mt-2.5 space-y-1">
          {libraryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelect(item.label)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-[13px] transition",
                  activeItem === item.label
                    ? "bg-[#1f1f1f] text-white"
                    : "text-subtle hover:bg-muted hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-line px-4 py-4">
        {isAuthenticated ? (
          <div className="space-y-1 text-center">
            <p className="text-[14px] font-medium text-white">{user?.name || "QRT User"}</p>
            <p className="break-all text-[12px] text-[#8a8a8a]">
              {user?.email || "creative@qrt.studio"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#555]">Start here</p>
            <div className="grid gap-2">
              <Link
                href="/login"
                className="rounded-full border border-line bg-muted px-4 py-2.5 text-center text-[13px] text-white transition hover:bg-[#1a1a1a]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2.5 text-center text-[13px] font-medium text-black transition hover:brightness-110"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line bg-[#101010] xl:flex">
        {content}
      </aside>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition xl:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[340px] flex-col border-r border-line bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 xl:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
