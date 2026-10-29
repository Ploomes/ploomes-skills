// Formato do retrato da conta que alimenta o simulador de funil. O dados.ts com este formato é
// GERADO pelo gerar_dados.py da skill onboarding-de-tela, a partir do retrato da conta. Não edite à mão.

export interface Campo {
  nome: string;
  /** O campo de verdade (FieldKey). Dois itens com o mesmo rótulo podem ser campos diferentes. */
  chave: string;
  obrigatorio: boolean;
  /** Campo Sim/Não do Ploomes (TypeId 10): no checklist é uma caixa de marcar ("Sim" = marcada). */
  caixa?: boolean;
  /** Opções reais do campo de lista (TypeId 7), na ordem da conta. */
  opcoes?: string[];
}

/** Uma regra do filtro do checklist: o campo tem (ou, com negar, não tem) um dos valores. */
export interface Regra {
  chave: string;
  valores: string[];
  negar: boolean;
}

export interface Checklist {
  nome: string;
  /** Quando o checklist vale, em português ("Visita realizada? = Sim"); null = vale sempre. */
  condicao: string | null;
  /** As regras do filtro, lidas da Url dele, todas juntas (E). Vazio com condição = o filtro não se liga a campo:
   *  a tela oferece "simular este caso". */
  regras: Regra[];
  campos: Campo[];
}

export interface Automacao {
  id: number;
  nome: string;
  /** Quando dispara: "entra na etapa", "é editado na etapa", "é ganho"… */
  quando: string;
  /** O que ela faz: "Cria tarefa", "Envia e-mail", "Abre negócio em outro funil"… */
  acoes: string[];
  /** Títulos das tarefas que ela cria, como chegam ao usuário. */
  tarefas: string[];
  /** Campos que ela grava (FieldKey -> valor). */
  preenche: Record<string, string>;
}

export interface Etapa {
  id: number;
  nome: string;
  checklists: Checklist[];
  automacoes: Automacao[];
}

export interface Funil {
  id: number;
  nome: string;
  /** Nome sem o número do começo ("Prospecção de Novos Clientes"). */
  titulo: string;
  /** Número do funil quando o nome começa com "N." na conta; null sem número. */
  numero: number | null;
  /** Como o card se chama nesse funil ("Oportunidade", "Chamado"…). */
  unidade: string;
  unidadePlural: string;
  cor: string;
  ganhaNaUltima: boolean;
  podeGanhar: boolean;
  podePerder: boolean;
  etapas: Etapa[];
  /** Automações do funil sem etapa (disparam quando o card é atualizado). Aparecem só nas etapas que o
   *  jornada.ts liga a elas (ETAPA_DA_AUTOMACAO). */
  automacoesSemEtapa: Automacao[];
  /** O que o Ploomes faz sozinho no ganho ou na perda, além de abrir outro funil. */
  aoFinal: { quando: 'ganho' | 'perda'; nome: string }[];
}

/** Uma automação que leva o negócio (ou cria um novo) de um funil para outro. */
export interface Transicao {
  id: number;
  de: number;
  /** Etapa de origem; null quando dispara no ganho, na perda ou numa edição do funil. */
  deEtapa: number | null;
  quando: 'etapa' | 'ganho' | 'perda' | 'edicao';
  para: number;
  paraEtapa: number | null;
  /** A regra, em português, como está no nome da automação. */
  regra: string;
}

export interface Retrato {
  /** Data do retrato (dd/mm/aaaa): a tela mostra, para ninguém treinar numa conta velha sem saber. */
  retratoEm: string;
  conta: string;
  funis: Funil[];
  transicoes: Transicao[];
}
