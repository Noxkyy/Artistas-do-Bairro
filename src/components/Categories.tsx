import { useEffect, useState } from "react";
import {
  Camera,
  Clapperboard,
  PenTool,
  Palette,
  Music,
  Boxes,
  ArrowUpRight,
  Sparkles,
  X,
  Mail,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { CATEGORIES, type CategoryId } from "../data/artists";
import { Reveal } from "./Reveal";
import { scrollToId } from "./Navbar";
import { cn } from "../utils/cn";

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Camera,
  Clapperboard,
  PenTool,
  Palette,
  Music,
  Boxes,
};

interface Props {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}

/** Layout bento: duas células grandes, quatro médias e uma faixa de CTA. */
const SPANS: Record<string, string> = {
  fotografia: "sm:col-span-3 lg:col-span-2 lg:row-span-2",
  video: "sm:col-span-3 lg:col-span-2",
  design: "sm:col-span-3 lg:col-span-2",
  ilustracao: "sm:col-span-3 lg:col-span-2",
  musica: "sm:col-span-3 lg:col-span-2",
  motion: "sm:col-span-3 lg:col-span-3",
};

const CURATION_EMAIL = "joao.czadotz@escola.pr.gov.br";
const CURATION_SUBJECT = "Pedido de Curadoria: Solicitação de Nova Área";
const CURATION_BODY = `Olá, equipe de curadoria!\n\nNão encontrei a área de atuação que procurava no site e gostaria de solicitar uma categoria sob demanda.\n\nEstou precisando de um profissional especializado em: [Apague este texto e descreva aqui detalhadamente a área ou o profissional que você busca]\n\nFico no aguardo do retorno!\n\nAtenciosamente,`;
const CURATION_MAILTO = `mailto:${CURATION_EMAIL}?subject=${encodeURIComponent(CURATION_SUBJECT)}&body=${encodeURIComponent(CURATION_BODY)}`;
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CURATION_EMAIL)}&su=${encodeURIComponent(CURATION_SUBJECT)}&body=${encodeURIComponent(CURATION_BODY)}`;
const OUTLOOK_COMPOSE = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(CURATION_EMAIL)}&subject=${encodeURIComponent(CURATION_SUBJECT)}&body=${encodeURIComponent(CURATION_BODY)}`;

export function Categories({ active, onSelect }: Props) {
  const [curationFallbackOpen, setCurationFallbackOpen] = useState(false);

  const pick = (id: CategoryId) => {
    onSelect(id);
    scrollToId("#artistas");
  };

  useEffect(() => {
    if (!curationFallbackOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [curationFallbackOpen]);

  useEffect(() => {
    if (!curationFallbackOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCurationFallbackOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [curationFallbackOpen]);

  const openFallback = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: fine)").matches) {
      window.setTimeout(() => setCurationFallbackOpen(true), 1000);
    }
  };

  return (
    <section id="categorias" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <span className="eyebrow text-accent">01 — Categorias</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
              Escolha a linguagem
              <br />
              do seu próximo projeto
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-sm">
            <p className="text-ink-soft">
              Cada área reúne profissionais verificados, com portfólio revisado
              pela nossa curadoria e nota calculada a partir de contratos
              concluídos.
            </p>
          </Reveal>
        </div>

        {/* Bento */}
        <div className="mt-14 grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-4 sm:grid-cols-6 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={i * 80}
              className={SPANS[cat.id]}
            >
              <CategoryCard
                cat={cat}
                big={cat.id === "fotografia"}
                active={active === cat.id}
                onClick={() => pick(cat.id)}
              />
            </Reveal>
          ))}

          {/* Célula CTA */}
          <Reveal delay={CATEGORIES.length * 80} className="sm:col-span-3 lg:col-span-3">
            <a
              href={CURATION_MAILTO}
              onClick={openFallback}
              aria-label="Pedir curadoria por e-mail"
              className="group relative flex h-full min-h-[150px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-dashed border-accent/45 bg-accent-soft p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-accent"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-ink">
                <Sparkles className="h-5 w-5 transition-transform duration-700 group-hover:rotate-180" />
              </span>
              <div className="relative mt-6">
                <p className="font-display text-xl font-bold sm:text-2xl">
                  Não achou a sua área?
                </p>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Criamos categorias sob demanda — conte o que você precisa e a
                  curadoria encontra o profissional.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  Pedir curadoria
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </div>

      {curationFallbackOpen && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-[#07060b]/75 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="curation-fallback-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setCurationFallbackOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,.75)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-accent">
                  Curadoria
                </span>
                <h3 id="curation-fallback-title" className="mt-3 font-display text-2xl font-extrabold">
                  Escolha como abrir o pedido
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  O computador pode não ter um aplicativo de e-mail configurado. O pedido já está preenchido.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurationFallbackOpen(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={GMAIL_COMPOSE}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCurationFallbackOpen(false)}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg-soft px-4 py-3 font-semibold transition-colors hover:border-accent"
              >
                <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" /> Abrir no Gmail</span>
                <ExternalLink className="h-4 w-4 text-ink-soft" />
              </a>
              <a
                href={OUTLOOK_COMPOSE}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCurationFallbackOpen(false)}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg-soft px-4 py-3 font-semibold transition-colors hover:border-accent"
              >
                <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" /> Abrir no Outlook</span>
                <ExternalLink className="h-4 w-4 text-ink-soft" />
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-bg-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-ink-soft">Seu pedido já está preparado</p>
              <p className="mt-2 break-words text-sm"><strong>Para:</strong> {CURATION_EMAIL}</p>
              <p className="mt-1 break-words text-sm"><strong>Assunto:</strong> {CURATION_SUBJECT}</p>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`Para: ${CURATION_EMAIL}\nAssunto: ${CURATION_SUBJECT}\n\n${CURATION_BODY}`);
                } catch {
                  // Clipboard API can be blocked on older browsers; the mail links remain available.
                }
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold hover:border-accent hover:text-accent"
            >
              <Copy className="h-4 w-4" /> Copiar dados do pedido
              <Check className="hidden h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CategoryCard({
  cat,
  big,
  active,
  onClick,
}: {
  cat: (typeof CATEGORIES)[number];
  big?: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = ICONS[cat.icon] ?? Camera;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex h-full min-h-[150px] w-full flex-col justify-between overflow-hidden rounded-3xl border p-6 text-left transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-[var(--shadow-lift)] active:translate-y-0",
        active
          ? "border-accent bg-accent-soft shadow-[var(--shadow-neon)]"
          : "border-line bg-surface hover:border-accent/50"
      )}
    >
      {/* brilho que acompanha o hover */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/0 blur-2xl transition-all duration-700 group-hover:bg-accent/20" />

      <div className="relative flex items-start justify-between">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-2xl border transition-all duration-500",
            big ? "h-14 w-14" : "h-11 w-11",
            active
              ? "border-accent bg-accent text-accent-ink"
              : "border-line bg-bg-soft text-ink group-hover:-rotate-6 group-hover:border-accent group-hover:text-accent"
          )}
        >
          <Icon className={big ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.8} />
        </span>
        <ArrowUpRight
          className={cn(
            "h-5 w-5 transition-all duration-500",
            active
              ? "text-accent"
              : "text-ink-soft/40 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
          )}
          strokeWidth={2.2}
        />
      </div>

      <div className="relative">
        <div className="flex items-baseline gap-2">
          <h3 className={cn("font-display font-bold", big ? "text-3xl" : "text-xl")}>
            {cat.label}
          </h3>
          <span className="font-mono text-xs text-ink-soft">{cat.count}</span>
        </div>
        {big && (
          <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-ink-soft">
            {cat.blurb}
          </p>
        )}
      </div>
    </button>
  );
}
