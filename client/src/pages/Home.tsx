/*
 * Home.tsx
 * Design: "Surgical Theater" — Dark Cinematic Medical Realism
 * Main page orchestrating the 3D Stroke Education experience
 * Scroll-driven scene transitions with cinematic effects
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import BrainScene from "@/components/BrainScene";
import SceneContent from "@/components/SceneContent";
import SceneImage from "@/components/SceneImage";
import Navigation from "@/components/Navigation";
import ECGPulse from "@/components/ECGPulse";
import ScrollIndicator from "@/components/ScrollIndicator";
import StrokeTypeSelector from "@/components/StrokeTypeSelector";
import FASTOverlay from "@/components/FASTOverlay";
import IntroOverlay from "@/components/IntroOverlay";
import VignetteEffect from "@/components/VignetteEffect";
import DepthMeter from "@/components/DepthMeter";
import StatsPanel from "@/components/StatsPanel";
import ReplayControls from "@/components/ReplayControls";
import AudioManager from "@/components/AudioManager";
import AudioToggle from "@/components/AudioToggle";
import { SCENE_COUNT } from "@/lib/sceneData";

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);
  const lastScrollTime = useRef(Date.now());
  const scrollAccumulator = useRef(0);

  // Scroll-driven scene changes
  useEffect(() => {
    if (showIntro) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      lastScrollTime.current = now;

      scrollAccumulator.current += e.deltaY;
      const threshold = 120;

      if (Math.abs(scrollAccumulator.current) > threshold && !isTransitioning) {
        if (scrollAccumulator.current > 0 && activeScene < SCENE_COUNT - 1) {
          setIsTransitioning(true);
          setActiveScene((prev) => Math.min(prev + 1, SCENE_COUNT - 1));
          scrollAccumulator.current = 0;
          setTimeout(() => setIsTransitioning(false), 800);
        } else if (scrollAccumulator.current < 0 && activeScene > 0) {
          setIsTransitioning(true);
          setActiveScene((prev) => Math.max(prev - 1, 0));
          scrollAccumulator.current = 0;
          setTimeout(() => setIsTransitioning(false), 800);
        }
      }

      if (timeDelta > 200) {
        scrollAccumulator.current = e.deltaY;
      }

      const progress = Math.min(1, Math.max(0, Math.abs(scrollAccumulator.current) / threshold));
      setScrollProgress(progress);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeScene, showIntro, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    if (showIntro) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (activeScene < SCENE_COUNT - 1) {
          setIsTransitioning(true);
          setActiveScene((prev) => prev + 1);
          setTimeout(() => setIsTransitioning(false), 800);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeScene > 0) {
          setIsTransitioning(true);
          setActiveScene((prev) => prev - 1);
          setTimeout(() => setIsTransitioning(false), 800);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScene, showIntro, isTransitioning]);

  // Touch support
  useEffect(() => {
    if (showIntro) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;

      if (Math.abs(delta) > 50) {
        if (delta > 0 && activeScene < SCENE_COUNT - 1) {
          setIsTransitioning(true);
          setActiveScene((prev) => prev + 1);
          setTimeout(() => setIsTransitioning(false), 800);
        } else if (delta < 0 && activeScene > 0) {
          setIsTransitioning(true);
          setActiveScene((prev) => prev - 1);
          setTimeout(() => setIsTransitioning(false), 800);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeScene, showIntro, isTransitioning]);

  const handleSceneChange = useCallback((scene: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveScene(scene);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const handleStart = useCallback(() => {
    setShowIntro(false);
    setAudioEnabled(true);
  }, []);

  const handleReplay = useCallback(() => {
    setIsTransitioning(true);
    setActiveScene(0);
    setTimeout(() => setIsTransitioning(false), 800);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

  const handleGameBtnClick = useCallback(() => {
    setBtnPressed(true);
    setTimeout(() => {
      setBtnPressed(false);
      setShowGame(true);
    }, 300);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* CSS animations for game button */}
      <style>{`
        @keyframes hud-scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes hud-corner-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes hud-flicker {
          0%, 92%, 100% { opacity: 1; }
          94% { opacity: 0.5; }
          96% { opacity: 0.9; }
          98% { opacity: 0.6; }
        }
        @keyframes hud-glow-breathe {
          0%, 100% { box-shadow: 0 0 18px rgba(255,80,0,0.15), inset 0 0 18px rgba(255,80,0,0.04); }
          50% { box-shadow: 0 0 30px rgba(255,80,0,0.25), inset 0 0 24px rgba(255,80,0,0.08); }
        }
        @keyframes hud-press-flash {
          0% { background: rgba(255,80,0,0.06); }
          40% { background: rgba(255,80,0,0.28); }
          100% { background: rgba(255,80,0,0.06); }
        }
        @keyframes sub-drift {
          0%, 100% { opacity: 0.35; letter-spacing: 0.18em; }
          50% { opacity: 0.55; letter-spacing: 0.22em; }
        }
        .hud-btn-wrap { position: relative; display: inline-block; }
        .hud-btn {
          background: rgba(255,80,0,0.06);
          border: none;
          cursor: pointer;
          position: relative;
          padding: 16px 52px 16px 44px;
          display: flex;
          align-items: center;
          gap: 14px;
          clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%);
          transition: background 0.25s ease, transform 0.15s ease;
          animation: hud-glow-breathe 3s ease-in-out infinite;
          outline: none;
        }
        .hud-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255,80,0,0.4);
          clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%);
          transition: border-color 0.25s ease;
          pointer-events: none;
        }
        .hud-btn::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 30%;
          background: linear-gradient(90deg, transparent, rgba(255,130,40,0.14), transparent);
          animation: hud-scanline 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .hud-btn:hover {
          background: rgba(255,80,0,0.13);
          transform: translateY(-1px);
          animation: none;
          box-shadow: 0 0 40px rgba(255,80,0,0.3), inset 0 0 28px rgba(255,80,0,0.1);
        }
        .hud-btn:hover::before {
          border-color: rgba(255,120,40,0.85);
        }
        .hud-btn.pressed {
          transform: scale(0.97) translateY(1px);
          animation: hud-press-flash 0.3s ease forwards;
        }
        .hud-btn.pressed::before {
          border-color: rgba(255,200,80,0.9);
        }
        .hud-play-icon {
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 11px solid rgba(255,140,60,0.85);
          transition: border-left-color 0.25s;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .hud-btn:hover .hud-play-icon { border-left-color: rgba(255,210,100,1); }
        .hud-btn.pressed .hud-play-icon { border-left-color: rgba(255,255,160,1); }
        .hud-label {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,140,60,0.9);
          transition: color 0.25s;
          position: relative;
          z-index: 1;
          animation: hud-flicker 6s infinite;
          white-space: nowrap;
        }
        .hud-btn:hover .hud-label { color: rgba(255,210,100,1); animation: none; }
        .hud-btn.pressed .hud-label { color: rgba(255,255,180,1); animation: none; }
        .hud-plus {
          font-family: var(--font-mono, monospace);
          font-size: 15px;
          color: rgba(255,80,0,0.45);
          position: relative;
          z-index: 1;
          transition: color 0.25s;
        }
        .hud-btn:hover .hud-plus { color: rgba(255,130,40,0.9); }
        .hud-corner {
          position: absolute;
          width: 7px; height: 7px;
          border-color: rgba(255,100,20,0.75);
          border-style: solid;
          animation: hud-corner-pulse 2.2s ease-in-out infinite;
          pointer-events: none;
        }
        .hud-corner-tl { top: -1px; left: 12px; border-width: 1.5px 0 0 1.5px; }
        .hud-corner-tr { top: -1px; right: -1px; border-width: 1.5px 1.5px 0 0; }
        .hud-corner-bl { bottom: -1px; left: 12px; border-width: 0 0 1.5px 1.5px; }
        .hud-corner-br { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }
        .hud-sub {
          position: absolute;
          bottom: -22px;
          left: 16px;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: rgba(255,80,0,0.4);
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
          animation: sub-drift 4s ease-in-out infinite;
        }
        .hud-dot {
          position: absolute;
          top: -22px;
          left: 16px;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: rgba(255,80,0,0.35);
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: 0.2em;
        }
      `}</style>

      {/* Audio Manager (procedural sound) */}
      <AudioManager activeScene={activeScene} enabled={audioEnabled} />

      {/* 3D Three.js Scene */}
      <BrainScene activeScene={activeScene} scrollProgress={scrollProgress} />

      {/* Background medical images */}
      <SceneImage activeScene={activeScene} />

      {/* Gradient overlays for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `
            linear-gradient(135deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.3) 40%, transparent 60%),
            linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, transparent 10%, transparent 90%, rgba(10,10,15,0.5) 100%)
          `,
        }}
      />

      {/* Scanline effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          opacity: 0.3,
        }}
      />

      {/* Vignette effect for stroke scenes */}
      {!showIntro && <VignetteEffect activeScene={activeScene} />}

      {/* Scene text content */}
      {!showIntro && activeScene !== 6 && <SceneContent activeScene={activeScene} scrollProgress={scrollProgress} />}

      {/* Depth meter */}
      {!showIntro && <DepthMeter activeScene={activeScene} />}

      {/* Stats panel */}
      {!showIntro && <StatsPanel activeScene={activeScene} />}

      {/* Navigation */}
      {!showIntro && (
        <Navigation activeScene={activeScene} onSceneChange={handleSceneChange} />
      )}

      {/* ECG Pulse Line */}
      {!showIntro && <ECGPulse activeScene={activeScene} />}

      {/* Scroll indicator */}
      {!showIntro && <ScrollIndicator visible={activeScene === 0} />}

      {/* Game Button — scene 1 only */}
      {!showIntro && activeScene === 1 && (
        <div
          className="fixed bottom-28 left-1/2 -translate-x-1/2"
          style={{ zIndex: 40 }}
        >
          <div className="hud-btn-wrap">
            <div className="hud-dot">● &nbsp; Interactive Module</div>
            <button
              className={`hud-btn${btnPressed ? " pressed" : ""}`}
              onClick={handleGameBtnClick}
            >
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-tr" />
              <div className="hud-corner hud-corner-bl" />
              <div className="hud-corner hud-corner-br" />
              <div className="hud-play-icon" />
              <span className="hud-label">Start Game</span>
              <span className="hud-plus">+</span>
            </button>
            <div className="hud-sub">Initiate Sequence //———</div>
          </div>
        </div>
      )}

      {/* Stroke type selector */}
      {!showIntro && (
        <StrokeTypeSelector activeScene={activeScene} onSelectType={handleSceneChange} />
      )}

      {/* F.A.S.T. overlay for impact scene */}
      {!showIntro && <FASTOverlay visible={activeScene === 6} />}

      {/* Replay controls for final scene */}
      {!showIntro && (
        <ReplayControls
          visible={activeScene === 6}
          onReplay={handleReplay}
          onGoToScene={handleSceneChange}
        />
      )}

      {/* Audio toggle */}
      {!showIntro && <AudioToggle enabled={audioEnabled} onToggle={toggleAudio} />}

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && <IntroOverlay visible={showIntro} onStart={handleStart} />}
      </AnimatePresence>

      {/* Depth level indicator (mobile - bottom left) */}
      {!showIntro && (
        <div
          className="fixed left-6 md:left-12 bottom-16 pointer-events-none lg:hidden"
          style={{ zIndex: 35 }}
        >
          <div
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(150, 160, 170, 0.3)",
            }}
          >
            Depth Level
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(0, 212, 170, 0.4)",
            }}
          >
            {String(activeScene + 1).padStart(2, "0")}
          </div>
        </div>
      )}

      {/* Game Modal */}
      {showGame && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 60, backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setShowGame(false)}
        >
          <div
            className="absolute inset-6 md:inset-12"
            style={{
              border: "1px solid rgba(255, 80, 0, 0.3)",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 0 80px rgba(255, 60, 0, 0.2), inset 0 0 80px rgba(0,0,0,0.5)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header bar */}
            <div
              style={{
                background: "rgba(10,10,15,0.95)",
                borderBottom: "1px solid rgba(255, 80, 0, 0.2)",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "rgba(255, 120, 40, 0.7)",
                textTransform: "uppercase",
              }}>
                ● &nbsp; Stroke Training Module
              </span>
              <button
                onClick={() => setShowGame(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 100, 40, 0.6)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,140,60,1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,100,40,0.6)")}
              >
                ESC / ปิด ✕
              </button>
            </div>

            {/* iframe */}
            <iframe
              src="/game/index.html"
              style={{ width: "100%", height: "calc(100% - 41px)", border: "none", display: "block" }}
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}