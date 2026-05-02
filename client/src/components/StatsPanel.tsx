/*
 * StatsPanel.tsx
 * Design: "Surgical Theater" — Medical statistics display
 * Shows key stroke statistics in a HUD-like panel
 */

import { motion, AnimatePresence } from "framer-motion";

interface StatsPanelProps {
  activeScene: number;
}

const sceneStats: Record<number, { label: string; value: string; unit: string }[]> = {
  2: [
    { label: "Neurons", value: "86B", unit: "cells" },
    { label: "Weight", value: "1.4", unit: "kg" },
    { label: "Blood Supply", value: "20", unit: "%" },
  ],
  3: [
    { label: "Vessel Length", value: "400", unit: "miles" },
    { label: "Blood Flow", value: "750", unit: "mL/min" },
    { label: "O₂ Usage", value: "20", unit: "%" },
  ],
  4: [
    { label: "Prevalence", value: "87", unit: "%" },
    { label: "Neurons Lost", value: "1.9M", unit: "/min" },
    { label: "Treatment Window", value: "4.5", unit: "hrs" },
  ],
  5: [
    { label: "Prevalence", value: "13", unit: "%" },
    { label: "Mortality", value: "40", unit: "%" },
    { label: "Cause #1", value: "HBP", unit: "" },
  ],
};

export default function StatsPanel({ activeScene }: StatsPanelProps) {
  const stats = sceneStats[activeScene];
  if (!stats) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScene}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="fixed right-6 md:right-16 top-24 md:top-28 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="stats-panel-bg p-4 rounded-lg border"
          style={{
            backgroundColor: "rgba(10, 10, 15, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="text-[9px] tracking-[0.3em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(0, 212, 170, 0.5)",
            }}
          >
            Key Statistics
          </div>

          <div className="flex gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="stats-value text-xl md:text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#E0E8F0",
                    }}
                  >
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "rgba(150, 160, 170, 0.5)",
                      }}
                    >
                      {stat.unit}
                    </span>
                  )}
                </div>
                <div
                  className="text-[9px] tracking-wider uppercase mt-1"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "rgba(150, 160, 170, 0.4)",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
