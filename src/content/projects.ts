export type Project = {
  id: string;
  name: string;
  award?: string;
  summary: string;
  built: string;
  problem: string;
  improved: string;
  tools: string[];
  year: string;
  image: string;
  imageCaption: string;
};

export const projects: Project[] = [
  {
    id: "conjr",
    name: "CONJR",
    award: "WizardHacks 2026 — You.com Best Project",
    year: "2026",
    image: "/projects/conjr.jpg",
    imageCaption: "Voice → CAD → slice → print pipeline",
    summary:
      "A voice-to-3D fabrication system that turns a spoken part request into a model that can be reviewed, sliced, and printed.",
    built:
      "End-to-end pipeline: voice → live web search for engineering specs → LLM writes parametric OpenSCAD → STL → CuraEngine slice → gcode via Moonraker. Structural integrity agent gates every design (OK / WARN / FAIL) before print. Orange Pi 5 Pro platform with Three.js viewer, SSE streaming, SQLite model library, Morph-Forge agent pipeline, and 8 production APIs with GitHub Actions CI/CD.",
    problem:
      "A spoken request can be too vague to produce printable geometry, and unsafe or malformed designs must never reach the machine during a live demo.",
    improved:
      "Added live web research before CAD generation, a structural integrity gate before gcode delivery, and a two-system embedded + web architecture so preview, validation, and print stay coordinated.",
    tools: [
      "Python",
      "FastAPI",
      "OpenSCAD",
      "CuraEngine",
      "Three.js",
      "React",
      "TypeScript",
      "Supabase",
      "Llama-3.3-70B",
      "Orange Pi 5 Pro",
      "Moonraker",
      "SSE",
      "GitHub Actions",
    ],
  },
  {
    id: "chehra",
    name: "CHEHRA",
    award: "Edge AI attendance · institutional pilot",
    year: "2024–Present",
    image: "/projects/chehra.jpg",
    imageCaption: "Custom PCB + edge recognition chassis",
    summary:
      "An edge facial recognition attendance system built for real classrooms — custom PCB, chassis, and recognition at the edge.",
    built:
      "Custom PCB and 3D-printed chassis for an Orange Pi edge compute unit. Real-time facial recognition on-device with React Native check-in flow and logs for classroom review. Architecting district-scale deployment.",
    problem:
      "Recognition accuracy alone is not enough. Camera angle, enclosure fit, lighting, startup behavior, and log reliability all decide whether the system works daily.",
    improved:
      "Across 10+ hardware and software iterations, refined component placement and full workflow testing. Reached 96% identification accuracy across 250+ live check-ins in 2 pilot classrooms; district-wide architecture targeting 5,000+ daily users is in progress with active institutional testing.",
    tools: [
      "Python",
      "OpenCV",
      "KiCAD",
      "Orange Pi",
      "React Native",
      "3D printing",
    ],
  },
  {
    id: "rosettamd",
    name: "Rosetta MD",
    award: "CruzHacks 2026 — Best Hardware Hack",
    year: "2026",
    image: "/projects/rosettamd.jpg",
    imageCaption: "Handheld clinical translation device",
    summary:
      "A handheld device that turns complex clinical speech into plain-language explanations for patients.",
    built:
      "Full embedded stack in 36 hours: LiPo battery management with charging and over-discharge protection, MEMS microphone capture, OLED device UI, buzzer feedback, FastAPI jargon-stripping backend, and real-time React patient interface. Won Best Hardware Hack among 225+ statewide competitors.",
    problem:
      "Clinical language is hard for patients to act on, and a usable device needs reliable power, audio, display, and AI pipeline coordination under hackathon constraints.",
    improved:
      "Designed the full hardware stack including power management and device UI so capture → translate → display worked as one handheld system rather than a loose breadboard demo.",
    tools: [
      "ESP32",
      "MEMS mic",
      "LiPo",
      "FastAPI",
      "React",
      "OLED",
      "buzzer",
    ],
  },
  {
    id: "pillwatch",
    name: "PillWatch",
    award: "CruzHacks 2025 — Best Hardware Hack",
    year: "2025",
    image: "/projects/pillwatch.jpg",
    imageCaption: "Pinwheel dispenser + facial auth",
    summary:
      "An IoT smart pill dispenser with ML facial authentication and a custom dispensing mechanism.",
    built:
      "Full hardware and software stack in 36 hours: Raspberry Pi + ESP32, ML facial authentication, custom 3D-printed pinwheel dispenser, dual-servo actuation, caregiver web app, and real-time microcontroller scheduling. Won Best Hardware Hack among 225+ statewide competitors.",
    problem:
      "Medication adherence for seniors needs secure identity, reliable mechanical dispense, and caregiver visibility — all inside a portable enclosure.",
    improved:
      "Combined facial auth with a purpose-built pinwheel mechanism and scheduling firmware so authentication, actuation, and caregiver feedback stayed synchronized.",
    tools: [
      "Raspberry Pi",
      "ESP32",
      "Python",
      "servos",
      "3D printing",
      "ML facial auth",
    ],
  },
  {
    id: "bwsi-sar",
    name: "MIT BWSI — UAS-SAR",
    award: "MIT Beaver Works Summer Institute",
    year: "2025",
    image: "/projects/bwsi-sar.jpg",
    imageCaption: "Custom airframe + SAR payload",
    summary:
      "A custom UAS platform with synthetic-aperture radar for subsurface object detection.",
    built:
      "Custom drone airframe and electronics with SAR payload, PID flight controls, full SAR backprojection for subsurface detection, and a real-time data visualization GUI — 160+ engineering hours in MIT BWSI’s elite UAV radar program.",
    problem:
      "Useful SAR imagery requires the airframe, flight control, radar processing, and visualization to work as one integrated system — not isolated demos.",
    improved:
      "Engineered airframe, electronics, PID, backprojection, and GUI together so flight data could become interpretable subsurface imagery in one pipeline.",
    tools: ["MATLAB", "Python", "C++", "PID", "SAR backprojection"],
  },
  {
    id: "powerchair",
    name: "Powerchair Rebuild",
    year: "2024",
    image: "/projects/powerchair.jpg",
    imageCaption: "Full electrical rebuild from bare frame",
    summary:
      "A full embedded reconstruction of an electric powerchair — frame stripped, controls rebuilt from scratch.",
    built:
      "Stripped a full-size electric powerchair to bare frame. Replaced motors, motor drivers, and wiring harnesses. Custom ESP32 firmware for RF command parsing, real-time PWM motor control, and hardware safety cutoffs.",
    problem:
      "The original electrical and control system was unusable; a safe rebuild needed new motors, drivers, harnesses, and firmware with hard safety cutoffs.",
    improved:
      "Rebuilt the complete electrical path and wrote firmware that kept RF command parsing, PWM control, and hardware cutoffs as explicit safety layers.",
    tools: ["ESP32", "embedded C", "motor drivers", "RF", "PWM"],
  },
  {
    id: "gestar",
    name: "GestAR",
    award: "CruzHacks 2023 Finalist",
    year: "2023",
    image: "/projects/gestar.jpg",
    imageCaption: "ASL gesture control + AR interface",
    summary:
      "An ASL smart-home control system using ML gesture recognition and an AR interface.",
    built:
      "ML gesture recognition pipeline for ASL control of smart-home appliances (volume, lights, temperature) with Leap Motion + Arduino hardware layer and AR interface.",
    problem:
      "Controlling appliances through ASL needs low-latency classification that maps cleanly onto real device actions.",
    improved:
      "Combined Leap Motion sensing, Arduino actuation, and a full gesture classification pipeline so ASL interpretation could drive appliances in real time.",
    tools: ["Python", "OpenCV", "MediaPipe", "Arduino", "AR", "Leap Motion"],
  },
];
