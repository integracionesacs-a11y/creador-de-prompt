# ============================================================
# Script de Despliegue Rápido (PowerShell) - A\DAN SOLUTIONS
# ============================================================

Write-Host "🚀 Sincronizando con GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "📦 Desplegando archivos a producción en Netlify..." -ForegroundColor Cyan
npx -y netlify-cli deploy --prod --dir=.

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Web actualizada con éxito en producción!" -ForegroundColor Green
    Write-Host "🌐 URL en vivo: https://creador-de-prompts-aidan.netlify.app" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ℹ️ Si te pide autenticación en Netlify, ejecuta primero: npx netlify login" -ForegroundColor Yellow
}
