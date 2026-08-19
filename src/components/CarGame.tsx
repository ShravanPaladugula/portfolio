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

const TRACK_HALF = 3.2;
const WALL = TRACK_HALF + 0.15;

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable)
  );
}

function sideAt(curve: THREE.CatmullRomCurve3, t: number) {
  const tangent = curve.getTangentAt(t).normalize();
  const side = new THREE.Vector3()
    .crossVectors(new THREE.Vector3(0, 1, 0), tangent)
    .normalize();
  if (side.lengthSq() < 0.01) {
    side.set(1, 0, 0);
  }
  return { tangent, side };
}

function placeOnTrack(
  curve: THREE.CatmullRomCurve3,
  t: number,
  lateral: number,
  outPos: THREE.Vector3,
  outQuat: THREE.Quaternion,
) {
  const p = curve.getPointAt(((t % 1) + 1) % 1);
  const { tangent, side } = sideAt(curve, ((t % 1) + 1) % 1);
  outPos.copy(p).addScaledVector(side, lateral);
  outPos.y += 0.02;

  const forward = outPos.clone().add(tangent);
  const m = new THREE.Matrix4();
  m.lookAt(outPos, forward, new THREE.Vector3(0, 1, 0));
  outQuat.setFromRotationMatrix(m);
}

/** Flat ribbon road (not a tube — tubes clip the camera). */
function buildRoadGeometry(curve: THREE.CatmullRomCurve3, halfW: number, segments = 220) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const { side } = sideAt(curve, t);
    const y = p.y + 0.02;
    const l = p.clone().addScaledVector(side, -halfW);
    const r = p.clone().addScaledVector(side, halfW);
    positions.push(l.x, y, l.z, r.x, y, r.z);
    normals.push(0, 1, 0, 0, 1, 0);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

function buildCenterLine(curve: THREE.CatmullRomCurve3, halfW: number, segments = 220) {
  const positions: number[] = [];
  const indices: number[] = [];
  const w = 0.08;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const { side } = sideAt(curve, t);
    const y = p.y + 0.04;
    const l = p.clone().addScaledVector(side, -w);
    const r = p.clone().addScaledVector(side, w);
    positions.push(l.x, y, l.z, r.x, y, r.z);
  }
  for (let i = 0; i < segments; i++) {
    // dashed: skip every other block of segments
    if (Math.floor(i / 4) % 2 === 1) continue;
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

function makeLowPolyCar(color: string, accent = "#3DFFC8") {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color, flatShading: true });
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

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.38, 2.0), bodyMat);
  body.position.y = 0.42;
  g.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.34, 0.95), darkMat);
  cabin.position.set(0, 0.72, -0.08);
  g.add(cabin);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.24, 0.06), glassMat);
  glass.position.set(0, 0.74, 0.4);
  g.add(glass);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.07, 0.24),
    accentMat,
  );
  spoiler.position.set(0, 0.66, -0.95);
  g.add(spoiler);

  for (const [x, z] of [
    [-0.45, 0.65],
    [0.45, 0.65],
    [-0.45, -0.7],
    [0.45, -0.7],
  ] as const) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.2, 8),
      darkMat,
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.26, z);
    g.add(wheel);
  }

  return g;
}

function buildTrackCurve() {
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(24, 0, 10),
    new THREE.Vector3(40, 0, 28),
    new THREE.Vector3(36, 0, 50),
    new THREE.Vector3(14, 0, 58),
    new THREE.Vector3(-8, 0, 50),
    new THREE.Vector3(-20, 0, 34),
    new THREE.Vector3(-36, 0, 42),
    new THREE.Vector3(-48, 0, 24),
    new THREE.Vector3(-40, 0, 4),
    new THREE.Vector3(-22, 0, -12),
    new THREE.Vector3(-2, 0, -20),
    new THREE.Vector3(14, 0, -14),
    new THREE.Vector3(20, 0, -4),
  ];
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.4);
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
        ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", " "].includes(
          k,
        )
      ) {
        e.preventDefault();
      }

      if (!api.current.started && (k === " " || k === "enter" || k === "w")) {
        api.current.started = true;
        setStarted(true);
      }
      if (!api.current.alive && (k === "r" || k === " " || k === "enter")) {
        api.current.reset();
        return;
      }

      api.current.keys.add(k);
      if (e.code === "ArrowLeft") api.current.keys.add("arrowleft");
      if (e.code === "ArrowRight") api.current.keys.add("arrowright");
      if (e.code === "ArrowUp") api.current.keys.add("arrowup");
      if (e.code === "ArrowDown") api.current.keys.add("arrowdown");
      if (e.code === "Space") api.current.keys.add(" ");
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      api.current.keys.delete(k);
      if (e.code === "ArrowLeft") api.current.keys.delete("arrowleft");
      if (e.code === "ArrowRight") api.current.keys.delete("arrowright");
      if (e.code === "ArrowUp") api.current.keys.delete("arrowup");
      if (e.code === "ArrowDown") api.current.keys.delete("arrowdown");
      if (e.code === "Space") api.current.keys.delete(" ");
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
    const width = Math.max(320, mount.clientWidth || 420);
    const height = Math.min(520, Math.max(400, Math.floor(width * 1.15)));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0b0d);
    renderer.shadowMap.enabled = true;
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0b0d, 35, 110);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 250);
    camera.position.set(0, 12, 18);

    scene.add(new THREE.HemisphereLight(0xc5ceda, 0x1a1d22, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 1.15);
    sun.position.set(25, 40, 15);
    sun.castShadow = true;
    scene.add(sun);

    const curve = buildTrackCurve();

    const roadGeo = buildRoadGeometry(curve, TRACK_HALF, 240);
    const road = new THREE.Mesh(
      roadGeo,
      new THREE.MeshLambertMaterial({
        color: 0x2a2e36,
        flatShading: true,
        side: THREE.DoubleSide,
      }),
    );
    road.receiveShadow = true;
    scene.add(road);

    const lineGeo = buildCenterLine(curve, TRACK_HALF, 240);
    const centerLine = new THREE.Mesh(
      lineGeo,
      new THREE.MeshLambertMaterial({
        color: 0x3dffc8,
        flatShading: true,
        side: THREE.DoubleSide,
      }),
    );
    scene.add(centerLine);

    const barrierMat = new THREE.MeshLambertMaterial({
      color: 0x232830,
      flatShading: true,
    });
    const stripeMat = new THREE.MeshLambertMaterial({
      color: 0x3dffc8,
      flatShading: true,
    });

    for (const sideSign of [-1, 1] as const) {
      for (let i = 0; i < 72; i++) {
        const t = i / 72;
        const p = curve.getPointAt(t);
        const { tangent, side } = sideAt(curve, t);
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.55, 1.4),
          i % 2 === 0 ? barrierMat : stripeMat,
        );
        post.position.copy(p).addScaledVector(side, sideSign * (TRACK_HALF + 0.2));
        post.position.y = 0.28;
        const look = p.clone().add(tangent);
        post.lookAt(look.x, post.position.y, look.z);
        scene.add(post);
      }
    }

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(95, 12),
      new THREE.MeshLambertMaterial({ color: 0x101318, flatShading: true }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
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

    for (let i = 0; i < 48; i++) {
      const t = (i + 0.3) / 48;
      const p = curve.getPointAt(t);
      const { side } = sideAt(curve, t);
      const dist = TRACK_HALF + 4 + (i % 5) * 2.2;
      const sideSign = i % 2 === 0 ? 1 : -1;
      const pos = p.clone().addScaledVector(side, sideSign * dist);

      if (i % 3 !== 0) {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.2, 0.8, 5),
          trunkMat,
        );
        trunk.position.copy(pos);
        trunk.position.y = 0.4;
        scene.add(trunk);
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.0, 5), treeMat);
        leaves.position.copy(pos);
        leaves.position.y = 1.55;
        scene.add(leaves);
      } else {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.55 + (i % 4) * 0.12, 0),
          rockMat,
        );
        rock.position.copy(pos);
        rock.position.y = 0.35;
        rock.rotation.set(i * 0.2, i * 0.3, 0);
        scene.add(rock);
      }
    }

    const mtMat = new THREE.MeshLambertMaterial({
      color: 0x151920,
      flatShading: true,
    });
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const mt = new THREE.Mesh(
        new THREE.ConeGeometry(9 + (i % 3) * 3, 16 + (i % 4) * 3, 5),
        mtMat,
      );
      mt.position.set(Math.cos(ang) * 72, 5, Math.sin(ang) * 72);
      scene.add(mt);
    }

    const player = makeLowPolyCar("#3DFFC8", "#F1F2F4");
    scene.add(player);

    const ai: AiCar[] = [];
    const aiColors = ["#8B909A", "#E9EBEF", "#5C6370", "#2AE0B0", "#F07167"];
    for (let i = 0; i < 5; i++) {
      const mesh = makeLowPolyCar(aiColors[i % aiColors.length]);
      scene.add(mesh);
      ai.push({
        mesh,
        t: 0.15 + i * 0.14,
        speed: 0.008 + i * 0.0012,
        lateral: ((i % 3) - 1) * 1.4,
      });
    }

    const tmpPos = new THREE.Vector3();
    const tmpQuat = new THREE.Quaternion();
    const camTarget = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    let t = 0.0;
    let lateral = 0;
    let speed = 0;
    let distance = 0;
    let lapCount = 0;
    let lastT = 0;
    let protect = 0;
    let wreckSpin = 0;

    const MAX_SPEED = 0.042;
    const ACCEL = 0.00042;
    const BRAKE = 0.0011;
    const DRAG = 0.00018;
    const STEER = 0.07;

    function hardReset() {
      t = 0;
      lateral = 0;
      speed = 0;
      distance = 0;
      lapCount = 0;
      lastT = 0;
      protect = 2.2;
      wreckSpin = 0;
      api.current.alive = true;
      api.current.started = true;
      player.rotation.set(0, 0, 0);
      setAlive(true);
      setStarted(true);
      setScore(0);
      setLaps(0);
      setHudSpeed(0);
      for (let i = 0; i < ai.length; i++) {
        ai[i].t = 0.18 + i * 0.14;
        ai[i].lateral = ((i % 3) - 1) * 1.3;
        ai[i].speed = 0.008 + i * 0.0012;
      }
    }
    api.current.reset = hardReset;

    function crash(finalScore: number) {
      if (!api.current.alive || protect > 0) return;
      api.current.alive = false;
      speed = 0;
      setAlive(false);
      setScore(finalScore);
      setBest((b) => {
        const next = Math.max(b, finalScore);
        window.localStorage.setItem("sp-garage-3d-best", String(next));
        return next;
      });
    }

    // Start with protection so opening / first frames never false-wreck
    protect = 999;
    placeOnTrack(curve, t, lateral, tmpPos, tmpQuat);
    player.position.copy(tmpPos);
    player.quaternion.copy(tmpQuat);
    const { tangent: t0 } = sideAt(curve, t);
    camera.position.copy(tmpPos).addScaledVector(t0, -10).add(new THREE.Vector3(0, 5, 0));
    camera.lookAt(tmpPos.clone().addScaledVector(t0, 8));

    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const keys = api.current.keys;

      if (api.current.started && protect > 100) {
        // first start: convert infinite protect to real spawn shield
        protect = 2.2;
      }

      if (api.current.started && api.current.alive) {
        protect = Math.max(0, protect - dt);

        const throttle = keys.has("w") || keys.has("arrowup");
        const braking = keys.has("s") || keys.has("arrowdown");
        const left = keys.has("a") || keys.has("arrowleft");
        const right = keys.has("d") || keys.has("arrowright");

        // Space is start only — not permanent throttle (was causing weirdness)
        if (throttle) speed = Math.min(MAX_SPEED, speed + ACCEL);
        if (braking) speed = Math.max(0, speed - BRAKE);
        speed = Math.max(0, speed - DRAG);

        const steer = (left ? 1 : 0) + (right ? -1 : 0);
        lateral += steer * STEER * (0.55 + speed * 14);

        // Hot corner push-out
        const { tangent } = sideAt(curve, t);
        const nextTan = sideAt(curve, (t + 0.012) % 1).tangent;
        const curvature = 1 - Math.max(0, tangent.dot(nextTan));
        if (speed > 0.024 && curvature > 0.012) {
          lateral += Math.sign(lateral || steer || 1) * curvature * speed * 40;
          speed *= 0.994;
        }

        // Soft keep-in near edges (still punishing)
        if (Math.abs(lateral) > TRACK_HALF * 0.92) {
          lateral += -Math.sign(lateral) * 0.035;
          speed *= 0.97;
        }

        t = (t + speed) % 1;
        distance += speed * 140;

        if (lastT > 0.8 && t < 0.2) {
          lapCount += 1;
          setLaps(lapCount);
          for (const car of ai) car.speed = Math.min(0.028, car.speed * 1.05);
        }
        lastT = t;

        if (Math.abs(lateral) > WALL) {
          crash(Math.floor(distance + lapCount * 500));
        }

        for (const car of ai) {
          car.t = (car.t + car.speed) % 1;
          car.lateral += Math.sin(performance.now() * 0.001 + car.t * 20) * 0.008;
          car.lateral = THREE.MathUtils.clamp(
            car.lateral,
            -TRACK_HALF + 0.5,
            TRACK_HALF - 0.5,
          );
          placeOnTrack(curve, car.t, car.lateral, tmpPos, tmpQuat);
          car.mesh.position.copy(tmpPos);
          car.mesh.quaternion.copy(tmpQuat);

          let wrap = Math.abs(car.t - t);
          wrap = Math.min(wrap, 1 - wrap);
          if (
            protect <= 0 &&
            wrap < 0.012 &&
            Math.abs(car.lateral - lateral) < 1.05
          ) {
            crash(Math.floor(distance + lapCount * 500));
          }
        }

        setScore(Math.floor(distance + lapCount * 500));
        setHudSpeed(Math.floor(speed * 4800));
      } else if (!api.current.started) {
        // Gentle preview orbit along track
        t = (t + dt * 0.03) % 1;
        for (const car of ai) {
          car.t = (car.t + car.speed * 0.35) % 1;
          placeOnTrack(curve, car.t, car.lateral, tmpPos, tmpQuat);
          car.mesh.position.copy(tmpPos);
          car.mesh.quaternion.copy(tmpQuat);
        }
      } else if (!api.current.alive) {
        wreckSpin += dt;
      }

      placeOnTrack(curve, t, lateral, tmpPos, tmpQuat);
      player.position.copy(tmpPos);
      if (api.current.alive) {
        player.quaternion.copy(tmpQuat);
      } else {
        player.quaternion.copy(tmpQuat);
        player.rotateZ(Math.sin(wreckSpin * 8) * 0.35);
      }

      const { tangent } = sideAt(curve, t);
      camTarget
        .copy(tmpPos)
        .addScaledVector(tangent, -9.5)
        .add(new THREE.Vector3(0, 4.8, 0));
      lookTarget
        .copy(tmpPos)
        .addScaledVector(tangent, 7)
        .add(new THREE.Vector3(0, 0.8, 0));

      camera.position.lerp(camTarget, api.current.started ? 0.14 : 0.06);
      camera.lookAt(lookTarget);

      // Keep camera from dipping into ground
      if (camera.position.y < tmpPos.y + 2.5) {
        camera.position.y = tmpPos.y + 2.5;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onResize = () => {
      if (!mountRef.current) return;
      const w = Math.max(320, mountRef.current.clientWidth || width);
      const h = Math.min(520, Math.max(400, Math.floor(w * 1.15)));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      roadGeo.dispose();
      lineGeo.dispose();
      renderer.dispose();
      mount.innerHTML = "";
    };
  }, [open]);

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
              <div ref={mountRef} className="mx-auto w-full touch-none" />

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
                      W gas · S brake · A D steer
                      <br />
                      Brake before corners or kiss the wall
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Space / W to start
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
                  ["s", "Brake"],
                  ["a", "←"],
                  ["d", "→"],
                  ["w", !started ? "Start" : !alive ? "Retry" : "Gas"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key + label}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (label === "Start") {
                      api.current.started = true;
                      setStarted(true);
                      return;
                    }
                    if (label === "Retry") {
                      api.current.reset();
                      return;
                    }
                    api.current.keys.add(key);
                  }}
                  onPointerUp={() => api.current.keys.delete(key)}
                  onPointerLeave={() => api.current.keys.delete(key)}
                  onPointerCancel={() => api.current.keys.delete(key)}
                  className={`border py-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    key === "w"
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
