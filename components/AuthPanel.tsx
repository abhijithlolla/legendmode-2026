"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setStatus("Supabase not configured");
      return;
    }
    setStatus("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setStatus(error ? `Error: ${error.message}` : "Check your email for the login link.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

if (!supabase) {
    return (
      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/50">
        <div className="text-sm font-medium text-yellow-400">⚙️ Setup Required</div>
        <div className="text-xs text-zinc-400 mt-2">
          Connect your Supabase credentials to sync your progress across devices.
        </div>
        <div className="text-xs text-zinc-500 mt-3">
          For now, you can track locally. Your data will be saved to this browser.
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900/50">
      <div className="mb-2 text-sm text-zinc-400">Authentication</div>
      {userEmail ? (
        <div className="flex items-center justify-between">
          <div className="text-sm">Signed in as <span className="font-medium">{userEmail}</span></div>
          <button onClick={signOut} className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800">Sign Out</button>
        </div>
      ) : (
        <form onSubmit={signIn} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
          />
          <button type="submit" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Sign In</button>
        </form>
      )}
      {status && <div className="mt-2 text-xs text-zinc-400">{status}</div>}
    </div>
  );
}
