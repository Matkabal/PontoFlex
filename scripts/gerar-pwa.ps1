$ErrorActionPreference = "Stop"

Write-Host "Gerando build de producao do PWA..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
  throw "Execute este script na raiz do projeto (onde existe package.json)."
}

if (-not (Test-Path "node_modules")) {
  Write-Host "Dependencias nao encontradas. Executando npm install..." -ForegroundColor Yellow
  npm install
}

npm run build

if (-not (Test-Path "dist")) {
  throw "A pasta dist nao foi gerada."
}

Write-Host "PWA gerado com sucesso em ./dist" -ForegroundColor Green
