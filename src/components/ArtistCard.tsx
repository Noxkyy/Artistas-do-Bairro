import { Heart, MapPin, ArrowRight, BadgeCheck } from "lucide-react";
import type { Artist } from "../data/artists";
import { Stars } from "./ui/Brand";
import { cn } from "../utils/cn";

interface Props {
  artist: Artist;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (artist: Artist) => void;
  index: number;
}

export function ArtistCard({
  artist,
  favorite,
  onToggleFavorite,
  onOpen,
  index,
}: Props) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-500 hover:-translate-y-2 hover:border-accent/50 hover:shadow-[var(--shadow-lift)]"
      style={{ transitionDelay: `${Math.min(index, 8) * 10}ms` }}
    >
      {/* ---------------- Foto ---------------- */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={artist.photo}
          alt={`Retrato de ${artist.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-surface)] via-[var(--c-surface)]/10 to-transparent" />

        {/* área clicável que abre o perfil */}
        <button
          type="button"
          onClick={() => onOpen(artist)}
          className="absolute inset-0 cursor-pointer"
          aria-label={`Ver perfil de ${artist.name}`}
        />

        {/* selos superiores */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex flex-col items-start gap-1.5">
            {artist.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-bg/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5 text-accent" strokeWidth={2.4} />
                Verificado
              </span>
            )}
            {artist.online && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Online
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(artist.id);
            }}
            aria-label={favorite ? "Remover dos salvos" : "Salvar artista"}
            aria-pressed={favorite}
            className={cn(
              "pointer-events-auto relative z-10 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all duration-300 hover:scale-110 active:scale-90",
              favorite
                ? "border-transparent bg-accent text-accent-ink"
                : "border-line bg-bg/85 text-ink-soft hover:text-accent"
            )}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-current")} strokeWidth={2.2} />
          </button>
        </div>

        {/* Botão "Ver perfil" — sobe no hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
          <button
            type="button"
            onClick={() => onOpen(artist)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink/92 py-3 text-xs font-bold uppercase tracking-[0.16em] text-bg backdrop-blur transition-colors duration-300 hover:bg-accent hover:text-accent-ink dark:bg-accent dark:text-accent-ink dark:hover:bg-accent-2 dark:hover:text-accent-ink"
          >
            Ver perfil
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </button>
        </div>
      </div>

      {/* ---------------- Conteúdo ---------------- */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold leading-tight">
              {artist.name}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">{artist.role}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-line bg-bg-soft px-2 py-1 text-center">
            <Stars rating={artist.rating} size={12} />
            <span className="mt-0.5 block font-mono text-[11px] font-bold">
              {artist.rating.toFixed(1).replace(".", ",")}
            </span>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
          <MapPin className="h-3.5 w-3.5" />
          {artist.city}
          <span className="text-line">•</span>
          {artist.reviews} avaliações
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {artist.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-bg-soft px-2.5 py-1 text-[11px] font-semibold text-ink-soft transition-colors duration-300 group-hover:border-accent/30"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-4 text-sm">
          <div>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              a partir de
            </span>
            <span className="font-display text-xl font-extrabold">
              R$ {artist.price.toLocaleString("pt-BR")}
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-soft">
            responde em {artist.responseTime}
          </span>
        </div>
      </div>
    </article>
  );
}
