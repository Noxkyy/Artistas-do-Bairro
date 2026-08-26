import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, X, LogIn, CheckCircle2, LockKeyhole } from "lucide-react";
import { saveDemoAccount } from "../lib/supabase";
import { cn } from "../utils/cn";

interface Props { open: boolean; onClose: () => void; }

export function DemoLoginModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || phone.replace(/\D/g, "").length < 6) {
      setError("Use um e-mail válido e um número com pelo menos 6 dígitos.");
      return;
    }
    if (password.length < 4) {
      setError("A senha precisa ter pelo menos 4 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const result = await saveDemoAccount({ email, phone, displayName: name });
      setPersisted(result.persisted);
      localStorage.setItem("artistas-demo-user", JSON.stringify({ email, phone, name, loggedIn: true }));
      setDone(true);
    } catch {
      setError("Não foi possível concluir o login neste navegador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#07060b]/70 p-4 backdrop-blur-md">
      <button type="button" aria-label="Fechar login" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,.7)] sm:p-8">
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent"><X className="h-4 w-4" /></button>
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
            <h3 className="mt-4 font-display text-2xl font-extrabold">Login demonstrativo ativo</h3>
            <p className="mt-2 text-sm text-ink-soft">{persisted ? "Seu cadastro foi enviado ao banco." : "Seu cadastro foi mantido no dispositivo enquanto o banco estiver indisponível."} A senha foi usada apenas para validar o fluxo e não é salva.</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink">Continuar</button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-accent">Acesso de teste</span>
              <h3 className="mt-3 font-display text-3xl font-extrabold">Entrar no Artistas do Bairro.</h3>
              <p className="mt-2 text-sm text-ink-soft">Use qualquer e-mail, número e senha para testar o login demonstrativo.</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold">Nome <span className="text-ink-soft">(opcional)</span></span><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-2xl border border-line bg-bg-soft px-4 py-3 outline-none focus:border-accent" placeholder="Seu nome" /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold">E-mail</span><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"/><input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-2xl border border-line bg-bg-soft py-3 pl-11 pr-4 outline-none focus:border-accent" placeholder="voce@email.com" /></div></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold">Telefone</span><div className="relative"><Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"/><input required value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full rounded-2xl border border-line bg-bg-soft py-3 pl-11 pr-4 outline-none focus:border-accent" placeholder="(41) 99999-9999" /></div></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold">Senha</span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"/><input required minLength={4} type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-2xl border border-line bg-bg-soft py-3 pl-11 pr-11 outline-none focus:border-accent" placeholder="••••••••"/><button type="button" onClick={()=>setShowPassword((v)=>!v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-accent">{showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button></div></label>
              {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className={cn("flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5", loading && "opacity-60")}>{loading ? "Entrando..." : <><LogIn className="h-4 w-4"/> Entrar</>}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
