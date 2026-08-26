import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Logo } from "./ui/Brand";
import { useScrollY } from "../hooks/useTheme";
import { cn } from "../utils/cn";

const LINKS = [
  { href: "#categorias", label: "Categorias" },
  { href: "#artistas", label: "Artistas" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#depoimentos", label: "Depoimentos" },
];

export function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

export function Navbar({ onLogin }: { onLogin?: () => void }) {
  const { passed } = useScrollY(30);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(`#${visible.target.id}`);
    }, { rootMargin: "-45% 0px -50% 0px", threshold: [0.01, 0.2, 0.5] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(href), open ? 180 : 0);
  };

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-500", passed ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent")}>
        <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group flex items-center gap-2.5" aria-label="Prisma — início">
            <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105" />
            <span className="font-display text-[1.35rem] font-extrabold tracking-tight">Prisma<span className="text-accent">.</span></span>
          </button>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => <li key={l.href}><button type="button" onClick={() => go(l.href)} className={cn("relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300", active === l.href ? "text-accent" : "text-ink-soft hover:text-ink")}>{l.label}<span className={cn("absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent transition-all duration-300", active === l.href ? "opacity-100" : "scale-x-0 opacity-0")} /></button></li>)}
          </ul>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onLogin} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent sm:block">Entrar</button>
            <button type="button" onClick={() => scrollToId("#seja-artista")} className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_var(--c-glow)] dark:bg-accent dark:text-accent-ink sm:flex"><Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />Sou artista</button>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </nav>
      </header>
      <div className={cn("fixed inset-0 z-30 flex flex-col bg-bg px-6 pb-10 pt-24 transition-all duration-500 lg:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-4 opacity-0")}>
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <ul className="relative flex flex-col gap-1">
          {LINKS.map((l, i) => <li key={l.href} className="border-b border-line" style={{ transitionDelay: `${open ? 90 + i * 70 : 0}ms`, opacity: open ? 1 : 0, transform: open ? "none" : "translateY(14px)", transition: "opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)" }}><button type="button" onClick={() => go(l.href)} className="flex w-full items-baseline gap-3 py-4 text-left font-display text-3xl font-bold"><span className="font-mono text-xs text-accent">0{i + 1}</span>{l.label}</button></li>)}
        </ul>
        <button type="button" onClick={onLogin} className="relative mt-4 w-full rounded-2xl border border-line bg-surface px-6 py-4 text-base font-bold text-ink">Entrar / testar acesso</button>
        <button type="button" onClick={() => go("#seja-artista")} className="relative mt-3 w-full rounded-2xl bg-accent px-6 py-4 text-base font-bold text-accent-ink shadow-[0_16px_40px_-16px_var(--c-glow)] transition-transform active:scale-[0.98]">Criar meu perfil de artista</button>
      </div>
    </>
  );
}
