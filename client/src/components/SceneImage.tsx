/*
 * SceneImage.tsx
 * Design: "Surgical Theater" — Background medical visualization images
 * Displays scene-specific medical imagery with cinematic transitions
 */

import { motion, AnimatePresence } from "framer-motion";
import { SCENES } from "@/lib/sceneData";

interface SceneImageProps {
  activeScene: number;
}

export default function SceneImage({ activeScene }: SceneImageProps) {
  const scene = SCENES[activeScene];
  if (!scene) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Main image - positioned on the right side */}
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full">
            <img
              src={scene.image}
              alt={scene.title}
              className="w-full h-full object-cover object-center"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
                opacity: 0.7,
              }}
            />
            {/* Color overlay matching scene accent */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${scene.accentColor}08 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(10,10,15,0.6) 80%),
                linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, transparent 20%, transparent 80%, rgba(10,10,15,0.5) 100%)
              `,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
