import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/artists";
import { Stars } from "./ui/Brand";
import { Reveal } from "./Reveal";
import { cn } from "../utils/cn";

const AUTOPLAY = 6500;

/** Carrossel de depoimentos responsivo, com autoplay e navegação manual. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  if (!total) return null;

  return (
    <section id="depoimentos" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-32">
      <div
        className="pointer-events-none absolute right-[-12%] top-10 h-[300px] w-[300px] rounded-full opacity-20 blur-[90px] sm:h-[420px] sm:w-[420px] sm:opacity-25 sm:blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--c-accent) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="grid min-w-0 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-5">
            <span className="eyebrow text-accent">04 — Depoimentos</span>
            <h2 className="mt-4 break-words font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl">
              Quem contratou
              <br />
              volta a contratar
            </h2>
            <p className="mt-5 max-w-md break-words text-ink-soft">
              97% dos clientes fecham um segundo projeto com o mesmo artista em até seis meses. Estes são alguns recados de quem já usou.
            </p>

            <div className="mt-7 flex max-w-full flex-wrap items-center gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Depoimento anterior" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-accent hover:text-accent sm:h-12 sm:w-12">
                <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Próximo depoimento" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-accent hover:text-accent sm:h-12 sm:w-12">
                <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
              </button>
              <div className="no-bar flex max-w-full min-w-0 items-center gap-2 overflow-x-auto py-2 pl-1" role="tablist" aria-label="Selecionar depoimento">
                {TESTIMONIALS.map((t, i) => (
                  <button key={t.name} type="button" onClick={() => setIndex(i)} aria-label={`Ir para depoimento ${i + 1}`} aria-current={i === index} className={cn("h-2 shrink-0 rounded-full transition-all duration-300", i === index ? "w-8 bg-accent" : "w-2 bg-line hover:bg-accent/50")} />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="min-w-0 overflow-hidden lg:col-span-7">
            <div className="min-w-0 overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div
                className="flex min-w-0 transition-transform duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
              >
                {TESTIMONIALS.map((t) => (
                  <figure key={t.name} className="box-border w-full min-w-0 shrink-0 px-0 sm:px-1" aria-hidden={TESTIMONIALS[index].name !== t.name}>
                    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-10">
                      <Quote className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-accent/10 sm:-right-4 sm:-top-4 sm:h-32 sm:w-32" />
                      <Stars rating={t.stars} size={17} />
                      <blockquote className="relative mt-5 break-words [overflow-wrap:anywhere] font-display text-xl font-semibold leading-[1.3] sm:mt-6 sm:text-[1.75rem]">
                        “{t.text}”
                      </blockquote>
                      <figcaption className="mt-6 flex min-w-0 items-center gap-3 border-t border-line pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                        <img src={t.avatar} alt={t.name} loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover sm:h-12 sm:w-12" />
                        <div className="min-w-0">
                          <p className="break-words font-bold">{t.name}</p>
                          <p className="break-words text-sm text-ink-soft">{t.role}</p>
                        </div>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
