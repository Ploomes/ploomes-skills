// Kit de onboarding da onboarding-de-tela — NÃO EDITE nesta tela: é cópia de kit/ da skill
// (o empacotador confere). A tela escreve só o roteiro (src/onboarding/roteiro.ts) e marca os
// alvos com data-onboarding="<id>". Todo campo novo é opcional: roteiro de versão anterior compila igual.

/** O que pode ser limitado a um perfil de quem usa ("vendedor", "gestor"). Sem `perfis`, vale para todos. */
type PorPerfil = {
  /** Perfis que veem este item. Vazio ou ausente: todos. O perfil de quem usa vem do OnboardingProvider. */
  perfis?: string[];
};

/** Um cartão das boas-vindas (aparecem uma vez, na primeira vez que a pessoa abre a tela). */
export type CartaoDeBoasVindas = PorPerfil & {
  titulo: string;
  texto: string;
  /** Ícone do cartão: um dos desenhos do kit. */
  icone?: 'mapa' | 'lista' | 'grafico' | 'ficha' | 'filtro' | 'editar' | 'salvar' | 'conversa' | 'alvo';
};

/** Um passo do tour guiado: realça um elemento real da tela e explica o que ele faz. */
export type PassoDoTour = PorPerfil & {
  id: string;
  /** Valor do atributo data-onboarding do elemento. Sem alvo, o cartão aparece no centro. */
  alvo?: string;
  /** Rota onde o alvo está. O tour navega até ela antes de mostrar o passo. */
  rota?: string;
  /** A parte da tela a que o passo pertence (uma aba, uma seção): a chave de `Roteiro.partes`.
   *  Com ela, o menu de ajuda oferece "Tour desta parte" na rota em que a pessoa está. */
  parte?: string;
  titulo: string;
  texto: string;
  /** O que a pessoa pode fazer ali, em uma frase curta ("Clique numa etapa para ver os negócios"). */
  experimente?: string;
  /** Lado preferido do cartão; "auto" escolhe o lado com mais espaço. */
  lado?: 'auto' | 'cima' | 'baixo' | 'esquerda' | 'direita';
  /** A versão do roteiro em que este passo entrou ou mudou de sentido. Quem já viu uma versão anterior
   *  recebe "O que há de novo" com os passos de `desde` maior que a última que viu. */
  desde?: string;
};

/** Uma tarefa dos primeiros passos: a tela marca como feita com marcar(id) quando a pessoa faz. */
export type TarefaDosPrimeirosPassos = PorPerfil & {
  id: string;
  titulo: string;
  texto?: string;
  /** Rota para onde o item leva ao ser clicado. */
  rota?: string;
  /** Alvo realçado depois de navegar (data-onboarding). */
  alvo?: string;
  /** Versão em que a tarefa entrou (entra também no "O que há de novo"). */
  desde?: string;
};

/** Dica contextual: o "?" ao lado de um rótulo abre esta explicação curta. */
export type Dica = { titulo: string; texto: string };

export type Roteiro = {
  /** Identificador da tela (o slug do contrato). Entra na chave do que a pessoa já viu. */
  tela: string;
  /** Número da versão do roteiro ("1", "2"…). Suba quando um passo entrar ou mudar de sentido, e marque
   *  esse passo com `desde`: quem já viu recebe só o que há de novo, não a apresentação inteira. */
  versao: string;
  /** Nome da tela, no vocabulário do cliente ("Mapa do processo comercial"). */
  nome: string;
  boasVindas: CartaoDeBoasVindas[];
  tour: PassoDoTour[];
  primeirosPassos: TarefaDosPrimeirosPassos[];
  dicas: Record<string, Dica>;
  /** Nome de cada parte da tela (a chave é o `parte` dos passos): { contratos: 'aba Contratos' }. */
  partes?: Record<string, string>;
  /** Uma frase por versão, para o cartão "O que há de novo": { '2': 'A aba Contratos chegou.' }. */
  notasDaVersao?: Record<string, string>;
};

/** O que fica guardado por pessoa e por tela (localStorage, com try/catch: é conveniência). */
export type Progresso = {
  viuBoasVindas: boolean;
  terminouTour: boolean;
  feitas: string[];
  /** A última versão do roteiro que a pessoa viu — é contra ela que se calcula o que há de novo. */
  versaoVista?: string;
};
