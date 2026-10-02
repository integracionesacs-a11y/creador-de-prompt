#!/bin/bash
# ============================================================
# Script de Despliegue Rápido - A\DAN SOLUTIONS
# ============================================================

echo "🚀 Iniciando despliegue a producción en Netlify..."
cd "$(dirname "$0")"

git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ¡Cambios sincronizados con éxito en GitHub y Netlify!"
  echo "🌐 URL en vivo: https://creador-de-prompts-aidan.netlify.app"
else
  echo ""
  echo "❌ Ocurrió un error durante el despliegue. Verifica tu conexión a internet o credenciales."
fi
