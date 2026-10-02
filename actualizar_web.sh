#!/bin/bash
# ============================================================
# Script de Despliegue Rápido - A\DAN SOLUTIONS
# ============================================================

echo "🚀 Iniciando despliegue a producción en Netlify..."
cd "$(dirname "$0")"

git push origin main

echo ""
echo "📦 Desplegando archivos a Netlify..."
npx -y netlify-cli deploy --prod --dir=.

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ¡Web actualizada con éxito en producción!"
  echo "🌐 URL en vivo: https://creador-de-prompts-aidan.netlify.app"
else
  echo ""
  echo "❌ Si te pide autenticación, ejecuta: npx netlify login"
fi
