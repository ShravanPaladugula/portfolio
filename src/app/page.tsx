import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Path } from "@/components/Path";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ColorSeam } from "@/components/SectionLabel";
import { SignalMarquee } from "@/components/SignalMarquee";
import { Systems } from "@/components/Systems";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="relative z-10 flex-1">
        <Hero />
        <SignalMarquee />
        <About />
        <ColorSeam />
        <Work />
        <ColorSeam />
        <Systems />
        <ColorSeam />
        <Path />
        <ColorSeam />
        <Awards />
        <ColorSeam />
        <Gallery />
        <ColorSeam />
        <Education />
        <ColorSeam />
        <Contact />
      </main>
    </>
  );
}
