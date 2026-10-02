# ============================================================
# Iniciar Servidor Local - A\DAN SOLUTIONS
# ============================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Iniciando Suite A\DAN SOLUTIONS en Localhost..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Abrir el navegador en el Hub Local
Start-Process "http://localhost:3000"

# Ejecutar el servidor Node.js
node server.js
