"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CarGameProps = {
  open: boolean;
  onClose: () => void;
};

type Obstacle = { lane: number; y: number; color: string };

const LANES = 3;
const W = 360;
const H = 560;

export function CarGame({ open, onClose }: CarGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [alive, setAlive] = useState(true);
  const [started, setStarted] = useState(false);

  const state = useRef({
    lane: 1,
    targetLane: 1,
    y: H - 110,
    speed: 4.2,
    distance: 0,
    obstacles: [] as Obstacle[],
    spawn: 0,
    roadOffset: 0,
    crash: false,
    keys: new Set<string>(),
  });

  useEffect(() => {
    if (!open) return;
    const stored = Number(window.localStorage.getItem("sp-garage-best") || 0);
    setBest(Number.isFinite(stored) ? stored : 0);
    setScore(0);
    setAlive(true);
    setStarted(false);
    state.current = {
      lane: 1,
      targetLane: 1,
      y: H - 110,
      speed: 4.2,
      distance: 0,
      obstacles: [],
      spawn: 0,
      roadOffset: 0,
      crash: false,
      keys: new Set(),
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const k = e.key.toLowerCase();
      if (["arrowleft", "a", "arrowright", "d", " ", "arrowup", "w"].includes(k)) {
        e.preventDefault();
      }
      if (!started && (k === " " || k === "enter" || k === "arrowup" || k === "w")) {
        setStarted(true);
        return;
      }
      if (!alive && (k === " " || k === "enter" || k === "r")) {
        resetRun();
        return;
      }
      if (k === "arrowleft" || k === "a") {
        state.current.targetLane = Math.max(0, state.current.targetLane - 1);
      }
      if (k === "arrowright" || k === "d") {
        state.current.targetLane = Math.min(LANES - 1, state.current.targetLane + 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, started, alive]);

  function resetRun() {
    state.current.lane = 1;
    state.current.targetLane = 1;
    state.current.speed = 4.2;
    state.current.distance = 0;
    state.current.obstacles = [];
    state.current.spawn = 0;
    state.current.crash = false;
    setScore(0);
    setAlive(true);
    setStarted(true);
  }

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const laneX = (lane: number) => {
      const pad = 48;
      const usable = W - pad * 2;
      const laneW = usable / LANES;
      return pad + laneW * lane + laneW / 2;
    };

    const drawCar = (x: number, y: number, color: string, player = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-16, -28, 32, 56, 6);
      ctx.fill();
      ctx.fillStyle = player ? "#0A0B0D" : "rgba(10,11,13,0.55)";
      ctx.fillRect(-12, -18, 24, 14);
      ctx.fillRect(-12, 4, 24, 12);
      ctx.fillStyle = "#3DFFC8";
      if (player) {
        ctx.fillRect(-10, 22, 6, 4);
        ctx.fillRect(4, 22, 6, 4);
      } else {
        ctx.fillStyle = "#F1F2F4";
        ctx.fillRect(-10, -26, 6, 4);
        ctx.fillRect(4, -26, 6, 4);
      }
      ctx.restore();
    };

    const tick = () => {
      const s = state.current;
      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue("--ink").trim() || "#0A0B0D";
      const porcelain = styles.getPropertyValue("--porcelain").trim() || "#E9EBEF";
      const accent = styles.getPropertyValue("--accent").trim() || "#3DFFC8";
      const line = styles.getPropertyValue("--line").trim() || "#24272D";
      const isLight = document.documentElement.classList.contains("light");
      const road = isLight ? "#1a1d22" : "#121418";
      const asphaltLine = isLight ? "#3a4048" : "#2a2e36";

      // smooth lane lerp
      s.lane += (s.targetLane - s.lane) * 0.22;

      if (started && !s.crash) {
        s.speed += 0.0012;
        s.distance += s.speed * 0.35;
        s.roadOffset = (s.roadOffset + s.speed * 1.8) % 40;
        s.spawn -= 1;
        if (s.spawn <= 0) {
          const lane = Math.floor(Math.random() * LANES);
          const colors = ["#8B909A", "#5C6370", "#F1F2F4", "#2AE0B0"];
          s.obstacles.push({
            lane,
            y: -60,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
          s.spawn = Math.max(28, 70 - s.speed * 4) + Math.random() * 18;
        }
        for (const o of s.obstacles) {
          o.y += s.speed * 1.55;
        }
        s.obstacles = s.obstacles.filter((o) => o.y < H + 80);

        const px = laneX(s.lane);
        const py = s.y;
        for (const o of s.obstacles) {
          const ox = laneX(o.lane);
          if (Math.abs(ox - px) < 30 && Math.abs(o.y - py) < 52) {
            s.crash = true;
            const finalScore = Math.floor(s.distance);
            setScore(finalScore);
            setAlive(false);
            setBest((b) => {
              const next = Math.max(b, finalScore);
              window.localStorage.setItem("sp-garage-best", String(next));
              return next;
            });
            break;
          }
        }
        if (!s.crash) setScore(Math.floor(s.distance));
      }

      // draw
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, W, H);

      // roadside
      ctx.fillStyle = isLight ? porcelain : "#0d0f12";
      ctx.fillRect(0, 0, 40, H);
      ctx.fillRect(W - 40, 0, 40, H);

      // road
      ctx.fillStyle = road;
      ctx.fillRect(40, 0, W - 80, H);

      // lane dashes
      ctx.strokeStyle = asphaltLine;
      ctx.lineWidth = 3;
      ctx.setLineDash([18, 22]);
      ctx.lineDashOffset = -s.roadOffset;
      for (let i = 1; i < LANES; i++) {
        const x = 40 + ((W - 80) / LANES) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // edge lines
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(44, 0);
      ctx.lineTo(44, H);
      ctx.moveTo(W - 44, 0);
      ctx.lineTo(W - 44, H);
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (const o of s.obstacles) {
        drawCar(laneX(o.lane), o.y, o.color);
      }
      drawCar(laneX(s.lane), s.y, accent, true);

      if (s.crash) {
        ctx.fillStyle = "rgba(10,11,13,0.55)";
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, started]);

  function nudge(dir: -1 | 1) {
    if (!started) {
      setStarted(true);
      return;
    }
    if (!alive) {
      resetRun();
      return;
    }
    state.current.targetLane = Math.max(
      0,
      Math.min(LANES - 1, state.current.targetLane + dir),
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Secret garage car game"
            className="w-full max-w-[400px] overflow-hidden border border-line bg-bg shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Secret · Garage
                </p>
                <p className="font-display text-lg font-bold tracking-tight">
                  Midnight Circuit
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg"
              >
                Esc
              </button>
            </div>

            <div className="relative bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))] px-3 py-3">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="mx-auto block h-auto w-full max-w-[360px] touch-none border border-line"
              />

              <div className="pointer-events-none absolute inset-x-3 top-5 flex justify-between px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg">
                <span>Score {score}</span>
                <span>Best {best}</span>
              </div>

              {!started && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="border border-accent/50 bg-bg/80 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Ready?
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Space / tap to start · A D or ← →
                    </p>
                  </div>
                </div>
              )}

              {!alive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="border border-line bg-bg/85 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Crashed
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Score {score} · R / Space to retry
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-line p-3 sm:hidden">
              <button
                type="button"
                onClick={() => nudge(-1)}
                className="border border-line py-3 font-mono text-[11px] uppercase tracking-[0.16em]"
              >
                ← Left
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!started) setStarted(true);
                  else if (!alive) resetRun();
                }}
                className="border border-accent bg-accent/10 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
              >
                {!started ? "Start" : !alive ? "Retry" : "Go"}
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                className="border border-line py-3 font-mono text-[11px] uppercase tracking-[0.16em]"
              >
                Right →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
