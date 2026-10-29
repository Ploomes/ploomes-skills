# Carrega a User-Key da conta de TESTE em $env:PLOOMES_USER_KEY, só neste processo, sem mostrar.
# Ordem: a chave guardada por guardar-chave.ps1 (DPAPI) ou, se não houver, pergunta.
# Uso: . "$PSScriptRoot\chave.ps1"   (depois, Limpar-Chave)
$arquivoChave = Join-Path $env:USERPROFILE '.ploomes-bancada\chave-conta-teste.dpapi'

function Carregar-Chave {
  if (Test-Path $arquivoChave) {
    $segura = Get-Content $arquivoChave | ConvertTo-SecureString
    $origem = 'guardada (DPAPI)'
  } else {
    Write-Host 'Copie a User-Key da conta de TESTE (Ctrl+C) e aperte Enter.' -ForegroundColor Yellow
    Write-Host '(Para não perguntar mais: rode guardar-chave.ps1.)' -ForegroundColor DarkGray
    $segura = Read-Host 'Enter para ler da área de transferência' -AsSecureString
    $origem = 'digitada'
  }
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)
  try { $chave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
  if (@($chave.ToCharArray() | Where-Object { [int]$_ -gt 32 }).Count -eq 0) {
    $chave = [string](Get-Clipboard -Raw); Set-Clipboard -Value ' '; $origem = 'área de transferência (apagada de lá)'
  }
  $chave = $chave.Trim().Trim('"', "'")
  $ruins = @($chave.ToCharArray() | Where-Object { [int]$_ -lt 33 -or [int]$_ -gt 126 })
  if ($chave.Length -eq 0) { throw 'A chave veio vazia.' }
  if ($ruins.Count) { throw "A chave tem $($ruins.Count) caractere(s) inválido(s) ($((($ruins | ForEach-Object { 'U+{0:X4}' -f [int]$_ }) -join ', '))). Copie de novo." }
  $env:PLOOMES_USER_KEY = $chave
  Write-Host "Chave $origem`: $($chave.Length) caracteres, formato ok." -ForegroundColor DarkGray
}

function Limpar-Chave { Remove-Item Env:PLOOMES_USER_KEY -ErrorAction SilentlyContinue }
