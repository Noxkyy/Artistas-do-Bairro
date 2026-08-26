import { cn } from "../../utils/cn";

/** Marca da plataforma: um prisma (luz → espectro criativo). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Prisma"
    >
      <defs>
        <linearGradient id="prismaG" x1="4" y1="34" x2="36" y2="6">
          <stop offset="0%" stopColor="#6a22e0" />
          <stop offset="48%" stopColor="#b14dff" />
          <stop offset="100%" stopColor="#ff6bd0" />
        </linearGradient>
      </defs>
      <path
        d="M20 3.4 36.4 33.2a1.6 1.6 0 0 1-1.4 2.4H5a1.6 1.6 0 0 1-1.4-2.4L20 3.4Z"
        fill="url(#prismaG)"
      />
      <path
        d="M20 12.5 27.6 27H12.4L20 12.5Z"
        fill="none"
        stroke="var(--c-bg)"
        strokeOpacity="0.75"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="23.2" r="2.1" fill="var(--c-bg)" fillOpacity="0.9" />
    </svg>
  );
}

/** Avaliação em estrelas com preenchimento proporcional à nota. */
export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-[2px]", className)}
      aria-label={`Nota ${rating} de 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ink-soft/30" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="text-star fill-star" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Star({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3.6 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 17l-5.25 2.75 1-5.85L3.5 9.75l5.9-.85L12 3.6Z" />
    </svg>
  );
}

/** Selo "verificado" */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent",
        className
      )}
      title="Perfil verificado pela Prisma"
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
        <path d="M12 1.8 14.6 4l3.3-.3.7 3.2 2.8 1.8-1.5 3 1.5 3-2.8 1.8-.7 3.2-3.3-.3L12 22.2 9.4 20l-3.3.3-.7-3.2L2.6 15.3l1.5-3-1.5-3 2.8-1.8.7-3.2L9.4 4 12 1.8Zm-1.1 13.5 5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3Z" />
      </svg>
      Verificado
    </span>
  );
}
