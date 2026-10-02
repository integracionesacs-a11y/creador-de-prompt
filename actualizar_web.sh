#!/bin/bash
# ============================================================
# Script de Despliegue Rapido (Bash) - A\DAN SOLUTIONS
# ============================================================

cd "$(dirname "$0")"

echo "🚀 [1/3] Preparando cambios locales..."
git add .
if ! git diff-index --quiet HEAD --; then
  git commit -m "update web: sincronizacion Suite A\DAN"
fi

echo "📤 [2/3] Sincronizando con GitHub (origin/main)..."
git push origin main

echo ""
echo "📦 [3/3] Desplegando en vivo a Netlify..."
npx --yes netlify-cli deploy --prod --dir=. --site creador-de-prompts-aidan

if [ $? -eq 0 ]; then
  echo ""
  echo "=========================================================="
  echo "✅ ¡WEB EN PRODUCCION ACTUALIZADA CON EXITO!"
  echo "🌐 URL en vivo: https://creador-de-prompts-aidan.netlify.app"
  echo "=========================================================="
else
  echo ""
  echo "=========================================================="
  echo "⚠️ ATENCION: Requiere autorizacion unica de Netlify en tu PC."
  echo "👉 Ejecuta en tu terminal:"
  echo "   npx netlify-cli login"
  echo "Despues vuelve a ejecutar ./actualizar_web.sh"
  echo "=========================================================="
fi
