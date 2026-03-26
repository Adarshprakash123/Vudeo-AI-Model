"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearAuthError, loginUser, registerUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/useAppDispatch";
import { useAppSelector } from "@/lib/hooks/useAppSelector";

export function AuthForm({ mode = "login" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, isAuthenticated, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const action =
      mode === "register"
        ? registerUser(form)
        : loginUser({ email: form.email, password: form.password });

    const result = await dispatch(action);

    if (!result.error) {
      toast.success(mode === "register" ? "Account created" : "Welcome back");
      router.replace("/dashboard");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {mode === "register" && (
        <label className="block">
          <span className="mb-2 block text-sm text-subtle">Name</span>
          <input
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-line bg-muted px-4 py-3 text-white placeholder:text-subtle"
            placeholder="QRT User"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-2 block text-sm text-subtle">Email</span>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-2xl border border-line bg-muted px-4 py-3 text-white placeholder:text-subtle"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-subtle">Password</span>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="w-full rounded-2xl border border-line bg-muted px-4 py-3 text-white placeholder:text-subtle"
          placeholder="Minimum 6 characters"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-accent px-4 py-3 font-medium text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
      </button>

      <p className="text-sm text-subtle">
        {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={mode === "register" ? "/login" : "/register"}
          className="font-medium text-white underline underline-offset-4"
        >
          {mode === "register" ? "Login" : "Register"}
        </Link>
      </p>
    </form>
  );
}
