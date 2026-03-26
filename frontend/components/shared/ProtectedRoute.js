"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { useAppSelector } from "@/lib/hooks/useAppSelector";
import { Loader } from "@/components/shared/Loader";

export function ProtectedRoute({ children }) {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader label="Loading studio..." />
      </div>
    );
  }

  return children;
}
