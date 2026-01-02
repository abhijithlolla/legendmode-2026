import Link from "next/link";
import { CheckCircle2, Zap, TrendingUp, Users } from "lucide-react";
import RocketBackground from "@/components/RocketBackground";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
            <RocketBackground />
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">Legend Mode</div>
          <Link
            href="/auth"
            className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-sm hover:bg-cyan-500/20 transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-xs text-cyan-400 font-medium">🚀 Crush Your 2026 Goals</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Turn Habits Into{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Superpowers
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Track goals, build habits, and watch yourself level up. Gamified tracking that actually feels rewarding.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth"
            className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Start Free →
          </Link>
          <button className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 transition">
            View Demo
          </button>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="max-w-6xl mx-auto px-4 py-12 border-t border-zinc-800/30">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-cyan-400">1,200+</div>
            <div className="text-sm text-zinc-500">Goals Crushed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">47,000+</div>
            <div className="text-sm text-zinc-500">Daily Habits Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">4.9★</div>
            <div className="text-sm text-zinc-500">User Rating</div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Legends Use Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 transition">
            <Zap className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold mb-2">Gamified Tracking</h3>
            <p className="text-sm text-zinc-400">Earn points, unlock levels, and build streaks that matter. Every habit counts.</p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 transition">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold mb-2">Smart Insights</h3>
            <p className="text-sm text-zinc-400">Weekly analytics show patterns. See what's working and optimize in real-time.</p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 transition">
            <CheckCircle2 className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold mb-2">Goal Tracking</h3>
            <p className="text-sm text-zinc-400">Set quarterly goals, track progress, celebrate wins. Stay aligned with what matters.</p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 transition">
            <Users className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold mb-2">Sync Everywhere</h3>
            <p className="text-sm text-zinc-400">Mobile, desktop, web. Your data stays in sync. Pick up where you left off.</p>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* FREE */}
          <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></p>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Up to 3 habits
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Basic goal tracking
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Streak counter
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <span className="w-4 h-4" />
                Advanced insights
              </li>
            </ul>
            <Link
              href="/auth"
              className="w-full px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 transition text-center"
            >
              Get Started
            </Link>
          </div>

          {/* PRO */}
          <div className="p-8 rounded-xl border border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent relative">
            <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400 font-semibold">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-6">$9.99<span className="text-lg text-zinc-500 font-normal">/mo</span></p>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Unlimited habits & goals
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Advanced insights & analytics
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Power-ups & cosmetics
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Priority support
              </li>
            </ul>
            <Link
              href="/auth"
              className="w-full px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition text-center"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center border-t border-zinc-800/30">
        <h2 className="text-3xl font-bold mb-4">Ready to Become a Legend?</h2>
        <p className="text-zinc-400 mb-8">Start free. Upgrade anytime. No credit card required.</p>
        <Link
          href="/auth"
          className="inline-block px-8 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
        >
          Start Your Journey
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/30 py-8 text-center text-sm text-zinc-500">
        <p>© 2026 Legend Mode. Built for winners who ship.</p>
      </footer>
    </div>
  );
}
