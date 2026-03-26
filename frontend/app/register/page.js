import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start with a production-ready dashboard built for creative SaaS workflows."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
