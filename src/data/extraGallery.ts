import type { Artist } from "./artists";

/** Expande cada portfólio com mais trabalhos para a vitrine. */
export const EXTRA_GALLERY: Record<string, Artist["gallery"]> = {
  "marina-duarte": [
    { src: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Luz de fim de tarde" },
    { src: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Detalhes do casamento" },
    { src: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Retrato documental" },
  ],
  "rafael-nunes": [
    { src: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Editorial de estúdio" },
    { src: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Campanha urbana" },
    { src: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Retrato editorial" },
  ],
  "diego-marques": [
    { src: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Arquitetura aérea" },
    { src: "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Vista de empreendimento" },
    { src: "https://images.pexels.com/photos/534164/pexels-photo-534164.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Paisagem em movimento" },
  ],
  "beatriz-lopes": [
    { src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Aplicação de identidade" },
    { src: "https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Editorial de marca" },
    { src: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800", caption: "Peças para campanha" },
  ],
};
