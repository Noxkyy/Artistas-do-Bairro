import { ArrowUp, Moon, Sun } from "lucide-react";
import { useScrollY } from "../hooks/useTheme";
import { cn } from "../utils/cn";
import type { Theme } from "../hooks/useTheme";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

/**
 * Controles flutuantes no canto inferior direito:
 *  - Toggle de tema (claro/escuro) sempre visível
 *  - Botão "voltar ao topo" que surge após rolar a página
 */
export function FloatingControls({ theme, onToggle }: Props) {
  const { passed } = useScrollY(700);
  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3 sm:bottom-7 sm:right-7">
      {/* Voltar ao topo */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:text-accent",
          passed
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
      </button>

      {/* Toggle de tema */}
      <div className="group relative">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          aria-pressed={isDark}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_10px_30px_-6px_var(--c-glow)] transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <span
            className="absolute inset-0 rounded-full bg-accent opacity-60 blur-md"
            aria-hidden="true"
          />
          <span className="absolute inset-0 rounded-full animate-[pulse-ring_2.8s_ease-out_infinite]" />
          <span className="relative">
            <Sun
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 transition-all duration-500",
                isDark
                  ? "rotate-90 scale-50 opacity-0"
                  : "left-0 top-0 rotate-0 scale-100 opacity-100"
              )}
              strokeWidth={2.2}
            />
            <Moon
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 transition-all duration-500",
                isDark
                  ? "left-0 top-0 rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0"
              )}
              strokeWidth={2.2}
            />
          </span>
        </button>

        {/* Rótulo que aparece no hover */}
        <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink opacity-0 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:opacity-100">
          Modo {isDark ? "escuro" : "claro"}
        </span>
      </div>
    </div>
  );
}
