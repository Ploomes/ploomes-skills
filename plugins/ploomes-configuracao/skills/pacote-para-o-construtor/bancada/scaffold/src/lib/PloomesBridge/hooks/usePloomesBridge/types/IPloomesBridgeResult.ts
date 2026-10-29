import type { HostConfig, ModuleScreenRequest } from '../../../types';

export type IPloomesBridgeResult =
  | { isLoading: true; config: null; navigate: null }
  | {
      isLoading: false;
      config: HostConfig;
      navigate: (request: ModuleScreenRequest) => void;
    };
