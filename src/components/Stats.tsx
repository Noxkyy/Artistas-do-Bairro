import { useEffect, useRef, useState } from "react";
import { useCountUp } from "../hooks/useTheme";

const STATS = [
  { value: 2400, suffix: "+", label: "artistas verificados" },
  { value: 38, suffix: "", label: "cidades atendidas" },
  { value: 12500, suffix: "+", label: "projetos entregues" },
  { value: 97, suffix: "%", label: "recontratam o artista" },
];

/** Faixa de indicadores com contadores animados ao entrar na tela. */
export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative border-y border-line bg-surface/60 py-12 backdrop-blur"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatItem key={s.label} {...s} active={active} index={i} />
        ))}
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  active,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  index: number;
}) {
  const n = useCountUp(value, active, 1500 + index * 180);
  const formatted = n.toLocaleString("pt-BR");

  return (
    <div className="group relative px-2 text-center lg:text-left">
      {index > 0 && (
        <span className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-line lg:block" />
      )}
      <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight sm:text-5xl">
        {formatted}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-ink-soft transition-colors group-hover:text-ink">
        {label}
      </p>
    </div>
  );
}
