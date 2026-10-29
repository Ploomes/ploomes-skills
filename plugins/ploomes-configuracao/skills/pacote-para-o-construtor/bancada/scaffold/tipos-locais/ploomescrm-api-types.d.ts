// SÓ PARA O BUILD LOCAL. O construtor tem o pacote real `@ploomescrm/api-types`, que não está no
// npm público. A base usa dele só três TIPOS (somem no build), por isso um substituto basta aqui.
// ⛔ Não vai no zip de importação, e a tela não deve importar nada além destes três nomes.
declare module '@ploomescrm/api-types' {
  import type { NavigatePayload } from '@ploomescrm/bridge';
  /** Rota do catálogo de telas do CRM. O catálogo real não é público: aqui é qualquer string. */
  export type ModuleNavigationRoute = string;
  /** Destino de navegação: rota do catálogo (tela do CRM) ou rota interna do módulo. */
  export type ModuleNavigateTarget = string;
  export type ModuleNavigateRequest = NavigatePayload<ModuleNavigateTarget>;
}
