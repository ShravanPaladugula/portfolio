import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Toolbox } from "@/components/Toolbox";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
        <Toolbox />
        <Education />
        <Contact />
      </main>
    </>
  );
}
