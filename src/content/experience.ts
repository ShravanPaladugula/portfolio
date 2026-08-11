export type ExperienceItem = {
  id: string;
  role: string;
  org: string;
  when: string;
  place?: string;
  tools?: string[];
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "cvp",
    role: "Founder & Engineer",
    org: "Central Valley Printing Company",
    when: "2022 – 2025",
    place: "Mountain House, CA",
    tools: [
      "Fusion 360",
      "3D printing",
      "TypeScript",
      "React",
      "Supabase",
      "Vercel",
      "Vite",
      "Tailwind",
    ],
    bullets: [
      "Generated $3,000+ in revenue operating a production 3D printing studio",
      "Engineered 20+ custom parts for 50+ students competing nationally in FTC, DECA, TSA, and SkillsUSA",
      "Managed full CAD-to-delivery pipeline with a zero-defect output standard",
      "Built and deployed full-stack e-commerce (TypeScript, React, Vite, Tailwind, Supabase) with live quotes and automated order tracking",
      "22 production Vercel deployments serving real clients",
    ],
  },
];

export const leadership: ExperienceItem[] = [
  {
    id: "mountainhacks",
    role: "President · Lead Director",
    org: "MHHS Hackathon Club · MountainHacks",
    when: "2023 – 2026",
    bullets: [
      "Built and led a 500+ member engineering organization",
      "Directed Central Valley’s largest student hackathon (200+ attendees, $150K prizes, GitHub & AoPS sponsors)",
      "Fundraised $20K for STEM programs",
      "13 wins across 15 hackathons personally",
    ],
  },
  {
    id: "robotics",
    role: "Lead Programmer",
    org: "VEX Robotics (19359) & FTC (23649)",
    when: "2022 – 2026",
    bullets: [
      "Led autonomous routine development, sensor fusion, and pneumatics systems",
      "Qualified for California state-level competition in both VEX and FTC programs",
    ],
  },
  {
    id: "servinghandz",
    role: "Co-Founder & Trustee",
    org: "ServingHandz · National Nonprofit",
    when: "2021 – 2026",
    bullets: [
      "Scaled to 45,000+ meals, 35 chapters, and 1,600+ volunteers nationwide",
      "Built legal and financial infrastructure from scratch",
    ],
  },
];

export const awards: { title: string; detail: string }[] = [
  {
    title: "WizardHacks 2026 — You.com Best Project",
    detail: "CONJR voice-to-fabrication system",
  },
  {
    title: "CruzHacks Best Hardware Hack 2026 & 2025",
    detail: "Back-to-back · 225+ competitors each",
  },
  {
    title: "CruzHacks 2023 Finalist",
    detail: "GestAR",
  },
  {
    title: "DECA California State Champion & ICDC Top 20",
    detail: "State + international recognition",
  },
  {
    title: "TSA Engineering Design State Champion",
    detail: "National Qualifier",
  },
  {
    title: "MountainHacks 1st Place",
    detail: "Hosted competition win",
  },
  {
    title: "AP Scholar with Distinction",
    detail: "5s in CS & Psych · 4s in Calc, CS A, Stats",
  },
  {
    title: "Oracle Java Certified",
    detail: "Professional certification",
  },
  {
    title: "PVSA Gold",
    detail: "300+ volunteer hours",
  },
  {
    title: "CAASPP Math Perfect Score",
    detail: "Statewide assessment",
  },
];
