import { useEffect } from "react";
import { X, FileText, ShieldCheck, Cookie } from "lucide-react";

type LegalKind = "terms" | "privacy" | "cookies";

interface Props {
  kind: LegalKind;
  onClose: () => void;
}

const CONTENT: Record<LegalKind, { title: string; icon: typeof FileText; sections: [string, string][] }> = {
  terms: {
    title: "Termos de uso",
    icon: FileText,
    sections: [
      ["Uso da plataforma", "O Artistas do Bairro é uma plataforma demonstrativa para descoberta e contato entre clientes e profissionais criativos. As informações dos perfis são exemplos e podem não representar pessoas reais."],
      ["Contratação", "Solicitações de orçamento iniciam uma conversa; valores, prazos e condições devem ser combinados entre as partes antes de qualquer contratação real."],
      ["Conteúdo", "Não publique conteúdo ilegal, enganoso, discriminatório ou que viole direitos de terceiros. Podemos remover materiais que infrinjam estas regras."],
    ],
  },
  privacy: {
    title: "Privacidade",
    icon: ShieldCheck,
    sections: [
      ["Dados coletados", "Nos fluxos demonstrativos, podemos receber nome, e-mail, telefone e mensagens enviadas por você. A senha do login demonstrativo não é enviada ao banco."],
      ["Finalidade", "Usamos os dados para testar cadastro, pedidos de orçamento e inscrição na newsletter. Não usamos a senha demonstrativa para autenticação real."],
      ["Controle", "Como este é um ambiente demonstrativo, evite inserir dados pessoais que você não queira usar em um protótipo público."],
    ],
  },
  cookies: {
    title: "Cookies e armazenamento local",
    icon: Cookie,
    sections: [
      ["Armazenamento local", "O site usa localStorage para favoritos, sessão demonstrativa e dados pendentes quando uma integração externa está temporariamente indisponível."],
      ["Preferências", "O tema claro/escuro e algumas preferências de navegação podem permanecer salvos no dispositivo para melhorar a próxima visita."],
      ["Sem rastreamento invasivo", "Não adicionamos ferramentas de publicidade comportamental ao protótipo. Links de redes sociais só abrem os sites externos correspondentes."],
    ],
  },
};

export function LegalModal({ kind, onClose }: Props) {
  const data = CONTENT[kind];
  const Icon = data.icon;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#07060b]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={data.title}>
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <article className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent"><Icon className="h-5 w-5" /></span>
            <div>
              <p className="eyebrow text-accent">Artistas do Bairro</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">{data.title}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-8 space-y-6">
          {data.sections.map(([heading, text]) => (
            <section key={heading}>
              <h3 className="font-display text-lg font-bold">{heading}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{text}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 border-t border-line pt-5 text-xs text-ink-soft">Documento demonstrativo · conteúdo sujeito a revisão antes de uso jurídico em produção.</p>
      </article>
    </div>
  );
}
