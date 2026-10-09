export type Photo = {
  src: string;
  alt: string;
  caption: string;
  /** CAD renders and UI shots sit on white and must not be cropped. */
  fit?: "cover" | "contain";
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  year: string;
  venue?: string;
  award?: string;
  /**
   * Teammates besides Shravan.
   *   [...]      -> named collaborators
   *   []         -> confirmed solo
   *   undefined  -> not yet confirmed; the Team row is omitted rather than
   *                 asserting something unverified.
   */
  team?: string[];
  /** What Shravan specifically owned on this build. */
  role: string;
  summary: string;
  build: string[];
  challenge: string;
  tools: string[];
  /** Real build photography only — never a logo or placeholder. */
  photos: Photo[];
  /** Optional wordmark, rendered small beside the metadata. */
  mark?: { src: string; alt: string };
  links: { label: string; href: string }[];
};

/* ---------------------------------------------------------------- *
 * Featured — full write-up, photos where real ones exist.
 * ---------------------------------------------------------------- */

export const featured: Project[] = [
  {
    id: "conjr",
    name: "CONJR",
    tagline: "Voice to printed part, end to end.",
    year: "2026",
    venue: "WizardHacks 2026",
    award: "You.com Best Project",
    role: "Embedded platform and the agent pipeline from spoken request to gcode.",
    summary:
      "A spoken part request becomes a parametric model, gets checked for structural integrity, and lands on a printer as gcode — without a human opening CAD.",
    build: [
      "Voice capture feeds a live web search for real engineering specs before any geometry is generated.",
      "An LLM writes parametric OpenSCAD, which exports to STL, slices through CuraEngine, and reaches the printer as gcode over Moonraker.",
      "A structural integrity agent grades every design OK / WARN / FAIL and refuses to pass a failing part to the machine.",
      "Runs as two coordinated systems: an Orange Pi 5 Pro at the printer and a web app with a Three.js viewer and SSE streaming for live progress.",
    ],
    challenge:
      "A spoken request is usually too vague to produce printable geometry, and a malformed design reaching the printer during a live demo is unrecoverable. The integrity gate exists so the failure mode is a refused print, not a crashed machine.",
    tools: [
      "Python",
      "FastAPI",
      "OpenSCAD",
      "CuraEngine",
      "Moonraker",
      "Three.js",
      "React",
      "TypeScript",
      "Orange Pi 5 Pro",
      "SSE",
    ],
    photos: [],
    links: [],
  },
  {
    id: "rosettamd",
    name: "Rosetta MD",
    tagline: "A handheld that turns clinical speech into plain language.",
    year: "2026",
    venue: "CruzHacks 2026 · 278 competitors",
    award: "Best Hardware Hack",
    team: ["Dhruv Gupta", "Aayan Singh", "Yash Kathrani"],
    role: "Hardware: power system, enclosure, and the on-device capture and feedback layer.",
    summary:
      "Patients leave appointments holding instructions they did not understand. Rosetta MD captures what was said and hands back a plain-language version they can read on their own device.",
    build: [
      "ESP32 with a digital MEMS microphone capturing audio during the consultation.",
      "Rechargeable 3.7V LiPo with a charging and protection module — over-discharge cutoff and steady delivery under load, so the device is genuinely portable.",
      "OLED carries device state only (scan status, connection, confirmation); medical content never renders on it.",
      "RFID wristbands identify the patient, and a buzzer gives immediate feedback on scan, record, and error.",
      "FastAPI backend strips jargon; a React app is where patients actually read the explanation.",
    ],
    challenge:
      "Four subsystems — power, audio, display, and the AI pipeline — had to stay coordinated inside a handheld shell, built in 36 hours. Most of the risk was power: a brownout mid-capture loses the consultation.",
    tools: ["ESP32", "MEMS mic", "LiPo + protection", "OLED", "RFID", "FastAPI", "React"],
    photos: [
      {
        src: "/projects/rosettamd-device.jpg",
        alt: "Assembled Rosetta MD device, a white 3D-printed enclosure with an OLED display and speaker grille",
        caption: "Assembled unit — printed shell, OLED, speaker grille",
      },
      {
        src: "/projects/rosettamd-screen.jpg",
        alt: "Rosetta MD enclosure opened, OLED reading 'RosettaMD — Tap Card to Begin' above internal wiring",
        caption: "Device UI at idle, waiting for an RFID scan",
      },
      {
        src: "/projects/rosettamd-power.jpg",
        alt: "LiPo battery connected to a charging and protection module over USB",
        caption: "LiPo with charge + over-discharge protection",
      },
      {
        src: "/projects/rosettamd-bands.jpg",
        alt: "Three RFID wristbands in navy, red, and white",
        caption: "RFID wristbands for patient identification",
      },
      {
        src: "/projects/rosettamd-bench.jpg",
        alt: "Breadboard prototype with OLED, RFID module, LiPo cell and wire strippers on a desk",
        caption: "Breadboard stage, before the shell existed",
      },
      {
        src: "/projects/rosettamd-cad.jpg",
        alt: "CAD render of the Rosetta MD enclosure showing screen cutout and speaker grille",
        caption: "Enclosure CAD",
        fit: "contain",
      },
    ],
    links: [{ label: "Devpost", href: "https://devpost.com/software/rosettamd" }],
  },
  {
    id: "chehra",
    name: "CHEHRA",
    tagline: "Face-recognition check-in built for real classrooms.",
    year: "2024 – present",
    venue: "Ongoing",
    team: ["Yash Kathrani", "Aayan Singh", "Dhruv Gupta"],
    role: "Hardware integration — camera mount, sensor-triggered scanning, and the serial layer between recognition and the feedback hardware.",
    summary:
      "Attendance lines are slow and students forget IDs. CHEHRA recognises a student at the door and logs them without anyone touching a roster.",
    build: [
      "Students register through a web form and upload training images for their own face model.",
      "Python and OpenCV handle recognition from a live camera feed; FastAPI manages registration, image storage, and serial comms.",
      "An ultrasonic sensor detects approach and triggers a scan, then pauses so the same student is not logged twice.",
      "Servos adjust camera height to the detected distance — the fix for the single biggest accuracy problem, which was framing, not the model.",
      "An Arduino drives a 16x2 LCD, status LEDs, and a buzzer so the student gets immediate confirmation.",
    ],
    challenge:
      "Recognition accuracy was never the hard part. Camera angle, enclosure fit, lighting, and serial timing between the recognition process and the feedback hardware decided whether it worked on a normal school morning.",
    tools: ["Python", "OpenCV", "FastAPI", "Raspberry Pi", "Arduino", "Servos", "Ultrasonic"],
    photos: [],
    mark: {
      src: "/projects/chehra-mark.png",
      alt: "CHEHRA wordmark and face-scan icon",
    },
    links: [{ label: "Devpost", href: "https://devpost.com/software/chehra" }],
  },
  {
    id: "pillwatch",
    name: "PillWatch",
    tagline: "A dispenser that only opens for the right person.",
    year: "2025",
    venue: "CruzHacks 2025 · 225 competitors",
    award: "Best Hardware Hack",
    team: ["Yash Kathrani", "Dhruv Gupta", "Aayan Singh"],
    role: "Dispensing mechanism and actuation — the pinwheel geometry and dual-servo timing.",
    summary:
      "Medication adherence for seniors needs three things at once: secure identity, a mechanism that reliably releases one dose, and a caregiver who can see what happened.",
    build: [
      "Custom 3D-printed pinwheel mechanism with dual-servo actuation, sized so a single dose clears per rotation.",
      "ML facial authentication gates the dispense — the chassis stays locked for anyone it does not recognise.",
      "Raspberry Pi and ESP32 split the work: recognition on the Pi, real-time scheduling on the microcontroller.",
      "Caregiver web app shows the schedule and whether each dose was actually taken.",
    ],
    challenge:
      "Getting one pill out, not two. Pinwheel tolerance and servo dwell time took most of the iterations — the authentication was working long before the mechanism was.",
    tools: ["Raspberry Pi", "ESP32", "Python", "Servos", "3D printing", "ML facial auth"],
    photos: [
      {
        src: "/projects/pillwatch-cad.jpg",
        alt: "CAD render of the PillWatch dual-hopper dispenser mechanism",
        caption: "Dual-hopper dispenser CAD",
        fit: "contain",
      },
      {
        src: "/projects/pillwatch-app.jpg",
        alt: "Laptop showing the PillWatch caregiver dashboard with patient dose schedule",
        caption: "Caregiver dashboard — per-dose status",
        fit: "contain",
      },
    ],
    links: [{ label: "Devpost", href: "https://devpost.com/software/pillpass-v037sc" }],
  },
  {
    id: "argus",
    name: "Argus",
    tagline: "RFID check-in and live flow for debate judges.",
    year: "2026",
    venue: "JacHacks SF · 193 participants",
    team: ["Aayan Singh", "Yash Kathrani", "Dhruv Gupta"],
    role: "Embedded device — RFID reader, enclosure, and the sync between scanned identity and stored case files.",
    summary:
      "Debate judges track evidence, timing, and disclosures simultaneously while taking notes. Argus moves the paperwork onto a device so the judge can watch the round.",
    build: [
      "Competitors wear RFID wristbands tied to their stored case files.",
      "A portable reader pulls their documents onto the judge's screen the moment they scan in.",
      "On-device screen and a hardware button control speech timing, rounds, and note capture.",
      "The interface syncs competitor data and organises notes against the live speech.",
    ],
    challenge:
      "Microphone pickup across a room was the hardest constraint, followed by syncing stored case files in real time without the judge ever waiting on a load.",
    tools: ["ESP32", "RFID", "OLED", "Python", "React", "TypeScript"],
    photos: [
      {
        src: "/projects/argus-device.jpg",
        alt: "Argus prototype: 3D-printed enclosure with OLED, RFID reader board and a red RFID wristband on a desk",
        caption: "Reader, enclosure, and a tagged wristband",
      },
      {
        src: "/projects/argus-cad.jpg",
        alt: "CAD render of the Argus judging kiosk with screen and RFID scan panel",
        caption: "Kiosk CAD — screen above scan panel",
        fit: "contain",
      },
    ],
    links: [{ label: "Devpost", href: "https://devpost.com/software/argus-aibdc1" }],
  },
  {
    id: "bwsi-sar",
    name: "UAS-SAR",
    tagline: "Synthetic-aperture radar on a custom airframe.",
    year: "2025",
    venue: "MIT Beaver Works Summer Institute",
    role: "Airframe and electronics integration, PID tuning, and the SAR backprojection pipeline.",
    summary:
      "A custom unmanned aerial platform carrying synthetic-aperture radar, built to detect objects below the surface — roughly 160 engineering hours inside MIT BWSI's UAV radar program.",
    build: [
      "Custom airframe and electronics sized around the radar payload.",
      "PID flight control tuned for the stable, repeatable passes SAR imaging depends on.",
      "Full SAR backprojection implementation turning raw returns into subsurface imagery.",
      "Real-time visualisation GUI so a pass could be read as it happened, not after landing.",
    ],
    challenge:
      "SAR only produces usable imagery when the airframe, flight control, signal processing, and visualisation behave as one system. Any one of them drifting makes the output unreadable.",
    tools: ["MATLAB", "Python", "C++", "PID", "SAR backprojection"],
    photos: [],
    links: [],
  },
];

/* ---------------------------------------------------------------- *
 * Other builds — compact entries.
 * ---------------------------------------------------------------- */

export type SmallProject = {
  id: string;
  name: string;
  year: string;
  venue?: string;
  award?: string;
  team?: string[];
  blurb: string;
  tools: string[];
  image?: string;
  href?: string;
};

export const otherBuilds: SmallProject[] = [
  {
    id: "shakti",
    name: "Shakti",
    year: "2026",
    venue: "JacHacks SF",
    award: "Winner",
    team: ["Dhruv Gupta", "Aayan Singh", "Akshith Vattem"],
    blurb:
      "AI coaching platform with separate coach and trainee portals. MoveNet handles joint detection for exercise-specific form analysis; a wearable capture device records the session.",
    tools: ["Python", "MoveNet", "React", "TypeScript", "C++"],
    image: "/projects/shakti-device.jpg",
    href: "https://devpost.com/software/shakti-u6j4qn",
  },
  {
    id: "litigatr",
    name: "Litigatr",
    year: "2025",
    venue: "East Bay Hackers",
    award: "Winner",
    team: ["Yash Kathrani", "Aayan Singh", "Dhruv Gupta"],
    blurb:
      "Face-recognition courtroom check-in kiosk. Recognition runs locally on a Pi 4B rather than in the cloud, with an ESP32 touchscreen and Arduino-driven LED and buzzer feedback in a printed shell.",
    tools: ["Raspberry Pi 4B", "ESP32", "Arduino", "face-api.js", "3D printing"],
    image: "/projects/litigatr-device.jpg",
    href: "https://devpost.com/software/litigatr",
  },
  {
    id: "powerchair",
    name: "Powerchair Rebuild",
    year: "2024",
    blurb:
      "Stripped a full-size electric powerchair to bare frame and rebuilt the entire electrical path — motors, drivers, harnesses — with custom ESP32 firmware for RF command parsing, PWM control, and hardware safety cutoffs.",
    tools: ["ESP32", "Embedded C", "Motor drivers", "RF", "PWM"],
  },
  {
    id: "gestar",
    name: "GestAR",
    year: "2023",
    venue: "CruzHacks 2023 · 296 participants",
    award: "Finalist",
    team: ["Yashmit Bhaverisetti", "Akshat S", "Charlie Huang"],
    blurb:
      "ASL gesture recognition driving smart-home appliances — volume, lights, temperature — through a Leap Motion and Arduino hardware layer with an AR interface.",
    tools: ["Python", "OpenCV", "MediaPipe", "Arduino", "Leap Motion"],
    href: "https://devpost.com/software/gestar",
  },
  {
    id: "rainsaver",
    name: "RainSaver",
    year: "2024",
    venue: "MountainHacks 2024",
    team: ["Arhanth Sarnikar", "Aditya Punati", "Aarav Maddela"],
    blurb:
      "Calculator and guide that shows homeowners what rainwater harvesting would actually save them, based on roof area and local rainfall.",
    tools: ["JavaScript", "Web"],
    image: "/projects/rainsaver.jpg",
    href: "https://devpost.com/software/rainsaver",
  },
  {
    id: "classpass",
    name: "Class Pass",
    year: "2024",
    venue: "LG Hacks",
    award: "Winner",
    team: ["Yash Kathrani", "Dhruv Gupta", "Aayan Singh"],
    blurb: "Student attendance system — the first build that led into CHEHRA.",
    tools: ["Python", "Web"],
    href: "https://devpost.com/software/class-pass",
  },
  {
    id: "mapit",
    name: "MapIt",
    year: "2023",
    venue: "Treasure Hacks 3.5",
    award: "Winner",
    team: ["Khushal Murthy", "Shanmuk Sundaraneedi", "Joshua Cheruku"],
    blurb:
      "Discovery map for things people do not know exist near them — food banks, carpools, local listings.",
    tools: ["JavaScript", "Maps API"],
    href: "https://devpost.com/software/mapit-1xjzhn",
  },
  {
    id: "doorwatch",
    name: "DoorWatch",
    year: "2023",
    venue: "MountainHacks 2023",
    award: "Winner",
    team: ["Aayan Singh", "Daksh Jain", "Mahit Marri"],
    blurb: "Door security sensor that pushes an instant alert the moment a door opens.",
    tools: ["Arduino", "Sensors", "Web"],
    href: "https://devpost.com/software/doorwatch",
  },
  {
    id: "writers-marketplace",
    name: "Writer's Marketplace",
    year: "2023",
    venue: "CruzHacks 2023",
    award: "Winner",
    team: ["Mahit Marri", "Aayan Singh"],
    blurb: "A marketplace where writers publish and trade their work.",
    tools: ["JavaScript", "Web3"],
    href: "https://devpost.com/software/writer-s-marketplace",
  },
];
