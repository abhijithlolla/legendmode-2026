export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          <span className="text-gradient">Legend Mode 2026</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
          Crush your goals and track your habits with a professional, beautiful dashboard. 
          Built for winners who refuse to compromise on 2026.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="btn-primary text-lg">
            Get Started
          </button>
          <button className="btn-secondary text-lg">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold text-blue-400 mb-2">🎯</h3>
            <h4 className="text-lg font-semibold mb-2">Goal Tracking</h4>
            <p className="text-slate-400">Set, track, and achieve your 2026 goals with precision</p>
          </div>

          <div className="card hover:border-cyan-500/50 transition-all duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">📊</h3>
            <h4 className="text-lg font-semibold mb-2">Analytics</h4>
            <p className="text-slate-400">Beautiful visualizations of your progress</p>
          </div>

          <div className="card hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">🚀</h3>
            <h4 className="text-lg font-semibold mb-2">Momentum</h4>
            <p className="text-slate-400">Build unstoppable habits and maintain streaks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
