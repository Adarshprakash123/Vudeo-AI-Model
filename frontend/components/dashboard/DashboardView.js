"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/shared/Loader";
import { ImageGrid } from "@/components/dashboard/ImageGrid";
import { PaymentPanel } from "@/components/dashboard/PaymentPanel";
import { PromptBar } from "@/components/dashboard/PromptBar";
import { fetchImages } from "@/lib/features/images/imagesSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { useAppSelector } from "@/lib/hooks/useAppSelector";

export function DashboardView() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, isLoading, error } = useAppSelector((state) => state.images);

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

  return (
    <div className="h-screen overflow-hidden bg-[#080808]">
      <div className="flex h-full overflow-hidden xl:flex-row">
        <Sidebar user={user} isAuthenticated={isAuthenticated} />

        <section className="grid min-w-0 flex-1 grid-rows-[auto_1fr_auto] overflow-hidden">
          <TopBar user={user} isAuthenticated={isAuthenticated} />

          <div className="min-h-0 overflow-y-auto px-5 py-4 md:px-7 md:py-5">
            {isAuthenticated && <PaymentPanel user={user} paymentQuery={searchParams} />}

            {isAuthenticated && isLoading ? (
              <div className="flex h-full min-h-[320px] items-center justify-center">
                <Loader label="Loading studio assets..." />
              </div>
            ) : items.length === 0 ? (
              <EmptyState />
            ) : (
              <ImageGrid images={items} />
            )}
          </div>

          <div className="border-t border-line px-5 py-3.5 md:px-7 md:py-4">
            <PromptBar isAuthenticated={isAuthenticated} />
          </div>
        </section>
      </div>
    </div>
  );
}
