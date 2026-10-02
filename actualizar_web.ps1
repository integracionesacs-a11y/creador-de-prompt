# ============================================================
# Script de Despliegue Rápido (PowerShell) - A\DAN SOLUTIONS
# ============================================================

Write-Host "🚀 Iniciando despliegue a producción en Netlify..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Web actualizada con éxito en producción!" -ForegroundColor Green
    Write-Host "🌐 URL en vivo: https://creador-de-prompts-aidan.netlify.app" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Ocurrió un error durante el despliegue." -ForegroundColor Red
}
