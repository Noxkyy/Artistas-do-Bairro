import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Categories } from "./components/Categories";
import { ArtistsSection } from "./components/ArtistsSection";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { JoinArtists } from "./components/JoinArtists";
import { Footer } from "./components/Footer";
import { ArtistModal } from "./components/ArtistModal";
import { FloatingControls } from "./components/FloatingControls";
import { DemoLoginModal } from "./components/DemoLoginModal";
import { LegalModal } from "./components/LegalModal";
import { useTheme } from "./hooks/useTheme";
import { scrollToId } from "./components/Navbar";
import type { Artist, CategoryId } from "./data/artists";

const FAV_KEY = "artistas-do-bairro-favorites";
type LegalKind = "terms" | "privacy" | "cookies";

export default function App() {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Todas as cidades");
  const [category, setCategory] = useState<CategoryId>("todos");
  const [loginOpen, setLoginOpen] = useState(false);
  const [legal, setLegal] = useState<LegalKind | null>(null);
  const [selected, setSelected] = useState<Artist | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(FAV_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage failures on restricted browsers.
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  const runSearch = () => scrollToId("#artistas");

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <ScrollProgress />
      <Navbar onLogin={() => setLoginOpen(true)} />
      <main>
        <Hero query={query} setQuery={setQuery} city={city} setCity={setCity} onSearch={runSearch} />
        <Stats />
        <Categories active={category} onSelect={setCategory} />
        <ArtistsSection query={query} setQuery={setQuery} city={city} setCity={setCity} category={category} setCategory={setCategory} favorites={favorites} toggleFavorite={toggleFavorite} onOpen={setSelected} />
        <Process />
        <Testimonials />
        <JoinArtists />
      </main>
      <Footer onLegal={setLegal} />
      <FloatingControls theme={theme} onToggle={toggle} />
      <ArtistModal artist={selected} favorite={selected ? favorites.includes(selected.id) : false} onToggleFavorite={toggleFavorite} onClose={() => setSelected(null)} />
      <DemoLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      {legal && <LegalModal kind={legal} onClose={() => setLegal(null)} />}
    </div>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        setPct(height > 0 ? (window.scrollY / height) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent" aria-hidden="true"><div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} /></div>;
}
