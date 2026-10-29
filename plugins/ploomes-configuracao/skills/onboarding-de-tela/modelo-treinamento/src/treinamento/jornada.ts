import { RETRATO } from './dados';
import type { Funil, Transicao } from './tipos';

/*
 * A JORNADA — a única parte do bloco "mapa da jornada e simulador" escrita à mão, a partir do to-be do cliente.
 * O resto (funis, etapas, checklists, automações, passagens) vem do retrato da conta, em dados.ts,
 * que o gerar_dados.py gera e ninguém edita. A skill onboarding-de-tela escreve este arquivo com
 * quem pede: as fases do processo, as trilhas por papel e o roteiro de cada etapa, no vocabulário de quem usa.
 *
 * Sem edição ele já funciona: uma fase com todos os funis, sem trilha e sem roteiro.
 */

/** Identificador da tela: entra na chave do progresso de cada pessoa e vai em `tela` no evento do registro.
 *  Não mude depois de publicar. */
export const TELA = 'mapa-da-jornada';

/**
 * O registro no cadastro do Usuário (regra 11 da skill): a URL do webhook do flow do Ploomes Flows que grava os quatro
 * campos do onboarding com a chave de integração. A tela manda `abriu` quando a pessoa abre e `concluiu` quando ela
 * simula até o fim todos os funis do caminho dela. null enquanto o flow não existe: a tela não registra nada, e a
 * conferência avisa. Nunca a URL da bancada (localhost) numa versão que sobe.
 */
export const WEBHOOK_DO_REGISTRO: string | null = null;

/** O que o topo do mapa diz. */
export const TITULO = 'Como o cliente anda pelos funis';
export const SOBRETITULO = 'Onboarding no Ploomes';
export const APRESENTACAO =
  'Cada cartão é um funil do Ploomes, e as setas mostram para onde o negócio vai quando avança. '
  + 'Clique num funil para simular, etapa por etapa, o que você preenche e o que o Ploomes faz sozinho.';

/** O nome do card de exemplo no simulador — um cliente fictício, no vocabulário do cliente ("PADARIA EXEMPLO"). */
export const CARD_EXEMPLO = 'CLIENTE EXEMPLO';

/**
 * As fases do processo comercial (to-be), da esquerda para a direita. Cada fase lista os funis dela
 * pelo Id do Ploomes. O desenho do mapa sai daqui. Funil fora de toda fase não aparece no mapa — a
 * conferência (conferir_onboarding.py) avisa.
 */
export const FASES: { id: string; titulo: string; resumo: string; funis: number[] }[] = [
  { id: 'processo', titulo: 'O processo', resumo: 'Todos os funis da conta.', funis: RETRATO.funis.map((f) => f.id) },
];

/**
 * As trilhas por papel: cada papel vê em destaque só os funis em que trabalha, e o progresso conta
 * só esses. Vazio: uma trilha só, a de todos. Ex.: { id: 'hunter', nome: 'Hunter', funis: [123, 456] }.
 */
export const TRILHAS: { id: string; nome: string; funis: number[] }[] = [];

/**
 * O roteiro de cada funil, na linguagem de quem usa: o resumo do funil e, por etapa, quem faz, o que
 * fazer e o que acontece depois. Escrito a partir do que a conta configura (checklists, condições e
 * automações) e do to-be. Funil sem roteiro mostra só o que vem da conta.
 */
export interface RoteiroEtapa { quem: string; texto: string }
export interface Roteiro { resumo: string; cardExemplo?: string; etapas: Record<number, RoteiroEtapa> }
export const ROTEIROS: Record<number, Roteiro> = {};

/**
 * Passagem disparada por edição não tem etapa na conta. Aqui fica a etapa em que os campos da regra são
 * preenchidos, para o card aberto mostrar a passagem só nela. Sem entrada aqui, aparece em todas as etapas.
 * Chave: o Id da automação (Transicao.id). Valor: o Id da etapa.
 */
export const ETAPA_DA_EDICAO: Record<number, number> = {};

/**
 * Automação do funil sem etapa (dispara quando o card é atualizado): as etapas em que os campos dela são
 * preenchidos. Sem entrada aqui, ela não aparece no simulador — a conferência avisa.
 * Chave: o Id da automação. Valor: os Ids das etapas.
 */
export const ETAPA_DA_AUTOMACAO: Record<number, number[]> = {};

export const QUANDO_TEXTO: Record<Transicao['quando'], string> = {
  etapa: 'nesta etapa',
  ganho: 'quando é ganho',
  perda: 'quando é perdido',
  edicao: 'quando o card é preenchido',
};

export const FUNIS: Funil[] = RETRATO.funis;
export const TRANSICOES: Transicao[] = RETRATO.transicoes;

export const funilPorId = (id: number): Funil | undefined => FUNIS.find((f) => f.id === id);

/** "P6 · Nova loja: abre o Funil 1" → "Nova loja: abre o Funil 1": o prefixo é nome interno da automação, e a pessoa
 *  não lê código. */
export const semPrefixo = (texto: string): string => texto.replace(/^P\d+\s*[·–—-]\s*/, '');

/** Rótulo curto do funil: "1 · Prospecção de Novos Clientes". */
export const rotuloFunil = (f: Funil): string => (f.numero ? f.numero + ' · ' : '') + f.titulo;

export const nomeEtapa = (etapaId: number | null): string | null => {
  if (!etapaId) return null;
  for (const f of FUNIS) {
    const e = f.etapas.find((x) => x.id === etapaId);
    if (e) return e.nome;
  }
  return null;
};
