import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Heart,
  X,
  ChevronDown,
  SearchX,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { ARTISTS, CATEGORIES, type Artist, type CategoryId } from "../data/artists";
import { ArtistCard } from "./ArtistCard";
import { Reveal } from "./Reveal";
import { CITIES } from "./Hero";
import { cn } from "../utils/cn";

type Sort = "relevancia" | "nota" | "avaliacoes" | "preco";

const SORTS: { id: Sort; label: string }[] = [
  { id: "relevancia", label: "Relevância" },
  { id: "nota", label: "Melhor avaliados" },
  { id: "avaliacoes", label: "Mais avaliações" },
  { id: "preco", label: "Menor diária" },
];

const PAGE = 9;

interface Props {
  query: string;
  setQuery: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  category: CategoryId;
  setCategory: (id: CategoryId) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onOpen: (artist: Artist) => void;
}

export function ArtistsSection({
  query,
  setQuery,
  city,
  setCity,
  category,
  setCategory,
  favorites,
  toggleFavorite,
  onOpen,
}: Props) {
  const [sort, setSort] = useState<Sort>("relevancia");
  const [onlyFav, setOnlyFav] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  /* -------- Filtragem + ordenação -------- */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ARTISTS.filter((a) => {
      if (category !== "todos" && a.category !== category) return false;
      if (city !== "Todas as cidades" && !a.city.startsWith(city)) return false;
      if (onlyFav && !favorites.includes(a.id)) return false;
      if (!q) return true;
      return [a.name, a.role, a.city, a.bio, ...a.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const sorted = [...list];
    if (sort === "nota") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "avaliacoes") sorted.sort((a, b) => b.reviews - a.reviews);
    if (sort === "preco") sorted.sort((a, b) => a.price - b.price);
    return sorted;
  }, [query, city, category, onlyFav, favorites, sort]);

  /* Volta ao início da lista sempre que um filtro muda */
  useEffect(() => setLimit(PAGE), [query, city, category, onlyFav, sort]);

  const hasFilters =
    query.trim() !== "" ||
    city !== "Todas as cidades" ||
    category !== "todos" ||
    onlyFav;

  const clear = () => {
    setQuery("");
    setCity("Todas as cidades");
    setCategory("todos");
    setOnlyFav(false);
    setSort("relevancia");
  };

  const visible = results.slice(0, limit);

  return (
    <section id="artistas" className="relative scroll-mt-24 py-24 sm:py-28">
      {/* glow de fundo */}
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--c-accent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <span className="eyebrow text-accent">02 — Vitrine</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
              Artistas prontos para
              <br />
              começar o seu projeto
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-sm">
            <p className="text-ink-soft">
              Perfis com portfólio revisado, avaliações de contratos reais e
              agenda atualizada. Filtre até achar exatamente o que o briefing
              pede.
            </p>
          </Reveal>
        </div>

        {/* ---------------- Barra de filtros ---------------- */}
        <Reveal delay={80}>
          <div className="mt-12 rounded-[26px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* busca */}
              <label className="flex flex-1 items-center gap-3 rounded-2xl border border-line bg-bg-soft px-4 py-3 transition-colors focus-within:border-accent">
                <Search className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={2.2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome, especialidade ou cidade…"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink-soft/70"
                  aria-label="Buscar artistas"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar busca"
                    className="text-ink-soft transition-colors hover:text-accent"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>

              {/* cidade */}
              <label className="relative flex items-center gap-2 rounded-2xl border border-line bg-bg-soft px-4 py-3 lg:w-52">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-soft" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Cidade"
                  className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium outline-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-soft" />
              </label>

              {/* ordenação */}
              <label className="relative flex items-center gap-2 rounded-2xl border border-line bg-bg-soft px-4 py-3 lg:w-52">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  Ord.
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  aria-label="Ordenar resultados"
                  className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-soft" />
              </label>

              {/* favoritos */}
              <button
                type="button"
                onClick={() => setOnlyFav((v) => !v)}
                aria-pressed={onlyFav}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5",
                  onlyFav
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-bg-soft text-ink-soft hover:text-accent"
                )}
              >
                <Heart className={cn("h-4 w-4", onlyFav && "fill-current")} />
                Salvos
                <span className="font-mono text-xs opacity-70">
                  {favorites.length}
                </span>
              </button>
            </div>

            {/* pills de categoria */}
            <div className="no-bar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <Pill
                active={category === "todos"}
                onClick={() => setCategory("todos")}
                label="Todos"
                count={ARTISTS.length}
              />
              {CATEGORIES.map((c) => (
                <Pill
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                  label={c.short}
                  count={ARTISTS.filter((a) => a.category === c.id).length}
                />
              ))}

              <div className="ml-auto hidden shrink-0 items-center gap-3 pl-4 sm:flex">
                <span className="font-mono text-xs text-ink-soft">
                  {results.length} resultado{results.length === 1 ? "" : "s"}
                </span>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clear}
                    className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    <X className="h-3.5 w-3.5" /> Limpar
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Grid ---------------- */}
        {visible.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((artist, i) => (
              <Reveal key={artist.id} delay={(i % 3) * 90} y={34}>
                <ArtistCard
                  artist={artist}
                  index={i}
                  favorite={favorites.includes(artist.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpen={onOpen}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface/50 px-6 py-20 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
              <SearchX className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold">
              Nenhum artista com esses filtros
            </h3>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              Tente remover a cidade ou buscar por outra especialidade — nossa
              base cresce toda semana.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-6 flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-transform duration-300 hover:scale-105"
            >
              Limpar filtros <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Carregar mais */}
        {results.length > limit && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + 6)}
              className="group flex items-center gap-3 rounded-full border border-line bg-surface px-7 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-lift)]"
            >
              <Loader2 className="h-4 w-4 text-accent transition-transform duration-700 group-hover:rotate-180" />
              Ver mais {Math.min(6, results.length - limit)} artistas
              <span className="font-mono text-xs text-ink-soft">
                ({limit}/{results.length})
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Pill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
        active
          ? "border-accent bg-accent text-accent-ink shadow-[0_10px_24px_-14px_var(--c-glow)]"
          : "border-line bg-bg-soft text-ink-soft hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
      )}
    >
      {label}
      <span
        className={cn(
          "font-mono text-[11px]",
          active ? "opacity-75" : "text-ink-soft/70"
        )}
      >
        {count}
      </span>
    </button>
  );
}
