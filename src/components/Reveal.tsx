import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Atraso da animação em ms (para efeitos escalonados) */
  delay?: number;
  /** Distância vertical inicial em px */
  y?: number;
  /** Distância horizontal inicial em px */
  x?: number;
  /** Escala inicial */
  scale?: number;
  as?: ElementType;
  style?: React.CSSProperties;
}

/**
 * Envolve o conteúdo e dispara um fade-in + slide-up
 * assim que o elemento entra na viewport (IntersectionObserver).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  as: Tag = "div",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Sem suporte a IO → mostra direto
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -70px 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition:
          "opacity 780ms cubic-bezier(.22,1,.36,1), transform 780ms cubic-bezier(.22,1,.36,1)",
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
