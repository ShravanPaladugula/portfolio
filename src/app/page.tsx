import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Path } from "@/components/Path";
import { ColorSeam } from "@/components/SectionLabel";
import { accents } from "@/components/ColorMark";
import { Systems } from "@/components/Systems";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10 flex-1">
        <Hero />
        <ColorSeam color={accents.about} />
        <About />
        <ColorSeam color={accents.work} />
        <Work />
        <ColorSeam color={accents.systems} />
        <Systems />
        <ColorSeam color={accents.path} />
        <Path />
        <ColorSeam color={accents.awards} />
        <Awards />
        <ColorSeam color={accents.lab} />
        <Gallery />
        <ColorSeam color={accents.education} />
        <Education />
        <ColorSeam color={accents.contact} />
        <Contact />
      </main>
    </>
  );
}
