import type { IPloomesBridgeResult } from './types';
import { useContext } from 'react';
import { PloomesContext } from '../../context';

export const usePloomesBridge = (): IPloomesBridgeResult => {
  const value = useContext(PloomesContext);
  if (value === null) return { isLoading: true, config: null, navigate: null };

  return { isLoading: false, config: value.config, navigate: value.navigate };
};
