import { Search, Layers, MessageSquare, ShieldCheck } from "lucide-react";
import { STEPS } from "../data/artists";
import { Reveal } from "./Reveal";

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Search,
  Layers,
  MessageSquare,
  ShieldCheck,
};

/** Linha do tempo do processo de contratação. */
export function Process() {
  return (
    <section
      id="como-funciona"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-bg-soft py-24 sm:py-32"
    >
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <span className="eyebrow text-accent">03 — Como funciona</span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
            Da busca à entrega
            <br />
            em quatro passos
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* linha conectora */}
          <div
            className="absolute left-[27px] top-4 h-[calc(100%-2rem)] w-px bg-[repeating-linear-gradient(to_bottom,var(--c-line)_0_8px,transparent_8px_16px)] lg:left-0 lg:top-[27px] lg:h-px lg:w-full"
            aria-hidden="true"
          />

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Search;
              return (
                <li key={s.n} className="relative">
                  <Reveal delay={i * 130}>
                    <div className="group relative flex gap-5 lg:block">
                      {/* nó numerado */}
                      <div className="relative z-10 shrink-0">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface font-mono text-sm font-bold text-accent transition-all duration-500 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[var(--shadow-neon)]">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <span className="mt-2 block font-display text-3xl font-extrabold text-ink-soft/25 transition-colors duration-500 group-hover:text-accent lg:mt-4">
                          {s.n}
                        </span>
                      </div>

                      <div className="lg:mt-5">
                        <h3 className="font-display text-xl font-bold leading-snug">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
