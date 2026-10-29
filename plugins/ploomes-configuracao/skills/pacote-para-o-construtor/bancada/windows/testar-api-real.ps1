# Teste de fumaça do api.ts de um pacote contra a conta de TESTE, pela API real. SÓ LEITURA.
#   powershell -ExecutionPolicy Bypass -File testar-api-real.ps1 -Pacote <pasta pacote-construtor> [-DealId <negócio>]
# A chave vem de guardar-chave.ps1 (DPAPI) ou é pedida; nunca vai para arquivo nem para a saída.
param(
  [Parameter(Mandatory)] [string] $Pacote,
  [string] $DealId = '',
  [string] $ApiUrl = 'https://public-api2.ploomes.com/'
)
$ErrorActionPreference = 'Stop'
$aqui = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $aqui 'chave.ps1')
$teste = Join-Path $aqui '..\..\scripts\testar_na_conta.ts'
$saida = Join-Path $Pacote 'resultado-teste-api-real.txt'
try {
  Carregar-Chave
  $env:PLOOMES_API_URL = $ApiUrl
  if ($DealId) { $env:PLOOMES_DEAL_ID = $DealId }
  $r = node --use-system-ca $teste $Pacote 2>&1 | Out-String
  Write-Host $r
  [IO.File]::WriteAllText($saida, $r, (New-Object Text.UTF8Encoding $false))
  Write-Host "Resultado salvo em $saida (sem a chave)." -ForegroundColor Cyan
} finally {
  Limpar-Chave
  Remove-Item Env:PLOOMES_API_URL, Env:PLOOMES_DEAL_ID -ErrorAction SilentlyContinue
}
