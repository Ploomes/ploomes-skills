# Apaga a User-Key guardada por guardar-chave.ps1.
$arquivo = Join-Path $env:USERPROFILE '.ploomes-bancada\chave-conta-teste.dpapi'
if (Test-Path $arquivo) { Remove-Item $arquivo -Force; Write-Host 'Chave apagada.' -ForegroundColor Green }
else { Write-Host 'Não havia chave guardada.' }
