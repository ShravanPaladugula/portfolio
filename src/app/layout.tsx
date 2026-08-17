import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shravanpaladugula.vercel.app"),
  title: "Shravan Paladugula | Computer Engineering",
  description:
    "Incoming Computer Engineering student at UC San Diego. Embedded systems, firmware, edge AI, and fabrication pipelines.",
  openGraph: {
    title: "Shravan Paladugula | Computer Engineering",
    description:
      "I build systems that leave the screen — embedded, edge AI, and full-stack fabrication.",
    type: "website",
  },
};

const themeInit = `
(() => {
  try {
    const t = localStorage.getItem('sp-theme');
    if (t === 'day') document.documentElement.classList.add('light');
    document.documentElement.dataset.theme = t === 'day' ? 'day' : 'night';
  } catch {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${space.variable} ${jetbrains.variable} h-full antialiased`}
      data-theme="night"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="grain relative z-0 min-h-full flex flex-col bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}
