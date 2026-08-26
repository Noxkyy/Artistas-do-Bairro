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
import { useTheme } from "./hooks/useTheme";
import { scrollToId } from "./components/Navbar";
import type { Artist, CategoryId } from "./data/artists";

const FAV_KEY = "prisma-favorites";

export default function App() {
  const { theme, toggle } = useTheme();

  /* --------------------------- Estado global de busca --------------------------- */
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Todas as cidades");
  const [category, setCategory] = useState<CategoryId>("todos");

  /* ------------------------------- Favoritos ---------------------------------- */
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(FAV_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  /* --------------------------------- Modal ------------------------------------- */
  const [selected, setSelected] = useState<Artist | null>(null);

  /* Busca dispara a rolagem até a vitrine de artistas */
  const runSearch = () => scrollToId("#artistas");

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero
          query={query}
          setQuery={setQuery}
          city={city}
          setCity={setCity}
          onSearch={runSearch}
        />
        <Stats />
        <Categories
          active={category}
          onSelect={(id) => setCategory(id)}
        />
        <ArtistsSection
          query={query}
          setQuery={setQuery}
          city={city}
          setCity={setCity}
          category={category}
          setCategory={setCategory}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onOpen={setSelected}
        />
        <Process />
        <Testimonials />
        <JoinArtists />
      </main>

      <Footer />

      <FloatingControls theme={theme} onToggle={toggle} />

      <ArtistModal
        artist={selected}
        favorite={selected ? favorites.includes(selected.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

/** Barra de progresso de leitura no topo da página. */
function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
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

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-accent shadow-[0_0_12px_var(--c-glow)] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
