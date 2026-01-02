"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [authMode, setAuthMode] = useState<"password" | "magic-link">("password");

  useEffect(() => {
    // Set redirect URL only on client side
    setRedirectUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) router.replace("/");
    });
    return () => sub?.subscription.unsubscribe();
  }, [router]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setStatus("Supabase not configured.");
      return;
    }
    setStatus("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Signed in!");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setStatus("Supabase not configured.");
      return;
    }
    setStatus("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    setStatus(error ? `Error: ${error.message}` : "Check your email for the login link.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h1 className="text-lg font-semibold">Sign in to Legend Mode</h1>
        <p className="mt-1 text-xs text-zinc-400">{authMode === "password" ? "Enter your password" : "We send you a magic link"}</p>
        
        <div className="mt-4 flex gap-2 mb-4">
          <button
            onClick={() => setAuthMode("password")}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs transition ${
              authMode === "password"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setAuthMode("magic-link")}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs transition ${
              authMode === "magic-link"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Magic Link
          </button>
        </div>

        <form
          onSubmit={authMode === "password" ? handlePasswordLogin : handleMagicLink}
          className="space-y-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
          />
          {authMode === "password" && (
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
            />
          )}
          <button
            type="submit"
            className="w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          >
            {authMode === "password" ? "Sign In" : "Send magic link"}
          </button>
        </form>
        {status && <div className="mt-2 text-xs text-zinc-400">{status}</div>}
      </div>
    </div>
  );
}
