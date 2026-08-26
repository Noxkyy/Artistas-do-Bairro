import { useState } from "react";
import { Check, ArrowRight, BadgeCheck, Wallet, TrendingUp, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const BENEFITS = [
  { icon: Users, text: "Perfil verificado com selo de curadoria" },
  { icon: Wallet, text: "Receba em até 2 dias úteis, sem taxa de saque" },
  { icon: TrendingUp, text: "Destaque em buscas da sua cidade" },
  { icon: BadgeCheck, text: "Contrato e nota fiscal emitidos pela Prisma" },
];

/** Painel de conversão para artistas entrarem na plataforma. */
export function JoinArtists() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="seja-artista" className="relative scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <Reveal>
        <div className="relative mx-auto grid max-w-[1280px] overflow-hidden rounded-[36px] border border-line bg-ink text-bg lg:grid-cols-2">
          {/* textura */}
          <div className="bg-grid absolute inset-0 opacity-[0.18]" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -left-24 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full opacity-60 blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, var(--c-accent) 0%, transparent 70%)",
            }}
          />

          {/* Coluna esquerda */}
          <div className="relative p-9 sm:p-14">
            <span className="eyebrow text-accent">Para artistas</span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] sm:text-5xl">
              Você é o talento
              <br />
              que falta aqui
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-bg/70">
              Monte seu portfólio em minutos, receba briefings da sua região e
              feche contratos com pagamento garantido. A curadoria é gratuita.
            </p>

            <ul className="mt-9 space-y-3.5">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                    <b.icon className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>
                  <span className="text-bg/85">{b.text}</span>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-label="Seu e-mail"
                className="w-full rounded-2xl border border-bg/20 bg-bg/10 px-5 py-3.5 text-sm font-medium text-bg outline-none backdrop-blur transition-colors placeholder:text-bg/45 focus:border-accent"
              />
              <button
                type="submit"
                className="group flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-ink transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_18px_44px_-16px_var(--c-glow)] active:scale-[0.98]"
              >
                {done ? "Cadastro enviado!" : "Criar meu perfil"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.6} />
              </button>
            </form>
            <p className="mt-3 text-xs text-bg/50">
              Grátis para sempre · Sem exclusividade · Cancele quando quiser
            </p>
          </div>

          {/* Coluna direita — mock de painel do artista */}
          <div className="relative flex items-center justify-center p-9 sm:p-14">
            <div className="w-full max-w-sm rounded-3xl border border-bg/15 bg-bg/8 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-bg/60">Seu painel</span>
                <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-ink">
                  <Check className="h-3 w-3" strokeWidth={3} /> Ativo
                </span>
              </div>

              <p className="mt-6 font-display text-4xl font-extrabold">
                R$ 18.420
              </p>
              <p className="mt-1 text-sm text-bg/60">
                faturado nos últimos 90 dias
              </p>

              {/* mini gráfico em barras */}
              <div className="mt-6 flex h-24 items-end gap-2">
                {[38, 55, 42, 70, 61, 88, 74, 96].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-md bg-accent/80 transition-all duration-500 hover:bg-accent"
                    style={{
                      height: `${h}%`,
                      opacity: 0.45 + (i / 8) * 0.55,
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-bg/15 pt-5 text-center">
                {[
                  { v: "4,9", l: "nota" },
                  { v: "32", l: "projetos" },
                  { v: "2h", l: "resposta" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-xl font-extrabold">{s.v}</p>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-bg/55">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
