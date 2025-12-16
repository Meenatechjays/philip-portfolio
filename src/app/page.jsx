import Header from '../components/header/Header';
import About from '../components/about/About';
import Timeline from '../components/timeLine/Timeline';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <About />
      <Timeline />
    </main>
  );
}


