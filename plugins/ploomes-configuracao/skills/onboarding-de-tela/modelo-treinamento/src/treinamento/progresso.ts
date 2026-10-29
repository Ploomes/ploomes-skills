/**
 * O progresso do onboarding e o registro no cadastro do Usuário.
 *
 * O progresso — quais funis a pessoa já simulou até o fim e a trilha que ela escolheu — fica no navegador dela
 * (localStorage), por tela e por usuário do Ploomes: duas pessoas no mesmo computador não se misturam. Toda leitura e
 * escrita vai em try/catch: em aba anônima ou com o armazenamento bloqueado, a tela funciona igual, só sem lembrar.
 *
 * O registro (regra 11 da skill onboarding-de-tela) é o do kit (onboarding/kit/registro.ts): vai ao flow do Ploomes
 * Flows, que grava os quatro campos do Usuário com a chave de integração — a tela nunca grava no Usuário:
 *   abriu    — uma vez por sessão, quando a pessoa abre a tela;
 *   concluiu — quando ela simula até o fim o último funil que faltava no caminho dela (a trilha escolhida; sem trilha,
 *              todos os funis do mapa). "Recomeçar" abre uma rodada nova, e concluir de novo soma no Usuário.
 */
import { useCallback, useEffect, useState } from 'react';
import { usePloomesBridge } from '../lib';
import { registrar, useRegistroDaAbertura as useRegistroDoKit } from '../onboarding/kit';
import { FASES, TELA, TRILHAS, WEBHOOK_DO_REGISTRO } from './jornada';

const chave = (usuario: number, o: string) => `treinamento:${TELA}:${usuario}:${o}`;

function ler(usuario: number): number[] {
  try {
    const bruto = window.localStorage.getItem(chave(usuario, 'concluidos'));
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

function gravar(usuario: number, lista: number[]): void {
  try {
    if (lista.length) window.localStorage.setItem(chave(usuario, 'concluidos'), JSON.stringify(lista));
    else window.localStorage.removeItem(chave(usuario, 'concluidos'));
  } catch {
    // sem armazenamento: segue sem lembrar
  }
}

function lerTrilha(usuario: number): string | null {
  try {
    const id = window.localStorage.getItem(chave(usuario, 'trilha'));
    return TRILHAS.some((t) => t.id === id) ? id : null;
  } catch {
    return null;
  }
}

function gravarTrilha(usuario: number, id: string | null): void {
  try {
    if (id) window.localStorage.setItem(chave(usuario, 'trilha'), id);
    else window.localStorage.removeItem(chave(usuario, 'trilha'));
  } catch {
    // sem armazenamento: segue sem lembrar
  }
}

/** Os funis do caminho de quem usa: os da trilha escolhida, ou todos os do mapa. */
export function funisDoCaminho(trilhaId: string | null): number[] {
  const todos = FASES.flatMap((f) => f.funis);
  const trilha = TRILHAS.find((t) => t.id === trilhaId);
  return trilha ? todos.filter((id) => trilha.funis.includes(id)) : todos;
}

// ------------------------------------------------------------------ o registro no Usuário, pelo flow (o do kit)

/** `abriu`, uma vez por sessão do navegador, quando a ponte diz quem é a pessoa. */
export function useRegistroDaAbertura(): void {
  const { config, isLoading } = usePloomesBridge();
  useRegistroDoKit({ webhook: WEBHOOK_DO_REGISTRO, tela: TELA, usuarioId: config?.userId, pronto: !isLoading });
}

// ------------------------------------------------------------------ o progresso

/** Os funis concluídos e a trilha de quem está usando a tela, e como marcar, escolher a trilha e recomeçar. */
export function useProgresso() {
  const { config } = usePloomesBridge();
  const usuario = config?.userId ?? 0;
  const [concluidos, setConcluidos] = useState<number[]>(() => ler(usuario));
  const [trilha, setTrilha] = useState<string | null>(() => lerTrilha(usuario));
  // o usuário chega pela ponte depois do primeiro desenho: relê quando ele muda
  useEffect(() => { setConcluidos(ler(usuario)); setTrilha(lerTrilha(usuario)); }, [usuario]);
  const marcar = useCallback((funilId: number) => {
    const antes = ler(usuario);
    const novo = [...new Set([...antes, funilId])];
    gravar(usuario, novo);
    setConcluidos(novo);
    const caminho = funisDoCaminho(lerTrilha(usuario));
    const fechou = (lista: number[]) => caminho.length > 0 && caminho.every((id) => lista.includes(id));
    if (!fechou(antes) && fechou(novo)) registrar({ webhook: WEBHOOK_DO_REGISTRO, tela: TELA, usuarioId: usuario, evento: 'concluiu' });
  }, [usuario]);
  const escolherTrilha = useCallback((id: string | null) => { gravarTrilha(usuario, id); setTrilha(lerTrilha(usuario)); }, [usuario]);
  const recomecar = useCallback(() => { gravar(usuario, []); setConcluidos([]); }, [usuario]);
  return { concluidos, trilha, marcar, escolherTrilha, recomecar };
}
