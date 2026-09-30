#!/bin/bash
# ============================================================
# Script de Despliegue Rápido a Netlify - A\DAN SOLUTIONS
# ============================================================

echo "🚀 Iniciando despliegue a producción en Netlify..."
cd "$(dirname "$0")"

# Ejecutar el despliegue a producción
npx -y netlify-cli deploy --prod --dir=.

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ¡Web actualizada con éxito en producción!"
  echo "🌐 URL: https://creador-de-prompts-aidan.netlify.app"
else
  echo ""
  echo "❌ Ocurrió un error durante el despliegue. Verifica tu conexión o sesión de Netlify."
fi
