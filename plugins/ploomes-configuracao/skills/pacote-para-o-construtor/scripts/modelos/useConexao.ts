// GERADO por gerar_api.py — NÃO EDITE. Liga a camada de dados (api.ts) à ponte do construtor.
//
// Use uma vez, no topo da tela:
//   const conexao = useConexao();
//   if (conexao.fase === 'conectando') return <Carregando />;
//   if (conexao.fase === 'erro') return <ErroDeConfiguracao faltando={conexao.faltando} mensagem={conexao.mensagem} aoTentar={conexao.tentarDeNovo} />;
//   … daqui para baixo, as funções do api.ts já podem ser chamadas.
import { useCallback, useEffect, useState } from 'react';
import { usePloomesBridge } from '../lib';
import { configurar, iniciar, ErroConfiguracao } from './api';

export type EstadoDaConexao =
  | { fase: 'conectando' }
  | { fase: 'pronta' }
  | { fase: 'erro'; mensagem: string; faltando: string[] };

export function useConexao(): EstadoDaConexao & { tentarDeNovo: () => void } {
  const { isLoading, config } = usePloomesBridge();
  const [estado, setEstado] = useState<EstadoDaConexao>({ fase: 'conectando' });
  const [tentativa, setTentativa] = useState(0);
  const conectado = !isLoading && config !== null;

  // A userKey chega pela config do host e PODE SER RENOVADA (o onConfig roda de novo):
  // reconfigura a cada config nova, sem reiniciar a tela.
  useEffect(() => {
    if (!isLoading && config) {
      configurar({ apiUrl: config.apiUrls.apiUrl, userKey: config.userKey, userId: config.userId });
    }
  }, [isLoading, config]);

  // Resolve funis, etapas, modelos e opções pelo nome — uma vez por conexão (ou por "tentar de novo").
  useEffect(() => {
    if (!conectado) return;
    let vivo = true;
    setEstado({ fase: 'conectando' });
    iniciar()
      .then(() => { if (vivo) setEstado({ fase: 'pronta' }); })
      .catch((e: unknown) => {
        if (!vivo) return;
        setEstado({
          fase: 'erro',
          mensagem: e instanceof Error ? e.message : String(e),
          faltando: e instanceof ErroConfiguracao ? e.faltando : [],
        });
      });
    return () => { vivo = false; };
  }, [conectado, tentativa]);

  const tentarDeNovo = useCallback(() => setTentativa((n) => n + 1), []);
  return { ...estado, tentarDeNovo };
}
