export const profile = {
  name: "Shravan Paladugula",
  initials: "SP",
  role: "Computer Engineering · UC San Diego",
  headline: "I build systems that leave the screen.",
  intro:
    "First-year computer engineering student at UC San Diego. I work at the point where software becomes a physical system — firmware, power, enclosures, and the pipelines that turn an idea into something you can hold.",
  location: "La Jolla, CA",
  email: "shravan.paladugula@gmail.com",
  phone: "(925) 493-9513",
  availability: "Open to software and embedded / firmware internships.",

  links: {
    github: "https://github.com/ShravanPaladugula",
    linkedin: "https://www.linkedin.com/in/shravan-paladugula",
    devpost: "https://devpost.com/ShravanPaladugula",
    resume: "/resume.pdf",
  },

  /* Verifiable against the public Devpost profile. */
  stats: [
    { value: "15", label: "Hackathons entered" },
    { value: "9", label: "Winning projects" },
    { value: "500+", label: "MountainHacks members" },
  ],

  about: [
    "Most of what I build is a team effort, and almost all of it has a physical layer. On a four-person hackathon team I am usually the one on hardware — the power system, the enclosure, the firmware, and the serial glue that makes the software side actually reach a motor or a screen.",
    "That split is deliberate. Recognition accuracy, model choice, and backend design are rarely what sinks a demo. What sinks it is a brownout mid-capture, a servo that dispenses two pills instead of one, or a camera framed six inches too low. I like owning that layer.",
    "Outside coursework I run MountainHacks, and I spent three years operating a production 3D printing studio that paid for itself.",
  ],

  toolbox: {
    "Embedded & hardware": [
      "ESP32",
      "Arduino",
      "Raspberry Pi",
      "Orange Pi",
      "KiCAD",
      "Fusion 360",
      "3D printing",
      "UART / I2C / SPI",
      "PWM / PID",
      "LiPo power",
    ],
    "Languages & systems": [
      "C / C++",
      "Python",
      "TypeScript",
      "MATLAB",
      "Embedded Linux",
      "OpenSCAD",
      "Sensor fusion",
    ],
    "Software & tooling": [
      "React",
      "Next.js",
      "FastAPI",
      "Node.js",
      "Supabase",
      "OpenCV",
      "Three.js",
      "Git / GitHub Actions",
      "Vercel",
    ],
  },

  education: [
    {
      school: "University of California, San Diego",
      detail: "B.S. Computer Engineering · Jacobs School of Engineering",
      when: "2026 – 2030 (expected)",
      place: "La Jolla, CA",
    },
    {
      school: "Mountain House High School",
      detail:
        "GPA 4.64 · Ranked 6 of 615 · Distinguished Award (top 2%) · AP Scholar with Distinction",
      when: "Graduated 2026",
      place: "Mountain House, CA",
    },
  ],
} as const;
