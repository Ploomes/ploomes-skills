# Guarda a User-Key da conta de TESTE, criptografada com o DPAPI do Windows: só o SEU usuário, nesta
# máquina, consegue abrir. Os scripts de teste leem daqui; ninguém vê o valor, nem o Claude.
# Para apagar: rode apagar-chave.ps1.
$ErrorActionPreference = 'Stop'
$pasta = Join-Path $env:USERPROFILE '.ploomes-bancada'
$arquivo = Join-Path $pasta 'chave-conta-teste.dpapi'
New-Item -ItemType Directory -Force $pasta | Out-Null

Write-Host 'Copie a User-Key da conta de TESTE (Ctrl+C) e aperte Enter.' -ForegroundColor Yellow
$segura = Read-Host 'Enter para ler da área de transferência' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)
$chave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
if (@($chave.ToCharArray() | Where-Object { [int]$_ -gt 32 }).Count -eq 0) {
  $chave = [string](Get-Clipboard -Raw); Set-Clipboard -Value ' '
}
$chave = $chave.Trim().Trim('"', "'")
$ruins = @($chave.ToCharArray() | Where-Object { [int]$_ -lt 33 -or [int]$_ -gt 126 })
if ($chave.Length -lt 20 -or $ruins.Count) { throw "Isso não parece uma User-Key ($($chave.Length) caracteres, $($ruins.Count) inválido(s)). Copie de novo." }

ConvertTo-SecureString $chave -AsPlainText -Force | ConvertFrom-SecureString | Set-Content -Path $arquivo -Encoding ASCII
$chave = $null
Write-Host "Guardada ($arquivo). Só o seu usuário do Windows abre." -ForegroundColor Green
