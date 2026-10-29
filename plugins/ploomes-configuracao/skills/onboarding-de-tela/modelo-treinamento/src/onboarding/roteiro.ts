import type { Roteiro } from './kit';

/*
 * O onboarding do kit por cima do bloco do mapa da jornada: o que a pessoa vê na primeira vez que abre o mapa.
 * O simulador de cada funil tem a própria dica com holofote (FunilSimulador.tsx); este roteiro só
 * apresenta o mapa. Escreva no vocabulário de quem vai treinar, e suba `versao` (com `desde` no passo)
 * quando um passo entrar ou mudar de sentido.
 */
export const roteiro: Roteiro = {
  tela: 'mapa-da-jornada',
  versao: '1',
  nome: 'Onboarding no Ploomes',
  boasVindas: [
    { icone: 'mapa', titulo: 'O seu processo no Ploomes', texto: 'Aqui você vê todos os funis do seu trabalho e para onde o cliente vai depois de cada um.' },
    { icone: 'ficha', titulo: 'Treine sem medo', texto: 'Cada funil abre igual ao do Ploomes, com um card de exemplo. Nada do que você fizer aqui é gravado.' },
    { icone: 'alvo', titulo: 'Um funil de cada vez', texto: 'Escolha um funil, abra o card e siga as dicas até ganhar. O seu progresso fica marcado no mapa.' },
  ],
  tour: [
    { id: 'mapa', alvo: 'mapa', rota: '/', titulo: 'O mapa da jornada', texto: 'Cada coluna é uma fase do processo, e cada cartão é um funil. As setas mostram para onde o negócio vai.' },
    { id: 'primeiro-funil', alvo: 'primeiro-funil', rota: '/', titulo: 'Comece por aqui', texto: 'Clique num funil para abrir a simulação.', experimente: 'Passe o mouse num funil para ver de onde ele recebe e para onde envia.' },
    { id: 'progresso', alvo: 'progresso', rota: '/', titulo: 'Seu progresso', texto: 'Cada funil simulado até o fim conta aqui.' },
  ],
  primeirosPassos: [],
  dicas: {},
};
