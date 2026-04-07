"use client";

import Link from "next/link";
import { Bell, LogOut, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";

export function TopBar({
  user,
  isAuthenticated = false,
  activeTab = "Images",
  onTabChange,
  onMenuOpen
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (!result.error) {
      toast.success("Logged out");
      router.replace("/login");
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-4 md:px-8">
      <div className="flex items-center gap-3 md:gap-6">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-muted text-subtle transition hover:text-white xl:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onTabChange?.("Images")}
          className={activeTab === "Images" ? "border-b-2 border-white pb-3 text-base font-semibold md:text-lg" : "pb-3 text-base font-medium text-[#5b5b5b] transition hover:text-white md:text-lg"}
        >
          Images
        </button>
        <button
          type="button"
          onClick={() => onTabChange?.("Videos")}
          className={activeTab === "Videos" ? "border-b-2 border-white pb-3 text-base font-semibold md:text-lg" : "pb-3 text-base font-medium text-[#5b5b5b] transition hover:text-white md:text-lg"}
        >
          Videos
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* PayU shortcut temporarily disabled. */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-muted text-subtle transition hover:text-white"
        >
          <Bell className="h-4 w-4" />
        </button>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-line bg-muted px-3 py-2 text-sm text-subtle transition hover:text-white md:px-4 md:py-2.5 md:flex md:items-center md:gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-line bg-muted px-4 py-2 text-sm text-white transition hover:bg-[#1a1a1a]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
