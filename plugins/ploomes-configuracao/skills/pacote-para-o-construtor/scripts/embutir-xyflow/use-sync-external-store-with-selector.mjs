// ESM de `use-sync-external-store/shim/with-selector`, para o React Flow embutido.
//
// O pacote original só existe em CommonJS e chama require("react") ao carregar: compilado com o
// React externo, isso vira um require dinâmico que o navegador não tem, e a tela fica em branco
// (achado em 2026-10-20, no mapa do processo). Esta cópia faz o mesmo, importando o React como ESM.
// A lógica é a do pacote original (use-sync-external-store 1.7.0, MIT, Copyright (c) Meta Platforms,
// Inc. and affiliates — a licença vai no LICENCAS.txt do vendor). O React 18+ já traz
// useSyncExternalStore; só o "with selector" é daqui.
import { useSyncExternalStore, useRef, useEffect, useMemo, useDebugValue } from 'react';

const igual = typeof Object.is === 'function' ? Object.is : (a, b) => (a === b && (a !== 0 || 1 / a === 1 / b)) || (a !== a && b !== b);

export function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  const instRef = useRef(null);
  let inst;
  if (instRef.current === null) {
    inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else {
    inst = instRef.current;
  }
  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot;
    let memoizedSelection;
    const memoizedSelector = (nextSnapshot) => {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);
        if (isEqual !== undefined && inst.hasValue) {
          const currentSelection = inst.value;
          if (isEqual(currentSelection, nextSelection)) {
            memoizedSelection = currentSelection;
            return currentSelection;
          }
        }
        memoizedSelection = nextSelection;
        return nextSelection;
      }
      const prevSelection = memoizedSelection;
      if (igual(memoizedSnapshot, nextSnapshot)) return prevSelection;
      const nextSelection = selector(nextSnapshot);
      if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        return prevSelection;
      }
      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    };
    const maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot;
    return [
      () => memoizedSelector(getSnapshot()),
      maybeGetServerSnapshot === null ? undefined : () => memoizedSelector(maybeGetServerSnapshot()),
    ];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]);
  const value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
  useEffect(() => {
    inst.hasValue = true;
    inst.value = value;
  }, [value]);
  useDebugValue(value);
  return value;
}

export default { useSyncExternalStoreWithSelector };
