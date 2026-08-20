"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CarGameProps = {
  open: boolean;
  onClose: () => void;
};

type Obstacle = {
  lane: number;
  y: number;
  color: string;
  scored?: boolean;
};

type Pickup = {
  lane: number;
  y: number;
  kind: "orb" | "shield" | "nitro";
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

type Floater = {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
};

const LANES = 3;
const W = 360;
const H = 560;

function freshState() {
  return {
    lane: 1,
    targetLane: 1,
    y: H - 120,
    speed: 3.6,
    distance: 0,
    score: 0,
    combo: 0,
    mult: 1,
    obstacles: [] as Obstacle[],
    pickups: [] as Pickup[],
    particles: [] as Particle[],
    floaters: [] as Floater[],
    spawn: 40,
    pickupSpawn: 90,
    roadOffset: 0,
    crash: false,
    shake: 0,
    flash: 0,
    trail: [] as { x: number; y: number }[],
    nitro: 40,
    nitroOn: false,
    shield: 0,
    invuln: 0,
  };
}

export function CarGame({ open, onClose }: CarGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [alive, setAlive] = useState(true);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const aliveRef = useRef(true);

  const state = useRef(freshState());

  useEffect(() => {
    if (!open) return;
    const stored = Number(window.localStorage.getItem("sp-garage-best") || 0);
    setBest(Number.isFinite(stored) ? stored : 0);
    setScore(0);
    setCombo(0);
    setAlive(true);
    setStarted(false);
    startedRef.current = false;
    aliveRef.current = true;
    state.current = freshState();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function resetRun() {
    state.current = freshState();
    startedRef.current = true;
    aliveRef.current = true;
    setScore(0);
    setCombo(0);
    setAlive(true);
    setStarted(true);
  }

  function startRun() {
    startedRef.current = true;
    setStarted(true);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const k = e.key.toLowerCase();
      if (
        ["arrowleft", "a", "arrowright", "d", " ", "arrowup", "w", "shift"].includes(
          k,
        )
      ) {
        e.preventDefault();
      }

      if (!startedRef.current && (k === " " || k === "enter" || k === "w")) {
        startRun();
        return;
      }
      if (!aliveRef.current && (k === " " || k === "enter" || k === "r")) {
        resetRun();
        return;
      }
      if (!aliveRef.current || !startedRef.current) return;

      if (k === "arrowleft" || k === "a") {
        state.current.targetLane = Math.max(0, state.current.targetLane - 1);
      }
      if (k === "arrowright" || k === "d") {
        state.current.targetLane = Math.min(LANES - 1, state.current.targetLane + 1);
      }
      if (k === " " || k === "shift") {
        state.current.nitroOn = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === " " || k === "shift") state.current.nitroOn = false;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [open, onClose]);

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

    const burst = (x: number, y: number, color: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 3.5;
        state.current.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.4 + Math.random() * 0.5,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const float = (x: number, y: number, text: string, color: string) => {
      state.current.floaters.push({ x, y, text, life: 1, color });
    };

    const drawCar = (
      x: number,
      y: number,
      color: string,
      player = false,
      shield = false,
    ) => {
      ctx.save();
      ctx.translate(x, y);

      if (player && shield) {
        ctx.strokeStyle = "rgba(61,255,200,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
      }

      // body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-15, -26, 30, 52, 7);
      ctx.fill();

      // cabin
      ctx.fillStyle = player ? "#0A0B0D" : "rgba(10,11,13,0.6)";
      ctx.beginPath();
      ctx.roundRect(-11, -14, 22, 16, 4);
      ctx.fill();

      // lights
      if (player) {
        ctx.fillStyle = "#E8FFF7";
        ctx.fillRect(-11, -26, 8, 4);
        ctx.fillRect(3, -26, 8, 4);
        ctx.fillStyle = "#3DFFC8";
        ctx.fillRect(-10, 20, 7, 4);
        ctx.fillRect(3, 20, 7, 4);
      } else {
        ctx.fillStyle = "#FF6B6B";
        ctx.fillRect(-10, 20, 7, 4);
        ctx.fillRect(3, 20, 7, 4);
        ctx.fillStyle = "#F1F2F4";
        ctx.fillRect(-10, -26, 7, 3);
        ctx.fillRect(3, -26, 7, 3);
      }
      ctx.restore();
    };

    const tick = () => {
      const s = state.current;
      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue("--ink").trim() || "#0A0B0D";
      const porcelain = styles.getPropertyValue("--porcelain").trim() || "#E9EBEF";
      const accent = styles.getPropertyValue("--accent").trim() || "#3DFFC8";
      const isLight = document.documentElement.classList.contains("light");
      const road = isLight ? "#1a1d22" : "#121418";
      const asphaltLine = isLight ? "#3a4048" : "#2a2e36";

      s.lane += (s.targetLane - s.lane) * 0.28;
      s.shake = Math.max(0, s.shake - 0.08);
      s.flash = Math.max(0, s.flash - 0.06);
      s.invuln = Math.max(0, s.invuln - 0.016);
      s.shield = Math.max(0, s.shield - 0.016);

      const boosting = s.nitroOn && s.nitro > 0 && startedRef.current && !s.crash;
      if (boosting) {
        s.nitro = Math.max(0, s.nitro - 0.45);
      } else if (startedRef.current && !s.crash) {
        s.nitro = Math.min(100, s.nitro + 0.12);
      }

      if (startedRef.current && !s.crash) {
        const boostMul = boosting ? 1.7 : 1;
        s.speed += 0.0009;
        const move = s.speed * boostMul;
        s.distance += move * 0.45;
        s.score += move * 0.35 * s.mult;
        s.roadOffset = (s.roadOffset + move * 2.1) % 40;

        // trail
        s.trail.unshift({ x: laneX(s.lane), y: s.y + 24 });
        if (s.trail.length > 12) s.trail.pop();

        // exhaust particles when boosting
        if (boosting && Math.random() > 0.3) {
          s.particles.push({
            x: laneX(s.lane) + (Math.random() - 0.5) * 10,
            y: s.y + 28,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 2 + Math.random() * 2,
            life: 0.35,
            color: accent,
            size: 2 + Math.random() * 2,
          });
        }

        s.spawn -= boostMul;
        if (s.spawn <= 0) {
          const pattern = Math.random();
          const colors = ["#8B909A", "#5C6370", "#C8CCD4", "#2AE0B0", "#F07167"];
          if (pattern > 0.72) {
            // two-car block with a gap
            const blocked = Math.random() > 0.5 ? [0, 1] : [1, 2];
            for (const lane of blocked) {
              s.obstacles.push({
                lane,
                y: -60,
                color: colors[Math.floor(Math.random() * colors.length)],
              });
            }
          } else {
            s.obstacles.push({
              lane: Math.floor(Math.random() * LANES),
              y: -60,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
          s.spawn = Math.max(22, 62 - s.speed * 3.2) + Math.random() * 16;
        }

        s.pickupSpawn -= 1;
        if (s.pickupSpawn <= 0) {
          const roll = Math.random();
          const kind: Pickup["kind"] =
            roll > 0.86 ? "shield" : roll > 0.72 ? "nitro" : "orb";
          s.pickups.push({
            lane: Math.floor(Math.random() * LANES),
            y: -40,
            kind,
          });
          s.pickupSpawn = 70 + Math.random() * 50;
        }

        for (const o of s.obstacles) o.y += move * 1.55;
        for (const p of s.pickups) p.y += move * 1.55;

        // near-miss / pass scoring
        const px = laneX(s.lane);
        const py = s.y;
        for (const o of s.obstacles) {
          if (o.scored) continue;
          const ox = laneX(o.lane);
          if (o.y > py + 30) {
            o.scored = true;
            const close = Math.abs(o.lane - s.lane) === 1 && Math.abs(ox - px) < 95;
            if (close) {
              s.combo += 1;
              s.mult = Math.min(8, 1 + Math.floor(s.combo / 2));
              const pts = 25 * s.mult;
              s.score += pts;
              s.flash = 0.45;
              float(px, py - 40, `NEAR +${pts}`, accent);
              burst(ox, o.y, accent, 8);
              setCombo(s.combo);
            } else {
              s.combo = Math.max(0, s.combo - 1);
              s.mult = Math.min(8, 1 + Math.floor(s.combo / 2));
              setCombo(s.combo);
            }
          }
        }

        // collisions
        for (const o of s.obstacles) {
          const ox = laneX(o.lane);
          if (Math.abs(ox - px) < 28 && Math.abs(o.y - py) < 48) {
            if (s.invuln > 0 || s.shield > 0) {
              s.shield = 0;
              s.invuln = 0.8;
              o.y = H + 100;
              burst(px, py, accent, 18);
              float(px, py - 30, "BLOCKED", accent);
              s.shake = 0.5;
            } else {
              s.crash = true;
              s.shake = 1.4;
              burst(px, py, "#F07167", 28);
              burst(px, py, accent, 12);
              const finalScore = Math.floor(s.score);
              setScore(finalScore);
              setCombo(0);
              aliveRef.current = false;
              setAlive(false);
              setBest((b) => {
                const next = Math.max(b, finalScore);
                window.localStorage.setItem("sp-garage-best", String(next));
                return next;
              });
            }
            break;
          }
        }

        // pickups
        s.pickups = s.pickups.filter((p) => {
          const x = laneX(p.lane);
          if (Math.abs(x - px) < 26 && Math.abs(p.y - py) < 36) {
            if (p.kind === "orb") {
              const pts = 40 * s.mult;
              s.score += pts;
              float(px, py - 36, `+${pts}`, accent);
              burst(x, p.y, accent, 10);
            } else if (p.kind === "shield") {
              s.shield = 4.5;
              float(px, py - 36, "SHIELD", accent);
              burst(x, p.y, accent, 12);
            } else {
              s.nitro = Math.min(100, s.nitro + 45);
              float(px, py - 36, "NITRO", accent);
              burst(x, p.y, "#F1F2F4", 12);
            }
            return false;
          }
          return p.y < H + 60;
        });

        s.obstacles = s.obstacles.filter((o) => o.y < H + 80);

        if (!s.crash) setScore(Math.floor(s.score));
      }

      // particles / floaters update
      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
      }
      s.particles = s.particles.filter((p) => p.life > 0);
      for (const f of s.floaters) {
        f.y -= 0.7;
        f.life -= 0.02;
      }
      s.floaters = s.floaters.filter((f) => f.life > 0);

      // draw
      ctx.save();
      if (s.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * s.shake * 10,
          (Math.random() - 0.5) * s.shake * 10,
        );
      }

      ctx.clearRect(-20, -20, W + 40, H + 40);
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, W, H);

      // roadside
      ctx.fillStyle = isLight ? porcelain : "#0d0f12";
      ctx.fillRect(0, 0, 40, H);
      ctx.fillRect(W - 40, 0, 40, H);

      // speed lines
      if (startedRef.current && !s.crash) {
        ctx.strokeStyle = "rgba(61,255,200,0.08)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          const x = 50 + ((i * 37 + s.roadOffset * 3) % (W - 100));
          const y = ((i * 73 + s.roadOffset * 8) % H) - 20;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 18 + s.speed * 2);
          ctx.stroke();
        }
      }

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

      // neon edges
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.4 + (boosting ? 0.25 : 0);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(44, 0);
      ctx.lineTo(44, H);
      ctx.moveTo(W - 44, 0);
      ctx.lineTo(W - 44, H);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // player trail
      if (startedRef.current) {
        for (let i = 0; i < s.trail.length; i++) {
          const t = s.trail[i];
          ctx.globalAlpha = 0.15 * (1 - i / s.trail.length);
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.roundRect(t.x - 8, t.y - 4, 16, 10, 3);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // pickups
      for (const p of s.pickups) {
        const x = laneX(p.lane);
        ctx.save();
        ctx.translate(x, p.y);
        if (p.kind === "orb") {
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.kind === "shield") {
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2;
          ctx.strokeRect(-9, -9, 18, 18);
          ctx.fillStyle = "rgba(61,255,200,0.2)";
          ctx.fillRect(-9, -9, 18, 18);
        } else {
          ctx.fillStyle = "#F1F2F4";
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(8, 8);
          ctx.lineTo(-8, 8);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      for (const o of s.obstacles) {
        drawCar(laneX(o.lane), o.y, o.color);
      }
      drawCar(laneX(s.lane), s.y, accent, true, s.shield > 0);

      // particles
      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      // floaters
      for (const f of s.floaters) {
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.fillStyle = f.color;
        ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;

      if (s.flash > 0) {
        ctx.fillStyle = `rgba(61,255,200,${s.flash * 0.12})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (s.crash) {
        ctx.fillStyle = "rgba(10,11,13,0.5)";
        ctx.fillRect(0, 0, W, H);
      }

      // nitro bar
      if (startedRef.current) {
        ctx.fillStyle = "rgba(241,242,244,0.12)";
        ctx.fillRect(54, H - 18, W - 108, 6);
        ctx.fillStyle = boosting ? accent : "rgba(61,255,200,0.55)";
        ctx.fillRect(54, H - 18, ((W - 108) * s.nitro) / 100, 6);
      }

      ctx.restore();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  function nudge(dir: -1 | 1) {
    if (!startedRef.current) {
      startRun();
      return;
    }
    if (!aliveRef.current) {
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

              <div className="pointer-events-none absolute inset-x-3 top-5 flex justify-between gap-2 px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg">
                <span className="border border-line/70 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  {score}
                </span>
                <span className="border border-accent/40 bg-bg/70 px-2 py-1 text-accent backdrop-blur-sm">
                  {combo > 0 ? `${combo}x near · x${Math.min(8, 1 + Math.floor(combo / 2))}` : "combo"}
                </span>
                <span className="border border-line/70 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  Best {best}
                </span>
              </div>

              {!started && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="border border-accent/50 bg-bg/85 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Dodge. Boost. Style.
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                      A D lanes · hold Space nitro
                      <br />
                      Near-misses build combo · grab orbs
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Space to launch
                    </p>
                  </div>
                </div>
              )}

              {!alive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="border border-line bg-bg/90 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Wrecked
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {score} pts · R / Space retry
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 border-t border-line p-3 sm:hidden">
              <button
                type="button"
                onClick={() => nudge(-1)}
                className="border border-line py-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                ←
              </button>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  state.current.nitroOn = true;
                }}
                onPointerUp={() => {
                  state.current.nitroOn = false;
                }}
                onPointerLeave={() => {
                  state.current.nitroOn = false;
                }}
                className="border border-accent bg-accent/10 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent"
              >
                Nitro
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!startedRef.current) startRun();
                  else if (!aliveRef.current) resetRun();
                }}
                className="border border-line py-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                {!started ? "Go" : !alive ? "Retry" : "·"}
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                className="border border-line py-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
