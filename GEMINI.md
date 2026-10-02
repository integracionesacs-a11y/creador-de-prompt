# Reglas del Proyecto — A\DAN SOLUTIONS

Este archivo establece directrices obligatorias de desarrollo y control de calidad para evitar errores de interfaz, bloqueos de clics y fallos de ejecución en el aplicativo.

---

## 1. Integración con Librerías Externas (Supabase, Firebase, etc.)
- **Prohibido sombrear nombres globales**: Las librerías de CDN (como `@supabase/supabase-js`) inyectan variables en `window` (por ejemplo, `window.supabase`).
- **Convención obligatoria**: Las instancias creadas en scripts deben nombrarse siempre con sufijo descriptivo (por ejemplo, `supabaseClient` o `authClient`), **NUNCA** `let supabase = null;`.
- Esto previene el error crítico `SyntaxError: Identifier 'X' has already been declared`, el cual aborta toda la ejecución del archivo JavaScript.

---

## 2. Modales, Overlays y Especificidad de Tailwind CSS
- **Regla contra conflicto `hidden` vs `flex`**:
  - En Tailwind CSS, `.flex` compite con `.hidden` en la cascada de estilos.
  - Para todo modal o backdrop con posición fija (`fixed inset-0 z-50`), es **obligatorio** declarar el atributo inline:
    ```html
    <div id="mi-modal" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center ...">
    ```
  - En las etiquetas `<style>` debe mantenerse la regla de anulación:
    ```css
    .hidden, [hidden] {
      display: none !important;
    }
    ```
  - La apertura y cierre de modales debe controlar explícitamente `el.style.display = 'flex'` y `el.style.display = 'none'`.

---

## 3. Presets y Botones de Acción Inmediata
- Si un botón de preset (ej. *Producto*, *Hollywood*, *Cyberpunk*) se presiona con la caja de entrada vacía, **debe auto-inyectar un ejemplo optimizado (`preset.exampleAction`) y generar el prompt en el primer clic**. El usuario no debe experimentar clics vacíos o silenciosos.

---

## 4. Validación en Navegadores Reales
- Para tareas de verificación de interfaz de usuario, no depender únicamente de comprobaciones estáticas.
- Ejecutar pruebas automatizadas en navegadores reales (Edge/Chrome con `puppeteer-core`) verificando que la consola mantenga **0 errores de JavaScript** y que los clics produzcan la respuesta visual esperada.
