# Sobe a bancada no modo API real: a tela roda no CRM falso contra a conta de TESTE. SÓ LEITURA,
# salvo -PermitirEscrita (só com autorização de quem pede a tela, só em negócio de teste).
#   powershell -ExecutionPolicy Bypass -File rodar-tela-api-real.ps1 -Tela <pasta dist da tela>
param(
  [Parameter(Mandatory)] [string] $Tela,
  [string] $ApiUrl = 'https://public-api2.ploomes.com/',
  [switch] $PermitirEscrita
)
$ErrorActionPreference = 'Stop'
$aqui = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $aqui 'chave.ps1')
$servidor = Join-Path $aqui '..\servidor.mjs'
try {
  Carregar-Chave
  $extra = @(); if ($PermitirEscrita) { $extra = @('--permitir-escrita'); Write-Host 'ATENÇÃO: escrita permitida.' -ForegroundColor Red }
  Write-Host 'Bancada no modo API real. Abra http://localhost:8780/ — Ctrl+C para parar.' -ForegroundColor Cyan
  node --use-system-ca $servidor --api-real $ApiUrl --tela $Tela @extra
} finally {
  Limpar-Chave
}
