---
name: web-ui-button-validation
description: >-
  Diagnose, prevent, and validate broken web UI buttons, modal overlay click-traps,
  global variable name collisions, and CSS specificity conflicts in vanilla JS and Tailwind apps.
  Use when UI buttons fail to respond, clicks seem ignored, or when verifying interactive web pages.
---

# Web UI & Button Validation Guide

This skill provides step-by-step procedures to prevent and diagnose non-responsive UI buttons, invisible modal traps, and JavaScript initialization failures.

---

## 1. The 4 Critical Antipatterns

### Antipattern 1: Global Variable Shadowing & Top-Level SyntaxErrors
* **Symptom**: None of the buttons on the page work. Console reports:
  `SyntaxError: Identifier 'X' has already been declared`
  followed by `ReferenceError: functionName is not defined` on button clicks.
* **Root Cause**: External CDN libraries (e.g., Supabase JS, Firebase, Lucide) declare globals like `window.supabase`. In modern JavaScript, writing `let supabase = null;` at the root of a `<script>` tag throws a syntax error, causing the browser to **abort the execution of the entire script**.
* **Prevention & Fix**:
  - Never use generic library names for client instances.
  - Always use explicit client identifiers:
    ```javascript
    // ❌ WRONG: Collides with window.supabase from CDN
    let supabase = null;

    // ✅ CORRECT: Unique, descriptive instance name
    let supabaseClient = null;
    function initSupabase() {
      if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(URL, KEY);
      }
      return !!supabaseClient;
    }
    ```

---

### Antipattern 2: Tailwind `hidden` vs `flex` Cascade Trap (Invisible Modal Blocking)
* **Symptom**: The UI appears normal, but buttons cannot be clicked; hover states do not trigger.
* **Root Cause**: Modals with classes like `class="hidden fixed inset-0 z-50 flex..."`. In Tailwind CSS, `.flex` defines `display: flex`. When `.flex` is declared after `.hidden` in the stylesheet, `display: flex` overrides `display: none`. The modal remains active as an invisible full-screen layer (`fixed inset-0 z-50`) intercepting all mouse and touch events.
* **Prevention & Fix**:
  1. Add an explicit reset in `<style>`:
     ```css
     .hidden, [hidden] {
       display: none !important;
     }
     ```
  2. For all fixed modals and overlays, add inline `style="display: none;"` in the HTML markup:
     ```html
     <!-- ✅ CORRECT: Guaranteed hidden regardless of Tailwind class order -->
     <div id="login-modal" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
     ```
  3. Manage visibility in JavaScript using explicit style properties:
     ```javascript
     function openModal(id) {
       const m = document.getElementById(id);
       if (m) m.style.display = 'flex';
     }
     function closeModal(id) {
       const m = document.getElementById(id);
       if (m) m.style.display = 'none';
     }
     ```

---

### Antipattern 3: Undeclared Variables in Event Handlers
* **Symptom**: Controls fail or freeze when changing dropdowns or checkboxes (`onchange`, `onclick`).
* **Root Cause**: Referencing variables that were not defined or passed as function arguments (e.g., `if (!skipPrompt) update();` where `skipPrompt` is not an argument).
* **Prevention & Fix**:
  - Always verify that all variables used in event handlers are either in scope or passed explicitly.
  - Test scripts using Node.js or simulated DOM runs before deploying.

---

### Antipattern 4: Silent No-Op on Preset Buttons (Empty Input Trap)
* **Symptom**: User clicks on a preset card or button, but the output box remains blank or displays an instruction to "type text first", making the button appear broken.
* **Prevention & Fix**:
  - If the main input is empty when clicking a preset, **automatically populate an example action** and trigger generation immediately:
    ```javascript
    function applyPreset(presetKey) {
      const input = document.getElementById('mainAction');
      const preset = presets[presetKey];
      if (!input.value.trim() && preset.exampleAction) {
        input.value = preset.exampleAction;
      }
      generatePrompt(); // Instant feedback on first click
    }
    ```

---

## 2. Automated Real-Browser QA Procedure

When validating interactive web pages, use local browser automation (such as Microsoft Edge or Google Chrome via `puppeteer-core`) to verify real user interactions:

### Verification Checklist:
1. **Console Error Monitoring**:
   Listen for `pageerror` and `console` error events. Assert **0 errors**.
2. **Modal Backdrop Inspection**:
   Confirm that all modals have `style.display === 'none'` or are absent from the accessibility tree when closed.
3. **Interactive Click Simulation**:
   - Click tab filters and assert that the expected number of cards are displayed (`card.style.display !== 'none'`).
   - Click action buttons and verify that the target modal or route activates.
   - Click preset buttons and verify that output containers receive populated text immediately.
   - Click clipboard copy buttons and verify visual feedback (`¡Copiado!`).
