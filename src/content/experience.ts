export type Entry = {
  id: string;
  role: string;
  org: string;
  when: string;
  place?: string;
  bullets: string[];
};

export const experience: Entry[] = [
  {
    id: "cvp",
    role: "Founder & Engineer",
    org: "Central Valley Printing Company",
    when: "2022 – 2025",
    place: "Mountain House, CA",
    bullets: [
      "Ran a production 3D printing studio to $3,000+ in revenue, managing the full CAD-to-delivery pipeline.",
      "Engineered 20+ custom parts for 50+ students competing nationally in FTC, DECA, TSA, and SkillsUSA.",
      "Built and shipped the storefront — TypeScript, React, Vite, Tailwind, Supabase — with live quoting and automated order tracking across 22 production deployments.",
    ],
  },
];

export const leadership: Entry[] = [
  {
    id: "mountainhacks",
    role: "President & Lead Director",
    org: "MountainHacks · MHHS Hackathon Club",
    when: "2023 – 2026",
    bullets: [
      "Grew the club to 500+ members and directed the Central Valley's largest student hackathon — 200+ attendees, $150K in prizes, GitHub and AoPS as sponsors.",
      "Fundraised $20K for STEM programming.",
    ],
  },
  {
    id: "servinghandz",
    role: "Co-Founder & Trustee",
    org: "ServingHandz · national nonprofit",
    when: "2021 – 2026",
    bullets: [
      "Scaled to 45,000+ meals served, 35 chapters, and 1,600+ volunteers nationwide.",
      "Built the legal and financial infrastructure from scratch.",
    ],
  },
  {
    id: "robotics",
    role: "Lead Programmer",
    org: "VEX Robotics 19359 · FTC 23649",
    when: "2022 – 2026",
    bullets: [
      "Led autonomous routine development, sensor fusion, and pneumatics.",
      "Qualified for California state competition in both programs.",
    ],
  },
];

export const awards: { title: string; detail: string }[] = [
  {
    title: "WizardHacks 2026 — You.com Best Project",
    detail: "CONJR",
  },
  {
    title: "CruzHacks Best Hardware Hack — 2026 & 2025",
    detail: "Rosetta MD and PillWatch, back to back",
  },
  {
    title: "CruzHacks 2023 Finalist",
    detail: "GestAR",
  },
  {
    title: "DECA California State Champion",
    detail: "ICDC top 20 internationally",
  },
  {
    title: "TSA Engineering Design State Champion",
    detail: "National qualifier",
  },
  {
    title: "AP Scholar with Distinction",
    detail: "5s in CS Principles and Psychology",
  },
  {
    title: "Oracle Java Certified",
    detail: "Professional certification",
  },
  {
    title: "President's Volunteer Service Award — Gold",
    detail: "300+ volunteer hours",
  },
];
