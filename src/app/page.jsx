import Image from 'next/image';
import Header from '../components/header/Header';
import About from '../components/about/About';
import Timeline from '../components/timeLine/Timeline';
import Highlights from '../components/pressAndHighlights/Highlights';
import Investors from '../components/investors/Investors';
import AroundTheWorld from '../components/aroundTheWorld/AroundTheWorld';
import Contact from '../components/contact/Contact';
export default function Home() {
  return (
    <main className="relative">
      <div className="relative">
        <About />
        {/* Rectangle SVG Connector - bridges About and Timeline sections */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-30 pointer-events-none translate-y-1/2">
          <Image
            src="/rectangle.svg"
            alt="Section Connector"
            width={1832}
            height={217}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
      <Timeline />
      <AroundTheWorld />
      <Highlights/>
      <Investors/>
      <Contact />
    </main>
  );
}


