import type { HostConfig, ModuleScreenRequest } from '../types';
import { createContext } from 'react';

export interface IPloomesContextValue {
  config: HostConfig;
  navigate: (request: ModuleScreenRequest) => void;
}

export const PloomesContext = createContext<IPloomesContextValue | null>(null);
