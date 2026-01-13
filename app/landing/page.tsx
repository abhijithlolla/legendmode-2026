"use client";
import Link from "next/link";
import { CheckCircle2, Zap, TrendingUp, Users, Crown, ShieldCheck, Sparkles } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Landing() {
  return (
    <div className="min-h-screen relative text-white bg-black selection:bg-cyan-500/30">
      <AmbientBackground />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-black text-sm">LM</div>
            <div className="text-xl font-black tracking-tighter uppercase">Legend Mode</div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Sign In</Link>
            <Link
              href="/auth"
              className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative pt-32 pb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The 2026 Protocol is Live</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gradient">
            DON'T JUST SURVIVE.<br />BECOME A <span className="text-cyan-400">LEGEND</span>.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The world's most immersive discipline system. Pro-grade habit tracking, gamified progression, and elite analytics.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth"
              className="px-10 py-4 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl shadow-cyan-500/40"
            >
              Start Your Protocol →
            </Link>
            <button className="px-10 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all active:scale-95">
              View Specs
            </button>
          </div>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 py-20"
        >
          <motion.div variants={item} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Gamified Progress</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Earn experience points for every discipline. Level up your life and unlock power-ups that reward your consistency.</p>
          </motion.div>
          <motion.div variants={item} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Elite Analytics</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Visualize your progress with high-fidelity charts. Identify patterns, optimize your schedule, and eliminate friction.</p>
          </motion.div>
          <motion.div variants={item} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">PWA Architecture</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Install Legend Mode as a native app on iOS or Android. Full offline support and lightning-fast performance.</p>
          </motion.div>
        </motion.div>

        {/* PRICING */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Lock in your Pricing</h2>
            <p className="text-zinc-500 font-medium">No hidden fees. Just results.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* FREE */}
            <div className="p-10 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl flex flex-col">
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">The Civilian</h3>
                <div className="text-4xl font-black tracking-tight">$0<span className="text-lg text-zinc-600 font-medium">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-10 text-sm font-medium text-zinc-400">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> All Core Disciplines</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> Basic Streak Tracking</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> Local Progress Storage</li>
              </ul>
              <Link href="/auth" className="mt-auto py-4 rounded-2xl border border-white/10 text-center text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Start Free</Link>
            </div>

            {/* PRO */}
            <div className="p-10 rounded-3xl border border-amber-500/30 bg-amber-500/[0.02] backdrop-blur-xl relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/40">
                Recommended
              </div>
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                  <Crown className="w-4 h-4" /> The Legend
                </h3>
                <div className="text-4xl font-black tracking-tight">$9.99<span className="text-lg text-amber-500/50 font-medium">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-10 text-sm font-medium text-zinc-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Unlimited Habits & Goals</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Advanced Analytics & Insights</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Cloud Sync Everywhere</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Exclusive Power-ups</li>
              </ul>
              <Link href="/auth" className="mt-auto py-4 rounded-2xl bg-amber-500 text-black text-center text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/20">Upgrade Now</Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-32 text-center border-t border-white/5">
          <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase">Ready to Ascend?</h2>
          <p className="text-zinc-500 font-medium mb-12 max-w-xl mx-auto italic text-lg">"Discipline is the bridge between goals and accomplishment."</p>
          <Link
            href="/auth"
            className="inline-block px-12 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-2xl shadow-blue-500/20"
          >
            Start Your Journey
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-600 font-bold uppercase tracking-widest text-[9px]">
        <p>© 2026 Legend Mode Protocol. Designed for elite performance.</p>
        <div className="flex gap-8">
          <button className="hover:text-white transition-colors">Twitter</button>
          <button className="hover:text-white transition-colors">Privacy</button>
          <button className="hover:text-white transition-colors">Terms</button>
        </div>
      </footer>
    </div>
  );
}
