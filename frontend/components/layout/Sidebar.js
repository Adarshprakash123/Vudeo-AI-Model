"use client";

import Link from "next/link";
import clsx from "clsx";
import { Compass, FolderOpen, Heart, ImageIcon, Star, Upload, Video } from "lucide-react";

const primaryItems = [
  { label: "Explore", icon: Compass },
  { label: "Images", icon: ImageIcon, active: true },
  { label: "Videos", icon: Video },
  { label: "Likes", icon: Heart }
];

const libraryItems = [
  { label: "My Media", icon: FolderOpen },
  { label: "Favorites", icon: Star },
  { label: "Uploads", icon: Upload }
];

export function Sidebar({ user, isAuthenticated = false }) {
  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line bg-[#101010] xl:flex">
      <div className="border-b border-line px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-accent text-base font-bold text-black">
            Q
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">QRT Studio</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="rounded-[16px] border border-line bg-muted px-3 py-2.5 text-xs text-subtle">
          Search
        </div>

        <nav className="mt-6 space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={clsx(
                  "flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-[13px] transition",
                  item.active ? "bg-[#1f1f1f] text-white" : "text-subtle hover:bg-muted hover:text-white"
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
                className="flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-[13px] text-subtle transition hover:bg-muted hover:text-white"
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-black">
              {user?.name?.[0] || "Q"}
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">{user?.name || "QRT User"}</p>
              <p className="text-[11px] text-subtle">{user?.email || "creative@qrt.studio"}</p>
            </div>
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
    </aside>
  );
}
