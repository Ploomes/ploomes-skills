// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// Ícones em SVG embutido: o kit não depende de biblioteca de ícone, nem da lucide-react que o construtor tem. Cor: currentColor.
import type { CartaoDeBoasVindas } from './tipos';

const CAMINHOS: Record<NonNullable<CartaoDeBoasVindas['icone']> | 'ajuda' | 'fechar' | 'check' | 'seta', string> = {
  mapa: 'M4 6h5v5H4zM15 6h5v5h-5zM9.5 17h5v3h-5zM6.5 11v3h11v-3M12 14v3',
  lista: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  grafico: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  ficha: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  filtro: 'M3 5h18l-7 8v6l-4 2v-8z',
  editar: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  salvar: 'M5 3h11l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7',
  conversa: 'M4 5h16v11H9l-5 4z',
  alvo: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 11.5v1',
  ajuda: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01',
  fechar: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  seta: 'M9 6l6 6l-6 6',
};

export function Icone(p: { nome: keyof typeof CAMINHOS; tamanho?: number; className?: string }) {
  const t = p.tamanho ?? 20;
  return (
    <svg width={t} height={t} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d={CAMINHOS[p.nome]} />
    </svg>
  );
}
