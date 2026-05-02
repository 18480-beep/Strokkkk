/*
 * VignetteEffect.tsx
 * Design: "Surgical Theater" — Screen effects for stroke scenes
 * Vignette, chromatic aberration simulation, and screen shake
 */

import { motion, AnimatePresence } from "framer-motion";

interface VignetteEffectProps {
  activeScene: number;
}

export default function VignetteEffect({ activeScene }: VignetteEffectProps) {
  const isStrokeScene = activeScene === 4 || activeScene === 5;
  const isHemorrhagic = activeScene === 5;

  return (
    <AnimatePresence>
      {isStrokeScene && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 4 }}
        >
          {/* Red vignette for stroke scenes */}
          <div
            className="absolute inset-0"
            style={{
              background: isHemorrhagic
                ? "radial-gradient(ellipse at center, transparent 30%, rgba(139, 0, 0, 0.15) 100%)"
                : "radial-gradient(ellipse at center, transparent 40%, rgba(255, 107, 0, 0.08) 100%)",
            }}
          />

          {/* Pulsating warning border */}
          <motion.div
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: isHemorrhagic ? 0.8 : 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
            style={{
              boxShadow: isHemorrhagic
                ? "inset 0 0 100px rgba(255, 0, 64, 0.15)"
                : "inset 0 0 80px rgba(255, 107, 0, 0.1)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
