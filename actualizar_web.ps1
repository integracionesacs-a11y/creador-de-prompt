# ============================================================
# Script de Despliegue Rapido (PowerShell) - A\DAN SOLUTIONS
# ============================================================

Write-Host "🚀 [1/3] Preparando cambios locales..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "update web: sincronizacion Suite A\DAN"
}

Write-Host "📤 [2/3] Sincronizando con GitHub (origin/main)..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "📦 [3/3] Desplegando en vivo a Netlify..." -ForegroundColor Cyan
npx --yes netlify-cli deploy --prod --dir=.

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "✅ ¡WEB EN PRODUCCION ACTUALIZADA CON EXITO!" -ForegroundColor Green
    Write-Host "🌐 URL Hub Principal: https://creador-de-prompts-aidan.netlify.app" -ForegroundColor Cyan
    Write-Host "⚡ URL Creador Prompts: https://creador-de-prompts-aidan.netlify.app/prompts/" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Error durante la publicacion en Netlify." -ForegroundColor Red
}
