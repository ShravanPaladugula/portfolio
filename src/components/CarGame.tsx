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
  wide?: boolean; // covers 2 lanes starting at `lane`
};

type Pickup = {
  lane: number;
  y: number;
  kind: "orb" | "shield" | "nitro" | "slow";
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

function rankFor(score: number) {
  if (score >= 8000) return "LEGEND";
  if (score >= 4500) return "ACE";
  if (score >= 2200) return "HOTLAP";
  if (score >= 900) return "TUNER";
  if (score >= 300) return "ROOKIE";
  return "PIT";
}

function freshState() {
  return {
    lane: 1,
    targetLane: 1,
    y: H - 120,
    speed: 3.5,
    distance: 0,
    score: 0,
    combo: 0,
    mult: 1,
    maxCombo: 0,
    nearMisses: 0,
    orbs: 0,
    obstacles: [] as Obstacle[],
    pickups: [] as Pickup[],
    particles: [] as Particle[],
    floaters: [] as Floater[],
    spawn: 0.55,
    pickupSpawn: 1.2,
    roadOffset: 0,
    crash: false,
    shake: 0,
    flash: 0,
    trail: [] as { x: number; y: number; w: number }[],
    nitro: 45,
    nitroOn: false,
    shield: 0,
    invuln: 0,
    slowmo: 0,
    fever: 0,
    pulse: 0,
    drift: 0,
    time: 0,
  };
}

export function CarGame({ open, onClose }: CarGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [rank, setRank] = useState("PIT");
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
    setRank("PIT");
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
    setRank("PIT");
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
        const next = Math.max(0, state.current.targetLane - 1);
        if (next !== state.current.targetLane) state.current.drift = 1;
        state.current.targetLane = next;
      }
      if (k === "arrowright" || k === "d") {
        const next = Math.min(LANES - 1, state.current.targetLane + 1);
        if (next !== state.current.targetLane) state.current.drift = -1;
        state.current.targetLane = next;
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
    let last = performance.now();

    const laneX = (lane: number) => {
      const pad = 48;
      const usable = W - pad * 2;
      const laneW = usable / LANES;
      return pad + laneW * lane + laneW / 2;
    };

    const burst = (x: number, y: number, color: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 4;
        state.current.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.35 + Math.random() * 0.55,
          color,
          size: 2 + Math.random() * 3.5,
        });
      }
    };

    const float = (x: number, y: number, text: string, color: string) => {
      state.current.floaters.push({ x, y, text, life: 1.1, color });
    };

    const vibe = (ms = 12) => {
      try {
        navigator.vibrate?.(ms);
      } catch {
        /* ignore */
      }
    };

    const drawCar = (
      x: number,
      y: number,
      color: string,
      opts?: { player?: boolean; shield?: boolean; wide?: boolean; tilt?: number },
    ) => {
      const player = !!opts?.player;
      const shield = !!opts?.shield;
      const wide = !!opts?.wide;
      const tilt = opts?.tilt ?? 0;
      const bw = wide ? 58 : 30;
      const bh = wide ? 58 : 52;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);

      if (player && shield) {
        ctx.strokeStyle = "rgba(61,255,200,0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, wide ? 8 : 7);
      ctx.fill();

      ctx.fillStyle = player ? "#0A0B0D" : "rgba(10,11,13,0.6)";
      ctx.beginPath();
      ctx.roundRect(-bw * 0.36, -bh * 0.28, bw * 0.72, bh * 0.32, 4);
      ctx.fill();

      if (player) {
        ctx.fillStyle = "#E8FFF7";
        ctx.fillRect(-bw * 0.36, -bh / 2, bw * 0.26, 4);
        ctx.fillRect(bw * 0.1, -bh / 2, bw * 0.26, 4);
        ctx.fillStyle = "#3DFFC8";
        ctx.fillRect(-bw * 0.32, bh / 2 - 6, bw * 0.22, 4);
        ctx.fillRect(bw * 0.1, bh / 2 - 6, bw * 0.22, 4);
      } else {
        ctx.fillStyle = "#FF6B6B";
        ctx.fillRect(-bw * 0.3, bh / 2 - 6, bw * 0.2, 4);
        ctx.fillRect(bw * 0.1, bh / 2 - 6, bw * 0.2, 4);
      }
      ctx.restore();
    };

    const tick = (now: number) => {
      const rawDt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const s = state.current;
      const timeScale = s.slowmo > 0 ? 0.55 : 1;
      const dt = rawDt * timeScale;

      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue("--ink").trim() || "#0A0B0D";
      const porcelain = styles.getPropertyValue("--porcelain").trim() || "#E9EBEF";
      const accent = styles.getPropertyValue("--accent").trim() || "#3DFFC8";
      const isLight = document.documentElement.classList.contains("light");
      const road = isLight ? "#1a1d22" : "#121418";
      const asphaltLine = isLight ? "#3a4048" : "#2a2e36";

      s.time += dt;
      s.pulse = (s.pulse + dt * (s.fever > 0 ? 8 : 3)) % (Math.PI * 2);
      s.lane += (s.targetLane - s.lane) * (1 - Math.pow(0.001, dt * 60));
      s.shake = Math.max(0, s.shake - dt * 3.2);
      s.flash = Math.max(0, s.flash - dt * 2.4);
      s.invuln = Math.max(0, s.invuln - dt);
      s.shield = Math.max(0, s.shield - dt);
      s.slowmo = Math.max(0, s.slowmo - dt);
      s.fever = Math.max(0, s.fever - dt);
      s.drift *= Math.pow(0.02, dt);

      const fevering = s.fever > 0 || s.combo >= 6;
      if (s.combo >= 6 && s.fever <= 0.2) s.fever = Math.max(s.fever, 0.01);
      if (s.combo >= 6) s.fever = Math.max(s.fever, 2.5);

      const boosting =
        s.nitroOn && s.nitro > 0 && startedRef.current && !s.crash;
      if (boosting) s.nitro = Math.max(0, s.nitro - 28 * dt);
      else if (startedRef.current && !s.crash) {
        s.nitro = Math.min(100, s.nitro + (fevering ? 14 : 7) * dt);
      }

      if (startedRef.current && !s.crash) {
        const boostMul = boosting ? 1.75 : 1;
        const feverMul = fevering ? 1.15 : 1;
        s.speed += 0.55 * dt;
        const move = s.speed * boostMul * feverMul;
        s.distance += move * 28 * dt;
        s.mult = Math.min(10, 1 + Math.floor(s.combo / 2) + (fevering ? 2 : 0));
        s.score += move * 22 * dt * s.mult;
        s.roadOffset = (s.roadOffset + move * 130 * dt) % 40;

        s.trail.unshift({
          x: laneX(s.lane),
          y: s.y + 24,
          w: 10 + Math.abs(s.drift) * 10,
        });
        if (s.trail.length > 16) s.trail.pop();

        if (boosting || fevering) {
          for (let i = 0; i < (fevering ? 2 : 1); i++) {
            s.particles.push({
              x: laneX(s.lane) + (Math.random() - 0.5) * 14,
              y: s.y + 28,
              vx: (Math.random() - 0.5) * 1.4,
              vy: 2 + Math.random() * 3,
              life: 0.3 + Math.random() * 0.25,
              color: fevering && Math.random() > 0.5 ? "#F1F2F4" : accent,
              size: 2 + Math.random() * 2.5,
            });
          }
        }

        s.spawn -= dt * boostMul;
        if (s.spawn <= 0) {
          const colors = ["#8B909A", "#5C6370", "#C8CCD4", "#2AE0B0", "#F07167"];
          const roll = Math.random();
          if (roll > 0.88 && s.distance > 200) {
            s.obstacles.push({
              lane: Math.random() > 0.5 ? 0 : 1,
              y: -70,
              color: "#4A5160",
              wide: true,
            });
          } else if (roll > 0.68) {
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
          s.spawn = Math.max(0.32, 0.85 - s.speed * 0.01) + Math.random() * 0.28;
        }

        s.pickupSpawn -= dt;
        if (s.pickupSpawn <= 0) {
          const roll = Math.random();
          const kind: Pickup["kind"] =
            roll > 0.9
              ? "slow"
              : roll > 0.78
                ? "shield"
                : roll > 0.62
                  ? "nitro"
                  : "orb";
          s.pickups.push({
            lane: Math.floor(Math.random() * LANES),
            y: -40,
            kind,
          });
          s.pickupSpawn = 0.9 + Math.random() * 0.8;
        }

        const fall = move * 95 * dt;
        for (const o of s.obstacles) o.y += fall;
        for (const p of s.pickups) p.y += fall;

        const px = laneX(s.lane);
        const py = s.y;

        for (const o of s.obstacles) {
          if (o.scored) continue;
          if (o.y > py + 32) {
            o.scored = true;
            const lanesHit = o.wide ? [o.lane, o.lane + 1] : [o.lane];
            const adjacent = lanesHit.some((l) => Math.abs(l - s.lane) === 1);
            const same = lanesHit.includes(Math.round(s.lane));
            if (adjacent && !same) {
              s.combo += 1;
              s.maxCombo = Math.max(s.maxCombo, s.combo);
              s.nearMisses += 1;
              s.mult = Math.min(10, 1 + Math.floor(s.combo / 2) + (fevering ? 2 : 0));
              const pts = 30 * s.mult;
              s.score += pts;
              s.flash = 0.5;
              float(px, py - 42, `NEAR +${pts}`, accent);
              burst(laneX(o.lane), o.y, accent, 10);
              vibe(8);
              setCombo(s.combo);
              if (s.combo === 6) {
                float(px, py - 64, "FEVER", "#F1F2F4");
                burst(px, py, "#F1F2F4", 20);
              }
            } else {
              s.combo = Math.max(0, s.combo - 1);
              setCombo(s.combo);
            }
          }
        }

        const hitsObstacle = (o: Obstacle) => {
          if (o.wide) {
            const left = laneX(o.lane) - 20;
            const right = laneX(o.lane + 1) + 20;
            return px > left && px < right && Math.abs(o.y - py) < 50;
          }
          return Math.abs(laneX(o.lane) - px) < 28 && Math.abs(o.y - py) < 48;
        };

        for (const o of s.obstacles) {
          if (!hitsObstacle(o)) continue;
          if (s.invuln > 0 || s.shield > 0) {
            s.shield = 0;
            s.invuln = 0.85;
            o.y = H + 120;
            burst(px, py, accent, 20);
            float(px, py - 30, "BLOCKED", accent);
            s.shake = 0.55;
            vibe(18);
          } else {
            s.crash = true;
            s.shake = 1.5;
            burst(px, py, "#F07167", 30);
            burst(px, py, accent, 14);
            const finalScore = Math.floor(s.score);
            setScore(finalScore);
            setRank(rankFor(finalScore));
            setCombo(0);
            aliveRef.current = false;
            setAlive(false);
            setBest((b) => {
              const next = Math.max(b, finalScore);
              window.localStorage.setItem("sp-garage-best", String(next));
              return next;
            });
            vibe(40);
          }
          break;
        }

        s.pickups = s.pickups.filter((p) => {
          const x = laneX(p.lane);
          if (Math.abs(x - px) < 26 && Math.abs(p.y - py) < 36) {
            if (p.kind === "orb") {
              const pts = 50 * s.mult;
              s.score += pts;
              s.orbs += 1;
              float(px, py - 36, `+${pts}`, accent);
              burst(x, p.y, accent, 12);
            } else if (p.kind === "shield") {
              s.shield = 5;
              float(px, py - 36, "SHIELD", accent);
              burst(x, p.y, accent, 14);
            } else if (p.kind === "nitro") {
              s.nitro = Math.min(100, s.nitro + 50);
              float(px, py - 36, "NITRO", "#F1F2F4");
              burst(x, p.y, "#F1F2F4", 14);
            } else {
              s.slowmo = 3.2;
              float(px, py - 36, "SLOW-MO", accent);
              burst(x, p.y, accent, 16);
            }
            vibe(10);
            return false;
          }
          return p.y < H + 60;
        });

        s.obstacles = s.obstacles.filter((o) => o.y < H + 90);
        if (!s.crash) {
          setScore(Math.floor(s.score));
          setRank(rankFor(s.score));
        }
      }

      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.8;
      }
      s.particles = s.particles.filter((p) => p.life > 0);
      for (const f of s.floaters) {
        f.y -= 42 * dt;
        f.life -= dt * 1.1;
      }
      s.floaters = s.floaters.filter((f) => f.life > 0);

      // draw
      ctx.save();
      if (s.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * s.shake * 12,
          (Math.random() - 0.5) * s.shake * 12,
        );
      }

      ctx.clearRect(-20, -20, W + 40, H + 40);
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = isLight ? porcelain : "#0d0f12";
      ctx.fillRect(0, 0, 40, H);
      ctx.fillRect(W - 40, 0, 40, H);

      // fever backdrop pulse
      if (fevering && startedRef.current) {
        ctx.fillStyle = `rgba(61,255,200,${0.04 + Math.sin(s.pulse) * 0.03})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (startedRef.current && !s.crash) {
        ctx.strokeStyle = fevering
          ? "rgba(61,255,200,0.16)"
          : "rgba(61,255,200,0.08)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          const x = 50 + ((i * 37 + s.roadOffset * 3) % (W - 100));
          const y = ((i * 73 + s.roadOffset * 8) % H) - 20;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 16 + s.speed);
          ctx.stroke();
        }
      }

      ctx.fillStyle = road;
      ctx.fillRect(40, 0, W - 80, H);

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

      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.35 + (boosting ? 0.3 : 0) + Math.sin(s.pulse) * 0.08;
      ctx.lineWidth = fevering ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(44, 0);
      ctx.lineTo(44, H);
      ctx.moveTo(W - 44, 0);
      ctx.lineTo(W - 44, H);
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (startedRef.current) {
        for (let i = 0; i < s.trail.length; i++) {
          const t = s.trail[i];
          ctx.globalAlpha = 0.18 * (1 - i / s.trail.length);
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.roundRect(t.x - t.w / 2, t.y - 4, t.w, 10, 3);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      for (const p of s.pickups) {
        const x = laneX(p.lane);
        ctx.save();
        ctx.translate(x, p.y + Math.sin(s.time * 6 + p.lane) * 2);
        if (p.kind === "orb") {
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 14;
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
        } else if (p.kind === "nitro") {
          ctx.fillStyle = "#F1F2F4";
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(8, 8);
          ctx.lineTo(-8, 8);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0.2, Math.PI * 1.6);
          ctx.stroke();
          ctx.fillStyle = accent;
          ctx.font = "700 9px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText("S", 0, 3);
        }
        ctx.restore();
      }

      for (const o of s.obstacles) {
        const x = o.wide ? (laneX(o.lane) + laneX(o.lane + 1)) / 2 : laneX(o.lane);
        drawCar(x, o.y, o.color, { wide: o.wide });
      }

      drawCar(laneX(s.lane), s.y, accent, {
        player: true,
        shield: s.shield > 0,
        tilt: s.drift * 0.18,
      });

      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      for (const f of s.floaters) {
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.fillStyle = f.color;
        ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;

      if (s.flash > 0) {
        ctx.fillStyle = `rgba(61,255,200,${s.flash * 0.14})`;
        ctx.fillRect(0, 0, W, H);
      }
      if (s.slowmo > 0) {
        ctx.fillStyle = "rgba(10,11,13,0.12)";
        ctx.fillRect(0, 0, W, H);
      }
      if (s.crash) {
        ctx.fillStyle = "rgba(10,11,13,0.5)";
        ctx.fillRect(0, 0, W, H);
      }

      if (startedRef.current) {
        ctx.fillStyle = "rgba(241,242,244,0.12)";
        ctx.fillRect(54, H - 18, W - 108, 6);
        ctx.fillStyle = boosting ? accent : "rgba(61,255,200,0.55)";
        ctx.fillRect(54, H - 18, ((W - 108) * s.nitro) / 100, 6);

        if (fevering) {
          ctx.fillStyle = accent;
          ctx.font = "700 10px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.globalAlpha = 0.7 + Math.sin(s.pulse) * 0.3;
          ctx.fillText("FEVER", W / 2, 28);
          ctx.globalAlpha = 1;
        }
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
    const next = Math.max(0, Math.min(LANES - 1, state.current.targetLane + dir));
    if (next !== state.current.targetLane) state.current.drift = dir < 0 ? 1 : -1;
    state.current.targetLane = next;
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
                  Secret · Garage · Arcade
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
                  {combo > 0
                    ? `${combo} near · x${Math.min(10, 1 + Math.floor(combo / 2))}`
                    : rank}
                </span>
                <span className="border border-line/70 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  Best {best}
                </span>
              </div>

              {!started && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="border border-accent/50 bg-bg/85 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Style on the night lane.
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                      Near-misses → fever · Space nitro
                      <br />
                      Grab slow-mo / shield · dodge trucks
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
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                      {rank}
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
