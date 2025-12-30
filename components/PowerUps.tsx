"use client";
import { POWER_UPS, PowerUp } from "@/lib/habits";

type Props = {
  availablePoints: number;
  onPurchase: (power: PowerUp) => void;
};

export default function PowerUps({ availablePoints, onPurchase }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">Power-Ups</div>
      {POWER_UPS.map((p) => {
        const canBuy = availablePoints >= p.cost;
        return (
          <button
            key={p.id}
            disabled={!canBuy}
            onClick={() => onPurchase(p)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition-opacity ${
              canBuy ? "border-zinc-700 hover:bg-zinc-800" : "border-zinc-800 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-400">{p.description}</div>
              </div>
              <div className="text-yellow-400 font-semibold">{p.cost}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
