import { useEffect, useState } from "react";
import {
  X,
  Heart,
  MessageSquare,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Briefcase,
  ArrowRight,
  Send,
} from "lucide-react";
import type { Artist } from "../data/artists";
import { Stars } from "./ui/Brand";
import { cn } from "../utils/cn";

interface Props {
  artist: Artist | null;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function ArtistModal({
  artist,
  favorite,
  onToggleFavorite,
  onClose,
}: Props) {
  const [shown, setShown] = useState(false);
  const [sent, setSent] = useState(false);

  /* Abre com transição + trava o scroll + ESC para fechar */
  useEffect(() => {
    if (!artist) {
      setShown(false);
      setSent(false);
      return;
    }
    const raf = requestAnimationFrame(() => setShown(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  const handleClose = () => {
    setShown(false);
    window.setTimeout(onClose, 260);
  };

  if (!artist) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${artist.name}`}
    >
      {/* Fundo */}
      <button
        type="button"
        aria-label="Fechar perfil"
        onClick={handleClose}
        className={cn(
          "absolute inset-0 cursor-default bg-[#07060b]/70 backdrop-blur-md transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Painel */}
      <div
        className={cn(
          "relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,.7)] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] sm:max-h-[90vh] sm:rounded-3xl",
          shown ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-8 opacity-0 sm:scale-95"
        )}
      >
        <div className="overflow-y-auto">
          {/* Capa */}
          <div className="relative h-40 sm:h-56">
            <img
              src={artist.cover}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-surface)] via-[var(--c-surface)]/35 to-transparent" />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-[#07060b]/60 text-white backdrop-blur transition-transform duration-300 hover:rotate-90 hover:bg-accent hover:text-accent-ink"
            >
              <X className="h-5 w-5" strokeWidth={2.4} />
            </button>
          </div>

          <div className="px-5 pb-8 sm:px-9">
            {/* Cabeçalho */}
            <div className="-mt-14 flex flex-wrap items-end gap-5">
              <img
                src={artist.photo}
                alt={artist.name}
                className="h-24 w-24 rounded-3xl border-4 border-surface object-cover shadow-[var(--shadow-lift)] sm:h-28 sm:w-28"
              />
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                    {artist.name}
                  </h3>
                  {artist.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                      <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Verificado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {artist.role} · {artist.city}
                </p>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(artist.id)}
                  aria-pressed={favorite}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95",
                    favorite
                      ? "border-transparent bg-accent text-accent-ink"
                      : "border-line bg-bg-soft text-ink-soft hover:text-accent"
                  )}
                  aria-label="Salvar artista"
                >
                  <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
                </button>
                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="flex items-center gap-2 rounded-2xl border border-line bg-bg-soft px-4 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <MessageSquare className="h-4 w-4" />
                  Conversar
                </button>
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric
                icon={<Stars rating={artist.rating} size={13} />}
                label="avaliações"
                value={`${artist.rating.toFixed(1).replace(".", ",")} · ${artist.reviews}`}
              />
              <Metric icon={<Briefcase className="h-4 w-4" />} label="projetos" value={String(artist.projects)} />
              <Metric icon={<Clock className="h-4 w-4" />} label="resposta" value={artist.responseTime} />
              <Metric
                icon={<ShieldCheck className="h-4 w-4" />}
                label="pagamento"
                value="Protegido"
              />
            </div>

            <div className="mt-9 grid gap-9 lg:grid-cols-3">
              {/* Coluna principal */}
              <div className="space-y-9 lg:col-span-2">
                <Block title="Sobre">
                  <p className="leading-relaxed text-ink-soft">{artist.bio}</p>
                </Block>

                <Block title="Portfólio">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {artist.gallery.map((g) => (
                      <figure
                        key={g.src + g.caption}
                        className="group/img relative overflow-hidden rounded-2xl border border-line"
                      >
                        <img
                          src={g.src}
                          alt={g.caption}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] group-hover/img:scale-110"
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#07060b]/90 to-transparent px-3 pb-2 pt-8 text-[11px] font-semibold text-white transition-transform duration-500 group-hover/img:translate-y-0">
                          {g.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </Block>

                <Block title="Avaliações de clientes">
                  <div className="space-y-3">
                    {artist.testimonials.map((t) => (
                      <blockquote
                        key={t.name}
                        className="rounded-2xl border border-line bg-bg-soft p-5 transition-all duration-400 hover:-translate-y-1 hover:border-accent/40"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{t.name}</p>
                            <p className="text-xs text-ink-soft">{t.role}</p>
                          </div>
                          <Stars rating={t.stars} size={13} />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          “{t.text}”
                        </p>
                      </blockquote>
                    ))}
                  </div>
                </Block>
              </div>

              {/* Coluna lateral */}
              <aside className="space-y-5">
                <div className="rounded-3xl border border-line bg-bg-soft p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                    Diária a partir de
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold">
                    R$ {artist.price.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-5 space-y-4">
                    {artist.skills.map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{s.label}</span>
                          <span className="font-mono text-ink-soft">{s.value}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                          <span
                            className="block h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
                            style={{ width: shown ? `${s.value}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {artist.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-accent/35 bg-accent-soft p-5">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    Garantia Prisma
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    O pagamento fica retido até você aprovar a entrega. Se algo
                    der errado, nossa mediação entra em ação em até 24h.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Barra de ação fixa */}
        <div className="flex items-center justify-between gap-4 border-t border-line bg-surface/95 px-5 py-4 backdrop-blur sm:px-9">
          <p className="hidden text-xs text-ink-soft sm:block">
            Resposta média em <strong className="text-ink">{artist.responseTime}</strong> ·{" "}
            {artist.online ? "Disponível agora" : "Agenda para 2 semanas"}
          </p>
          <button
            type="button"
            onClick={() => setSent(true)}
            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-ink transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_40px_-14px_var(--c-glow)] active:scale-[0.98] sm:flex-none"
          >
            {sent ? (
              <>
                Pedido enviado <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Solicitar orçamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-soft px-4 py-3 transition-colors duration-300 hover:border-accent/40">
      <span className="flex items-center gap-1.5 text-accent">{icon}</span>
      <p className="mt-1.5 font-display text-lg font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 flex items-center gap-3 font-display text-lg font-bold">
        {title}
        <span className="h-px flex-1 bg-line" />
      </h4>
      {children}
    </div>
  );
}
