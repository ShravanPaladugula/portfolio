"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

type CarGameProps = {
  open: boolean;
  onClose: () => void;
};

type AiCar = {
  mesh: THREE.Group;
  t: number;
  speed: number;
  lateral: number;
};

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable)
  );
}

function makeLowPolyCar(color: string, accent = "#3DFFC8") {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
  });
  const darkMat = new THREE.MeshLambertMaterial({
    color: "#111318",
    flatShading: true,
  });
  const glassMat = new THREE.MeshLambertMaterial({
    color: "#8ec8ff",
    flatShading: true,
  });
  const accentMat = new THREE.MeshLambertMaterial({
    color: accent,
    flatShading: true,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 2.2), bodyMat);
  body.position.y = 0.35;
  g.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.38, 1.05), darkMat);
  cabin.position.set(0, 0.68, -0.1);
  g.add(cabin);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.28, 0.08), glassMat);
  glass.position.set(0, 0.72, 0.42);
  g.add(glass);

  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 0.28), accentMat);
  spoiler.position.set(0, 0.62, -1.05);
  g.add(spoiler);

  for (const [x, z] of [
    [-0.48, 0.7],
    [0.48, 0.7],
    [-0.48, -0.75],
    [0.48, -0.75],
  ] as const) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8),
      darkMat,
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.28, z);
    g.add(wheel);
  }

  g.castShadow = true;
  return g;
}

function buildTrackCurve() {
  // Tight technical circuit — sharp esses + hairpin
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(28, 0, 8),
    new THREE.Vector3(48, 0.4, 26),
    new THREE.Vector3(42, 0.2, 52),
    new THREE.Vector3(18, 0, 62),
    new THREE.Vector3(-6, 0, 54),
    new THREE.Vector3(-22, 0.3, 40),
    new THREE.Vector3(-38, 0.1, 48),
    new THREE.Vector3(-52, 0, 30),
    new THREE.Vector3(-46, 0, 6),
    new THREE.Vector3(-28, 0.2, -10),
    new THREE.Vector3(-8, 0, -22),
    new THREE.Vector3(10, 0, -18),
    new THREE.Vector3(22, 0, -6),
  ];
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.35);
}

function placeOnTrack(
  curve: THREE.CatmullRomCurve3,
  t: number,
  lateral: number,
  outPos: THREE.Vector3,
  outQuat: THREE.Quaternion,
) {
  const p = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
  outPos.copy(p).addScaledVector(side, lateral).addScaledVector(up, 0.05);
  const look = new THREE.Vector3().copy(p).add(tangent);
  const m = new THREE.Matrix4().lookAt(outPos, look, up);
  outQuat.setFromRotationMatrix(m);
}

export function CarGame({ open, onClose }: CarGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [laps, setLaps] = useState(0);
  const [alive, setAlive] = useState(true);
  const [started, setStarted] = useState(false);
  const [hudSpeed, setHudSpeed] = useState(0);

  const api = useRef({
    started: false,
    alive: true,
    reset: () => {},
    keys: new Set<string>(),
  });

  useEffect(() => {
    if (!open) return;
    const stored = Number(window.localStorage.getItem("sp-garage-3d-best") || 0);
    setBest(Number.isFinite(stored) ? stored : 0);
    setScore(0);
    setLaps(0);
    setAlive(true);
    setStarted(false);
    setHudSpeed(0);
    api.current.started = false;
    api.current.alive = true;
    api.current.keys.clear();
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (isTypingTarget(e.target)) return;
      const k = e.key.toLowerCase();
      if (
        [
          "arrowleft",
          "arrowright",
          "arrowup",
          "arrowdown",
          "a",
          "d",
          "w",
          "s",
          " ",
        ].includes(k)
      ) {
        e.preventDefault();
      }

      if (!api.current.started && (k === " " || k === "enter" || k === "w")) {
        api.current.started = true;
        setStarted(true);
        return;
      }
      if (!api.current.alive && (k === "r" || k === " " || k === "enter")) {
        api.current.reset();
        return;
      }
      api.current.keys.add(k);
      if (e.key === "ArrowLeft") api.current.keys.add("arrowleft");
      if (e.key === "ArrowRight") api.current.keys.add("arrowright");
      if (e.key === "ArrowUp") api.current.keys.add("arrowup");
      if (e.key === "ArrowDown") api.current.keys.add("arrowdown");
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      api.current.keys.delete(k);
      api.current.keys.delete(e.key);
      if (e.key === "ArrowLeft") api.current.keys.delete("arrowleft");
      if (e.key === "ArrowRight") api.current.keys.delete("arrowright");
      if (e.key === "ArrowUp") api.current.keys.delete("arrowup");
      if (e.key === "ArrowDown") api.current.keys.delete("arrowdown");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth || 420;
    const height = Math.min(560, Math.max(420, Math.floor(width * 1.25)));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x0a0b0d);
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0b0d, 28, 95);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);

    const hemi = new THREE.HemisphereLight(0xb8c4d4, 0x1a1d22, 0.85);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(30, 50, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    const mintGlow = new THREE.PointLight(0x3dffc8, 0.55, 40);
    mintGlow.position.set(0, 8, 0);
    scene.add(mintGlow);

    const curve = buildTrackCurve();
    const TRACK_HALF = 2.15; // narrow = tough
    const WALL = TRACK_HALF + 0.35;

    // Road ribbon
    const roadGeo = new THREE.TubeGeometry(curve, 280, TRACK_HALF, 6, true);
    const road = new THREE.Mesh(
      roadGeo,
      new THREE.MeshLambertMaterial({ color: 0x1b1e24, flatShading: true }),
    );
    road.receiveShadow = true;
    scene.add(road);

    // Center line dashes via thin tube
    const lineGeo = new THREE.TubeGeometry(curve, 280, 0.05, 4, true);
    const centerLine = new THREE.Mesh(
      lineGeo,
      new THREE.MeshLambertMaterial({ color: 0x3dffc8, flatShading: true }),
    );
    centerLine.position.y = 0.03;
    scene.add(centerLine);

    // Barriers
    const barrierMat = new THREE.MeshLambertMaterial({
      color: 0x2a2f38,
      flatShading: true,
    });
    const stripeMat = new THREE.MeshLambertMaterial({
      color: 0x3dffc8,
      flatShading: true,
    });
    for (const side of [-1, 1]) {
      for (let i = 0; i < 90; i++) {
        const t = i / 90;
        const p = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const sideways = new THREE.Vector3()
          .crossVectors(new THREE.Vector3(0, 1, 0), tangent)
          .normalize();
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.7, 1.1),
          i % 2 === 0 ? barrierMat : stripeMat,
        );
        post.position.copy(p).addScaledVector(sideways, side * WALL);
        post.position.y += 0.35;
        post.lookAt(p.clone().add(tangent));
        post.castShadow = true;
        scene.add(post);
      }
    }

    // Low-poly scenery
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(90, 10),
      new THREE.MeshLambertMaterial({ color: 0x12151a, flatShading: true }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    const treeMat = new THREE.MeshLambertMaterial({
      color: 0x1f6b55,
      flatShading: true,
    });
    const trunkMat = new THREE.MeshLambertMaterial({
      color: 0x3a2a1e,
      flatShading: true,
    });
    const rockMat = new THREE.MeshLambertMaterial({
      color: 0x4a5160,
      flatShading: true,
    });

    for (let i = 0; i < 55; i++) {
      const t = Math.random();
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const sideways = new THREE.Vector3()
        .crossVectors(new THREE.Vector3(0, 1, 0), tangent)
        .normalize();
      const dist = WALL + 3 + Math.random() * 14;
      const side = Math.random() > 0.5 ? 1 : -1;
      const pos = p.clone().addScaledVector(sideways, side * dist);

      if (Math.random() > 0.35) {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.22, 0.9, 5),
          trunkMat,
        );
        trunk.position.copy(pos);
        trunk.position.y = 0.45;
        scene.add(trunk);
        const leaves = new THREE.Mesh(
          new THREE.ConeGeometry(1.1 + Math.random() * 0.6, 2.2, 5),
          treeMat,
        );
        leaves.position.copy(pos);
        leaves.position.y = 1.7;
        leaves.castShadow = true;
        scene.add(leaves);
      } else {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.6 + Math.random() * 0.8, 0),
          rockMat,
        );
        rock.position.copy(pos);
        rock.position.y = 0.4;
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        scene.add(rock);
      }
    }

    // Mountains
    const mtMat = new THREE.MeshLambertMaterial({
      color: 0x171b22,
      flatShading: true,
    });
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const mt = new THREE.Mesh(
        new THREE.ConeGeometry(8 + Math.random() * 10, 14 + Math.random() * 16, 5),
        mtMat,
      );
      mt.position.set(Math.cos(ang) * 70, 4, Math.sin(ang) * 70);
      scene.add(mt);
    }

    const player = makeLowPolyCar("#3DFFC8", "#F1F2F4");
    scene.add(player);

    const ai: AiCar[] = [];
    const aiColors = ["#8B909A", "#E9EBEF", "#5C6370", "#2AE0B0", "#F07167"];
    for (let i = 0; i < 7; i++) {
      const mesh = makeLowPolyCar(aiColors[i % aiColors.length], "#3DFFC8");
      scene.add(mesh);
      ai.push({
        mesh,
        t: (i + 1) * 0.11,
        speed: 0.012 + Math.random() * 0.01,
        lateral: (Math.random() - 0.5) * 2.2,
      });
    }

    const tmpPos = new THREE.Vector3();
    const tmpQuat = new THREE.Quaternion();
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();

    let t = 0.02;
    let lateral = 0;
    let speed = 0;
    let distance = 0;
    let lapCount = 0;
    let lastT = t;
    let crashCooldown = 0;

    const MAX_SPEED = 0.055; // track units / frame-ish
    const ACCEL = 0.00055;
    const BRAKE = 0.0014;
    const DRAG = 0.00022;
    const STEER = 0.085;
    const GRIP = 0.72; // low grip = tough

    function hardReset() {
      t = 0.02;
      lateral = 0;
      speed = 0;
      distance = 0;
      lapCount = 0;
      lastT = t;
      crashCooldown = 0;
      api.current.alive = true;
      api.current.started = true;
      setAlive(true);
      setStarted(true);
      setScore(0);
      setLaps(0);
      setHudSpeed(0);
      for (let i = 0; i < ai.length; i++) {
        ai[i].t = (i + 1) * 0.11;
        ai[i].lateral = (Math.random() - 0.5) * 2.0;
        ai[i].speed = 0.014 + Math.random() * 0.012;
      }
    }
    api.current.reset = hardReset;

    function crash(finalScore: number) {
      if (!api.current.alive) return;
      api.current.alive = false;
      setAlive(false);
      setScore(finalScore);
      setBest((b) => {
        const next = Math.max(b, finalScore);
        window.localStorage.setItem("sp-garage-3d-best", String(next));
        return next;
      });
    }

    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const keys = api.current.keys;

      if (api.current.started && api.current.alive) {
        const throttle =
          keys.has("w") || keys.has("arrowup") || keys.has(" ");
        const braking = keys.has("s") || keys.has("arrowdown");
        const left = keys.has("a") || keys.has("arrowleft");
        const right = keys.has("d") || keys.has("arrowright");

        if (throttle) speed = Math.min(MAX_SPEED, speed + ACCEL);
        if (braking) speed = Math.max(0, speed - BRAKE);
        speed = Math.max(0, speed - DRAG);

        // Curvature penalty — take corners too hot and you slide wide
        const tangent = curve.getTangentAt(t).normalize();
        const nextT = (t + 0.01) % 1;
        const nextTan = curve.getTangentAt(nextT).normalize();
        const curvature = 1 - Math.max(0, tangent.dot(nextTan));
        const overspeed = speed > 0.028 && curvature > 0.015;
        const steerInput = (left ? 1 : 0) + (right ? -1 : 0);
        const steerScale = STEER * (0.45 + speed * 18);
        lateral += steerInput * steerScale * GRIP;

        // Understeer / push wide when hot into bends
        if (overspeed) {
          lateral += (lateral >= 0 ? 1 : -1) * curvature * speed * 55;
          speed *= 0.992;
        }

        // Snap-back near walls is weak on purpose
        if (Math.abs(lateral) > TRACK_HALF * 0.55) {
          lateral += -Math.sign(lateral) * 0.01;
        }

        t = (t + speed) % 1;
        distance += speed * 120;

        if (t < lastT) {
          lapCount += 1;
          setLaps(lapCount);
          // each lap AI gets meaner
          for (const car of ai) car.speed *= 1.06;
        }
        lastT = t;

        if (Math.abs(lateral) > WALL) {
          crash(Math.floor(distance + lapCount * 500));
        }

        // AI
        for (const car of ai) {
          car.t = (car.t + car.speed * (0.85 + Math.sin(car.t * 40) * 0.08)) % 1;
          car.lateral += Math.sin(car.t * 30 + car.speed * 100) * 0.01;
          car.lateral = THREE.MathUtils.clamp(car.lateral, -TRACK_HALF + 0.3, TRACK_HALF - 0.3);
          placeOnTrack(curve, car.t, car.lateral, tmpPos, tmpQuat);
          car.mesh.position.copy(tmpPos);
          car.mesh.quaternion.copy(tmpQuat);

          // collision with player
          const dtTrack = Math.abs(car.t - t);
          const wrap = Math.min(dtTrack, 1 - dtTrack);
          if (wrap < 0.018 && Math.abs(car.lateral - lateral) < 0.95) {
            if (crashCooldown <= 0) {
              crash(Math.floor(distance + lapCount * 500));
              crashCooldown = 1;
            }
          }
        }
        if (crashCooldown > 0) crashCooldown -= dt;

        setScore(Math.floor(distance + lapCount * 500));
        setHudSpeed(Math.floor(speed * 4200));
      } else {
        // idle camera drift when not started
        if (!api.current.started) {
          t = (t + 0.0008) % 1;
        }
      }

      placeOnTrack(curve, t, lateral, tmpPos, tmpQuat);
      player.position.copy(tmpPos);
      player.quaternion.copy(tmpQuat);
      if (!api.current.alive) {
        player.rotation.z += 0.04;
      }

      const tangent = curve.getTangentAt(t).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      camPos
        .copy(tmpPos)
        .addScaledVector(tangent, -7.5)
        .addScaledVector(up, 3.2);
      camLook.copy(tmpPos).addScaledVector(tangent, 6).addScaledVector(up, 0.6);
      camera.position.lerp(camPos, api.current.started ? 0.12 : 0.04);
      camera.lookAt(camLook);
      mintGlow.position.copy(tmpPos).addScaledVector(up, 3);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || width;
      const h = Math.min(560, Math.max(420, Math.floor(w * 1.25)));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      roadGeo.dispose();
      lineGeo.dispose();
      mount.innerHTML = "";
    };
  }, [open]);

  function mobile(dir: "left" | "right" | "gas" | "brake" | "start") {
    if (dir === "start") {
      if (!api.current.alive) {
        api.current.reset();
        return;
      }
      api.current.started = true;
      setStarted(true);
      return;
    }
    const map = {
      left: "a",
      right: "d",
      gas: "w",
      brake: "s",
    } as const;
    const key = map[dir];
    api.current.keys.add(key);
    window.setTimeout(() => api.current.keys.delete(key), 180);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-bg/85 px-3 backdrop-blur-sm sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Midnight Circuit 3D"
            className="w-full max-w-[460px] overflow-hidden border border-line bg-bg shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Secret · Garage · Hard
                </p>
                <p className="font-display text-lg font-bold tracking-tight">
                  Midnight Circuit 3D
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

            <div className="relative bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))]">
              <div ref={mountRef} className="mx-auto w-full" />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between gap-2 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg">
                <span className="border border-line/80 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  Score {score}
                </span>
                <span className="border border-line/80 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  Lap {laps} · {hudSpeed} u/h
                </span>
                <span className="border border-line/80 bg-bg/70 px-2 py-1 backdrop-blur-sm">
                  Best {best}
                </span>
              </div>

              {!started && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="max-w-sm border border-accent/50 bg-bg/85 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Low-poly. High pain.
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                      W / ↑ gas · S brake · A D steer
                      <br />
                      Brake for corners or the wall owns you
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Space to drop the clutch
                    </p>
                  </div>
                </div>
              )}

              {!alive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="border border-line bg-bg/90 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-xl font-bold tracking-tight">
                      Wrecked
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Score {score} · R to rebuild
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 border-t border-line p-3 sm:hidden">
              {(
                [
                  ["brake", "Brake", "s"],
                  ["left", "←", "a"],
                  ["right", "→", "d"],
                  ["gas", !started ? "Start" : !alive ? "Retry" : "Gas", "w"],
                ] as const
              ).map(([id, label, key]) => (
                <button
                  key={id}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (id === "gas" && (!started || !alive)) {
                      mobile("start");
                      return;
                    }
                    api.current.keys.add(key);
                  }}
                  onPointerUp={() => api.current.keys.delete(key)}
                  onPointerLeave={() => api.current.keys.delete(key)}
                  onPointerCancel={() => api.current.keys.delete(key)}
                  className={`border py-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    id === "gas"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
