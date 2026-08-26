import { useState } from "react";
import { Send, MapPin } from "lucide-react";
import { Logo } from "./ui/Brand";
import { scrollToId } from "./Navbar";
import { subscribeNewsletter } from "../lib/supabase";

type Svg = (p: { className?: string }) => React.ReactElement;
const Instagram: Svg = ({ className }) => <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4"/><circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none"/></svg>;
const Youtube: Svg = ({ className }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.8 2.8 0 0 0-1.96-1.97C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.48A2.8 2.8 0 0 0 2.4 7.2 29 29 0 0 0 1.9 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 1.96 1.97c1.74.48 7.64.48 7.64.48s5.9 0 7.64-.48a2.8 2.8 0 0 0 1.96-1.97 29 29 0 0 0 .5-4.8ZM10.1 15.1V8.9l5.2 3.1-5.2 3.1Z"/></svg>;
const Linkedin: Svg = ({ className }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.6V20h3.34V8.5ZM5.27 3.2a1.94 1.94 0 1 0 0 3.88 1.94 1.94 0 0 0 0-3.88ZM20.4 13.6c0-3.2-1.72-4.7-4.02-4.7-1.85 0-2.68 1.02-3.14 1.74V8.5H9.9V20h3.34v-6.1c0-1.5.9-2.28 2.03-2.28 1.1 0 1.79.72 1.79 2.28V20H20.4v-6.4Z"/></svg>;
const XLogo: Svg = ({ className }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M17.53 3h3.05l-6.67 7.62L21.5 21h-5.9l-4.62-6.04L5.7 21H2.64l7.13-8.15L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.07 16.17h1.69L8.62 4.74H6.81l9.65 14.43Z"/></svg>;

interface Props { onLegal: (kind: "terms" | "privacy" | "cookies") => void; }

export function Footer({ onLegal }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submitNewsletter = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      await subscribeNewsletter(email);
      setEmail("");
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft pt-20">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-12 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5"><Logo className="h-9 w-9"/><span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">Artistas do Bairro<span className="text-accent">.</span></span></div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">A rede que aproxima quem cria de quem precisa criar. Portfólios verificados, contratos protegidos e talento a poucos quilômetros de você.</p>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-soft"><MapPin className="h-4 w-4 text-accent"/>Curitiba · São Paulo · Recife · 38 cidades</p>
            <form onSubmit={submitNewsletter} className="mt-7">
              <label className="eyebrow text-ink-soft">Novos talentos no seu e-mail</label>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-surface p-1.5 focus-within:border-accent">
                <input type="email" required value={email} onChange={(e)=>{setEmail(e.target.value); setState("idle");}} placeholder="seu@email.com" aria-label="E-mail para newsletter" className="w-full bg-transparent px-3 py-2 text-sm font-medium outline-none placeholder:text-ink-soft/70"/>
                <button type="submit" disabled={state === "loading"} aria-label="Assinar newsletter" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink transition-transform hover:scale-110 active:scale-95 disabled:opacity-60"><Send className="h-4 w-4"/></button>
              </div>
              <p className="mt-2 text-xs text-ink-soft">{state === "success" ? "Inscrição registrada com sucesso." : state === "error" ? "Não foi possível sincronizar; a inscrição ficou salva localmente." : state === "loading" ? "Registrando…" : "Sem spam. Só curadoria."}</p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <FooterColumn title="Plataforma" links={[["Explorar artistas","#artistas"],["Categorias","#categorias"],["Como funciona","#como-funciona"],["Depoimentos","#depoimentos"]]} />
            <FooterColumn title="Para artistas" links={[["Criar perfil","#seja-artista"],["Central de ajuda","#como-funciona"],["Comissão e taxas","#como-funciona"],["Selo verificado","#categorias"]]} />
            <FooterColumn title="Empresa" links={[["Sobre o Artistas do Bairro","#inicio"],["Curadoria","#categorias"],["Trabalhe conosco","#seja-artista"],["Imprensa","#depoimentos"]]} />
            <div><h4 className="eyebrow text-ink">Legal</h4><ul className="mt-5 space-y-3"><li><button type="button" onClick={()=>onLegal("terms")} className="text-sm text-ink-soft hover:text-accent">Termos de uso</button></li><li><button type="button" onClick={()=>onLegal("privacy")} className="text-sm text-ink-soft hover:text-accent">Privacidade</button></li><li><button type="button" onClick={()=>onLegal("cookies")} className="text-sm text-ink-soft hover:text-accent">Cookies</button></li><li><button type="button" onClick={()=>scrollToId("#como-funciona")} className="text-sm text-ink-soft hover:text-accent">Mediação</button></li></ul></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-line py-8 sm:flex-row">
          <p className="text-xs text-ink-soft">© {new Date().getFullYear()} Artistas do Bairro · Plataforma demonstrativa</p>
          <div className="flex items-center gap-2.5">{[{icon:Instagram,label:"Instagram",href:"https://instagram.com"},{icon:Youtube,label:"YouTube",href:"https://youtube.com"},{icon:Linkedin,label:"LinkedIn",href:"https://linkedin.com"},{icon:XLogo,label:"X (Twitter)",href:"https://x.com"}].map((s)=><a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-accent-ink"><s.icon className="h-4 w-4"/></a>)}</div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Feito no Brasil <span className="text-accent">✳</span></p>
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true"><p className="translate-y-[18%] text-center font-display text-[18vw] font-extrabold leading-none tracking-tighter text-ink/[0.045]">ARTISTAS DO BAIRRO</p></div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string,string][] }) {
  return <div><h4 className="eyebrow text-ink">{title}</h4><ul className="mt-5 space-y-3">{links.map(([label,id])=><li key={label}><button type="button" onClick={()=>scrollToId(id)} className="text-sm text-ink-soft hover:text-accent">{label}</button></li>)}</ul></div>;
}
