/*
 * SceneContent.tsx
 * Design: "Surgical Theater" — Floating medical info panels
 * Text content that appears on the left side, synced with scroll
 * Updated: class names for light mode + text-scale CSS variable
 */

import { motion, AnimatePresence } from "framer-motion";
import { SCENES, type SceneData } from "@/lib/sceneData";

interface SceneContentProps {
  activeScene: number;
  scrollProgress: number;
}

export default function SceneContent({ activeScene, scrollProgress }: SceneContentProps) {
  const scene = SCENES[activeScene];
  if (!scene) return null;

  return (
    <div className="fixed left-0 top-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 40, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-6 md:left-12 lg:left-28 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md lg:max-w-lg"
        >
          {/* Scene indicator */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: scene.accentColor }}
            />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: scene.accentColor,
                fontSize: `calc(0.75rem * var(--text-scale, 1))`,
              }}
            >
              Scene {scene.id + 1} / {SCENES.length}
            </span>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-mono)",
              color: scene.accentColor,
              opacity: 0.8,
              fontSize: `calc(0.9rem * var(--text-scale, 1))`,
              marginBottom: "0.5rem",
            }}
          >
            {scene.subtitle}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="scene-title font-bold mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F0F0F0",
              textShadow: `0 0 30px ${scene.accentColor}33`,
              fontSize: `calc(clamp(1.8rem, 4vw, 3rem) * var(--text-scale, 1))`,
            }}
          >
            {scene.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="scene-description leading-relaxed mb-6"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(200, 210, 220, 0.8)",
              fontSize: `calc(0.9rem * var(--text-scale, 1))`,
            }}
          >
            {scene.description}
          </motion.p>

          {/* Facts */}
          {scene.facts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="space-y-2"
            >
              {scene.facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-2"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: scene.accentColor, opacity: 0.6 }}
                  />
                  <span
                    className="scene-fact"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "rgba(180, 190, 200, 0.7)",
                      fontSize: `calc(0.8rem * var(--text-scale, 1))`,
                    }}
                  >
                    {fact}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 h-px origin-left"
            style={{
              background: `linear-gradient(to right, ${scene.accentColor}60, transparent)`,
              maxWidth: "200px",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
