/*
 * Navigation.tsx
 * Design: "Surgical Theater" — Vertical progress dots + top nav bar
 * Shows current position in the anatomical journey
 */

import { motion } from "framer-motion";
import { SCENES } from "@/lib/sceneData";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  activeScene: number;
  onSceneChange: (scene: number) => void;
}

export default function Navigation({ activeScene, onSceneChange }: NavigationProps) {
  const { logout } = useAuth();
  return (
    <>
      {/* Top navigation bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4 pointer-events-auto"
        style={{ zIndex: 40 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-[#00D4AA]/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="#00D4AA" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="6" stroke="#00D4AA" strokeWidth="0.5" opacity="0.5" />
              <line x1="8" y1="1" x2="8" y2="4" stroke="#00D4AA" strokeWidth="0.5" />
              <line x1="8" y1="12" x2="8" y2="15" stroke="#00D4AA" strokeWidth="0.5" />
              <line x1="1" y1="8" x2="4" y2="8" stroke="#00D4AA" strokeWidth="0.5" />
              <line x1="12" y1="8" x2="15" y2="8" stroke="#00D4AA" strokeWidth="0.5" />
            </svg>
          </div>
          <span
            className="text-sm font-medium tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              color: "#00D4AA",
            }}
          >
            STROKE 3D
          </span>
        </div>

        {/* Breadcrumb navigation */}
        <div className="hidden md:flex items-center gap-1">
          {SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(i)}
              className="group flex items-center gap-1 px-2 py-1 rounded transition-all duration-300 hover:bg-white/5"
            >
              <span
                className="text-[10px] tracking-wider uppercase transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: i === activeScene ? scene.accentColor : "rgba(150,160,170,0.5)",
                }}
              >
                {scene.slug}
              </span>
              {i < SCENES.length - 1 && (
                <span className="text-[10px] text-white/20 ml-1">›</span>
              )}
            </button>
          ))}
        </div>

        {/* Scene counter + Logout */}
        <div className="flex items-center gap-4">
          <div
            className="text-xs tracking-wider"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(150,160,170,0.6)",
            }}
          >
            <span style={{ color: SCENES[activeScene]?.accentColor }}>
              {String(activeScene + 1).padStart(2, "0")}
            </span>
            <span className="mx-1">/</span>
            <span>{String(SCENES.length).padStart(2, "0")}</span>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-white/10"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(150,160,170,0.55)",
              border: "1px solid rgba(150,160,170,0.15)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {/* Power icon */}
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </motion.header>

      {/* Right side vertical progress dots */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-auto"
        style={{ zIndex: 40 }}
      >
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            onClick={() => onSceneChange(i)}
            className="group relative flex items-center"
          >
            {/* Tooltip */}
            <span
              className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] tracking-wider uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-mono)",
                color: scene.accentColor,
              }}
            >
              {scene.slug}
            </span>

            {/* Dot */}
            <motion.div
              animate={{
                scale: i === activeScene ? 1 : 0.6,
                opacity: i === activeScene ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeScene ? scene.accentColor : "rgba(150,160,170,0.3)",
                boxShadow: i === activeScene ? `0 0 10px ${scene.accentColor}80` : "none",
              }}
            />

            {/* Connecting line */}
            {i < SCENES.length - 1 && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-px h-3"
                style={{
                  backgroundColor:
                    i < activeScene ? scene.accentColor + "40" : "rgba(150,160,170,0.1)",
                }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}