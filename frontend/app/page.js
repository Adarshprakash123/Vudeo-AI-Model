import { DashboardView } from "@/components/dashboard/DashboardView";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
