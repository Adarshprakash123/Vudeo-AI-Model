"use client";

import Link from "next/link";
import { Bell, LogOut, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";

export function TopBar({ user, isAuthenticated = false }) {
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
    <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-8">
      <div className="flex items-center gap-6">
        <button type="button" className="border-b-2 border-white pb-3 text-lg font-semibold">
          Images
        </button>
        <button type="button" className="pb-3 text-lg font-medium text-[#5b5b5b]">
          Videos
        </button>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <a
            href="#payu-payment-panel"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-muted px-3 py-2 text-sm text-subtle transition hover:text-white md:px-4 md:py-2.5"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">PayU Checkout</span>
            <span className="sm:hidden">PayU</span>
          </a>
        )}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-muted text-subtle transition hover:text-white"
        >
          <Bell className="h-4 w-4" />
        </button>
        {isAuthenticated ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-black">
              {user?.name?.[0] || "Q"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full border border-line bg-muted px-4 py-2.5 text-sm text-subtle transition hover:text-white md:flex md:items-center md:gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
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
