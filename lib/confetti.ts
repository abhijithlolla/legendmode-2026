export async function confettiBurst(originY: number = 0.7) {
  if (typeof window === "undefined") return;
  const { default: confetti } = await import("canvas-confetti");
  confetti({ particleCount: 120, spread: 70, origin: { y: originY } });
}

export async function confettiMega() {
  if (typeof window === "undefined") return;
  const { default: confetti } = await import("canvas-confetti");
  const defaults = { spread: 70, ticks: 200, gravity: 0.7 } as const;
  confetti({ ...defaults, particleCount: 200, scalar: 1.2, origin: { y: 0.6 } });
  setTimeout(() => confetti({ ...defaults, particleCount: 160, scalar: 1.0, origin: { y: 0.5 } }), 200);
  setTimeout(() => confetti({ ...defaults, particleCount: 120, scalar: 0.9, origin: { y: 0.4 } }), 400);
}
