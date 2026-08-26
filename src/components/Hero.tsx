import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Search,
  ChevronDown,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ARTISTS } from "../data/artists";
import { Stars } from "./ui/Brand";
import { cn } from "../utils/cn";
import { scrollToId } from "./Navbar";

export const CITIES = [
  "Todas as cidades",
  ...Array.from(new Set(ARTISTS.map((a) => a.city.split(" · ")[0]))).sort(),
];

interface HeroProps {
  query: string;
  setQuery: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  onSearch: () => void;
}

const POPULAR = [
  "Ensaio fotográfico",
  "Clipe musical",
  "Identidade visual",
  "Casamento",
  "Trilha sonora",
];

export function Hero({ query, setQuery, city, setCity, onSearch }: HeroProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  /* Parallax sutil dos cartões flutuantes conforme o mouse */
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const floatCards = [ARTISTS[0], ARTISTS[4], ARTISTS[8]];

  /** Desloca uma camada conforme a posição do mouse (profundidade em px). */
  const layer = (depth: number) => ({
    transform: `translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, 0)`,
    transition: "transform .7s cubic-bezier(.22,1,.36,1)",
  });

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="noise relative overflow-hidden pt-28 pb-10 sm:pt-32 lg:pt-40"
    >
      {/* ---------- Fundo em camadas ---------- */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(80%_60%_at_50%_20%,#000_35%,transparent_100%)]" />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full opacity-70 blur-[90px] dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--c-glow) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--c-accent-2) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Coluna de texto ---------- */}
          <div className="lg:col-span-7 xl:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 py-1.5 pl-1.5 pr-4 backdrop-blur">
              <span className="relative grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-ink">
                <span className="absolute inset-0 animate-[pulse-ring_2.8s_ease-out_infinite] rounded-full" />
                <Star className="h-3 w-3 fill-current" />
              </span>
              <span className="eyebrow text-ink-soft">
                2.400+ artistas verificados na sua região
              </span>
            </div>

            <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[0.98] sm:text-6xl lg:text-[4.4rem]">
              Encontre os melhores{" "}
              <span className="relative inline-block">
                <span className="underline-sketch">talentos criativos</span>
              </span>{" "}
              da sua região
            </h1>

            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">
              Fotógrafos, videomakers, designers, músicos e ilustradores
              avaliados por clientes reais. Compare portfólios, converse direto e
              contrate com <strong className="font-semibold text-ink">pagamento protegido</strong>.
            </p>

            {/* ---------- Barra de pesquisa ---------- */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch();
              }}
              className="mt-9 rounded-[26px] border border-line bg-surface p-2 shadow-[var(--shadow-soft)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-neon)]"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <label className="flex flex-1 items-center gap-3 px-3 py-2">
                  <Search className="h-5 w-5 shrink-0 text-accent" strokeWidth={2.2} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="O que você precisa criar? Ex.: ensaio, clipe, logo…"
                    className="w-full bg-transparent text-[0.95rem] font-medium text-ink outline-none placeholder:text-ink-soft/70"
                    aria-label="Buscar artistas ou serviços"
                  />
                </label>

                <span className="hidden h-8 w-px bg-line md:block" />

                <label className="relative flex items-center gap-2 px-3 py-2 md:w-56">
                  <MapPin className="h-5 w-5 shrink-0 text-ink-soft" strokeWidth={2} />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Filtrar por cidade"
                    className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[0.95rem] font-medium text-ink outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-soft" />
                </label>

                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-[19px] bg-accent px-6 py-3.5 text-sm font-bold text-accent-ink transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_36px_-14px_var(--c-glow)] active:scale-[0.98]"
                >
                  Explorar artistas
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.6} />
                </button>
              </div>
            </form>

            {/* Buscas populares */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="eyebrow text-ink-soft">Populares:</span>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    onSearch();
                  }}
                  className="rounded-full border border-line bg-bg-soft px-3 py-1.5 text-xs font-semibold text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Prova social */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex -space-x-3">
                {ARTISTS.slice(0, 5).map((a) => (
                  <img
                    key={a.id}
                    src={a.photo}
                    alt={a.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-full border-2 border-bg object-cover transition-transform duration-300 hover:z-10 hover:scale-110"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2 font-bold">
                  <Stars rating={4.9} size={15} />
                  <span>4,9</span>
                  <span className="font-normal text-ink-soft">
                    média de 3.180 avaliações
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-ink-soft">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Contratos com garantia de entrega
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Coluna visual: cartões flutuantes ---------- */}
          <div className="relative lg:col-span-5 xl:col-span-6">
            <div className="relative mx-auto h-[440px] w-full max-w-[420px] sm:h-[520px] lg:h-[600px] lg:max-w-none">
              {/* Cada cartão tem 3 camadas: posição → parallax → flutuação/rotação.
                  Assim a animação não sobrescreve o transform do parallax. */}
              <div
                className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 sm:w-[320px]"
                style={layer(-16)}
              >
                <div className="-rotate-[3deg] animate-[float_9s_ease-in-out_infinite]">
                  <FloatCard artist={floatCards[0]} featured />
                </div>
              </div>

              <div
                className="absolute right-0 top-4 w-[58%] sm:w-[220px]"
                style={layer(26)}
              >
                <div className="rotate-[7deg] animate-[float_11s_ease-in-out_infinite_reverse]">
                  <FloatCard artist={floatCards[1]} />
                </div>
              </div>

              <div
                className="absolute bottom-2 left-0 w-[58%] sm:w-[210px]"
                style={layer(38)}
              >
                <div className="-rotate-[8deg] animate-[float_13s_ease-in-out_infinite]">
                  <FloatCard artist={floatCards[2]} />
                </div>
              </div>

              {/* selo "online agora" */}
              <div
                className="absolute -left-1 top-8 z-20 flex items-center gap-2 rounded-full border border-line bg-surface/95 px-3.5 py-2 shadow-[var(--shadow-soft)] backdrop-blur sm:left-4"
                style={layer(52)}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <span className="text-xs font-bold">184 artistas online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Ticker de especialidades ---------- */}
      <div className="marquee-mask relative mt-14 overflow-hidden border-y border-line bg-surface/40 py-4 backdrop-blur">
        {/* dois grupos idênticos: o deslocamento de -50% cria o loop perfeito */}
        <div className="marquee-track animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
              {[
                "Fotografia de casamento",
                "Clipes musicais",
                "Branding",
                "Motion 3D",
                "Drone 6K",
                "Ilustração editorial",
                "Trilha sonora",
                "Ensaios autorais",
                "Color grading",
                "Food photography",
              ].map((t) => (
                <span
                  key={t + dup}
                  className="flex items-center gap-8 font-display text-lg font-semibold text-ink-soft sm:text-xl"
                >
                  {t}
                  <span className="text-accent">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FloatCard({
  artist,
  featured,
}: {
  artist: (typeof ARTISTS)[number];
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-lift)] transition-transform duration-500 hover:scale-[1.04]",
        featured && "ring-1 ring-accent/20"
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "h-56 sm:h-64" : "h-32 sm:h-36")}>
        <img
          src={artist.photo}
          alt={artist.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-surface)] via-transparent to-transparent opacity-80" />
        {artist.online && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-bg/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Disponível
          </span>
        )}
      </div>
      <div className={cn("p-4", featured ? "" : "p-3")}>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("font-display font-bold leading-tight", featured ? "text-lg" : "text-sm")}>
            {artist.name}
          </p>
          <span className="flex items-center gap-1 text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-star text-star" />
            {artist.rating.toFixed(1).replace(".", ",")}
          </span>
        </div>
        <p className={cn("mt-1 text-ink-soft", featured ? "text-sm" : "text-[11px]")}>
          {artist.role}
        </p>
        {featured && (
          <button
            type="button"
            onClick={() => scrollToId("#artistas")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-soft py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-accent transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
          >
            Ver portfólio <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
