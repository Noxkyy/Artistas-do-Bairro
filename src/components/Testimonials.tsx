import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/artists";
import { Stars } from "./ui/Brand";
import { Reveal } from "./Reveal";
import { cn } from "../utils/cn";

const AUTOPLAY = 6500;

/** Carrossel de depoimentos com autoplay e pausa no hover. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % total),
      AUTOPLAY
    );
    return () => window.clearInterval(id);
  }, [paused, total]);

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <section
      id="depoimentos"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute right-[-10%] top-10 h-[420px] w-[420px] rounded-full opacity-25 blur-[110px]"
        style={{
          background: "radial-gradient(circle, var(--c-accent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Texto */}
          <Reveal className="lg:col-span-5">
            <span className="eyebrow text-accent">04 — Depoimentos</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl">
              Quem contratou
              <br />
              volta a contratar
            </h2>
            <p className="mt-5 max-w-md text-ink-soft">
              97% dos clientes fecham um segundo projeto com o mesmo artista em
              até seis meses. Estes são alguns recados de quem já usou.
            </p>

            {/* Controles */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Depoimento anterior"
                className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:-translate-x-1 hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo depoimento"
                className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:translate-x-1 hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
              </button>

              <div className="ml-3 flex items-center gap-2">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ir para depoimento ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      i === index
                        ? "w-8 bg-accent"
                        : "w-2 bg-line hover:bg-accent/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Carrossel */}
          <Reveal
            delay={140}
            className="lg:col-span-7"
          >
            <div
              className="overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div
                className="flex transition-transform duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
              >
                {TESTIMONIALS.map((t) => (
                  <figure
                    key={t.name}
                    className="w-full shrink-0 px-1"
                    aria-hidden={TESTIMONIALS[index].name !== t.name}
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] sm:p-10">
                      <Quote className="absolute -right-4 -top-4 h-32 w-32 text-accent/10" />
                      <Stars rating={t.stars} size={18} />
                      <blockquote className="relative mt-6 font-display text-2xl font-semibold leading-[1.28] sm:text-[1.75rem]">
                        “{t.text}”
                      </blockquote>
                      <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          loading="lazy"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold">{t.name}</p>
                          <p className="text-sm text-ink-soft">{t.role}</p>
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
