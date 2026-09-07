import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, X } from "lucide-react";
import { getProfile, signIn, signUp } from "../lib/auth";

export function AuthModal({
  open,
  mode,
  onClose,
  onSuccess,
}: {
  open: boolean;
  mode: "user" | "artist";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setRegister(false);
    setShow(false);
  }, [open, mode]);

  if (!open) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (register) {
        await signUp(email, password, name, phone);
        onSuccess();
        return;
      }

      await signIn(email, password);

      if (mode === "artist") {
        const profile = await getProfile();
        const artist = profile?.artist_profiles?.[0];

        if (!artist) {
          throw new Error("Esta conta ainda não possui um perfil de artista.");
        }

        if (artist.status !== "approved") {
          throw new Error(
            `Seu perfil de artista está ${artist.status}. Aguarde a aprovação.`
          );
        }
      }

      onSuccess();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      const normalized = raw.toLowerCase();

      if (
        normalized.includes("email") &&
        (normalized.includes("rate limit") || normalized.includes("too many emails"))
      ) {
        setError(
          "O serviço de e-mail atingiu o limite temporário de cadastros. Aguarde um pouco e tente novamente."
        );
      } else {
        setError(raw || "Não foi possível concluir o acesso.");
      }
    } finally {
      setBusy(false);
    }
  };

  const toggleRegister = () => {
    if (mode === "artist") return;
    setError("");
    setRegister((value) => !value);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Fechar"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 pr-8">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
            {mode === "artist" ? "Área do artista" : "Minha conta"}
          </span>

          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {mode === "artist" ? "Entrar como artista" : register ? "Criar conta" : "Entrar"}
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            {mode === "artist"
              ? "Apenas artistas com perfil aprovado podem acessar esta área."
              : "Sua conta guarda seus dados, favoritos e solicitações."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {register && mode === "user" && (
            <>
              <label className="block text-xs font-semibold">
                Nome
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-line bg-bg-soft px-4 py-3"
                />
              </label>

              <label className="block text-xs font-semibold">
                Telefone
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-line bg-bg-soft px-4 py-3"
                />
              </label>
            </>
          )}

          <label className="block text-xs font-semibold">
            E-mail
            <div className="relative mt-1.5">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg-soft py-3 pl-11 pr-4"
              />
            </div>
          </label>

          <label className="block text-xs font-semibold">
            Senha
            <div className="relative mt-1.5">
              <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft" />
              <input
                required
                minLength={6}
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg-soft py-3 pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                className="absolute right-3 top-3.5"
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-red-500/10 p-3 text-xs font-semibold text-red-500">
              {error}
            </p>
          )}

          <button
            disabled={busy}
            className="w-full rounded-2xl bg-accent px-5 py-3.5 font-bold text-accent-ink disabled:opacity-50"
          >
            {busy ? "Aguarde..." : register ? "Criar minha conta" : "Entrar"}
          </button>
        </form>

        {mode === "user" ? (
          <button
            onClick={toggleRegister}
            className="mt-4 w-full text-center text-sm font-semibold text-accent"
          >
            {register ? "Já tenho uma conta" : "Ainda não tenho uma conta"}
          </button>
        ) : (
          <p className="mt-4 text-center text-xs text-ink-soft">
            O cadastro de artista não é feito por esta tela.
          </p>
        )}
      </div>
    </div>
  );
}
