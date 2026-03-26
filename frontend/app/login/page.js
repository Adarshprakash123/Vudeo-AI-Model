import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Login to your studio"
      subtitle="Access your AI image workspace, recent generations, and media library."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
