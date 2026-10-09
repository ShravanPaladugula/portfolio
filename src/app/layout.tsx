import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "First-year computer engineering student at UC San Diego. Embedded systems, firmware, power, and the hardware layer of team builds — 15 hackathons, 9 winning projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-phi-eight-tl7b5ws2l1.vercel.app"),
  title: `${profile.name} — Computer Engineering`,
  description,
  openGraph: {
    title: `${profile.name} — Computer Engineering`,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Computer Engineering`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
