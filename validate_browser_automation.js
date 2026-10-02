const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'https://creador-de-prompts-aidan.netlify.app';

async function runValidation() {
  console.log('🚀 Iniciando navegador Edge con puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Capturar errores de consola
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('🔴 Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.log('🔴 Page Uncaught Error:', err.toString());
  });

  console.log('\n==================================================');
  console.log('TEST 1: NAVEGACIÓN Y BOTONES DEL HUB PRINCIPAL');
  console.log('==================================================');

  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  const hubTitle = await page.title();
  console.log('✅ Hub cargado. Título:', hubTitle);

  // 1.1 Probar filtros de nivel
  console.log('\n--- Probando filtros por nivel (Tabs) ---');
  await page.click('#tab_vip');
  let vipCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.module-card'));
    return {
      total: cards.length,
      visible: cards.filter(c => c.style.display !== 'none').length
    };
  });
  console.log(`Filtro VIP PRO: ${vipCards.visible} de ${vipCards.total} tarjetas visibles (Esperado: 2)`);

  await page.click('#tab_super_vip');
  let superCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.module-card'));
    return {
      total: cards.length,
      visible: cards.filter(c => c.style.display !== 'none').length
    };
  });
  console.log(`Filtro SUPER VIP: ${superCards.visible} de ${superCards.total} tarjetas visibles (Esperado: 2)`);

  await page.click('#tab_all');
  let allCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.module-card'));
    return {
      total: cards.length,
      visible: cards.filter(c => c.style.display !== 'none').length
    };
  });
  console.log(`Filtro Todas: ${allCards.visible} de ${allCards.total} tarjetas visibles (Esperado: 4)`);

  // 1.2 Probar Botón de Administrador y PIN
  console.log('\n--- Probando Botón Admin y PIN (9835$$) ---');
  // Buscar botón admin
  const adminBtn = await page.$('button[title*="Panel de Control del Dueño"]');
  if (adminBtn) {
    await adminBtn.click();
    console.log('Clic en botón Admin realizado.');
    await new Promise(r => setTimeout(r, 400));

    const pinModalVisible = await page.evaluate(() => {
      const m = document.getElementById('admin-pin-modal');
      return m && m.style.display === 'flex';
    });
    console.log('¿Modal de PIN Admin visible?:', pinModalVisible);

    // Escribir PIN
    await page.type('#admin_pin_input', '9835$$');
    await page.click('#admin-pin-modal button.gradient-btn-gold');
    await new Promise(r => setTimeout(r, 1200));

    const panelModalVisible = await page.evaluate(() => {
      const p = document.getElementById('admin-panel-modal');
      const rows = document.querySelectorAll('#clients_table_body tr').length;
      return { visible: p && p.style.display === 'flex', rows };
    });
    console.log('¿Panel Admin desbloqueado y con datos en vivo?:', panelModalVisible);

    // Cerrar panel admin
    await page.evaluate(() => closeAdminPanel());
    await new Promise(r => setTimeout(r, 400));
  } else {
    console.log('❌ Botón admin no encontrado');
  }

  // 1.3 Probar Botón Login
  console.log('\n--- Probando Botón de Login de Miembro ---');
  await page.click('#btn_open_login');
  await new Promise(r => setTimeout(r, 400));
  const loginModalVisible = await page.evaluate(() => {
    const m = document.getElementById('login-modal');
    return m && m.style.display === 'flex';
  });
  console.log('¿Modal de Login abierto al clic?:', loginModalVisible);

  // Escribir email super vip y autenticar
  await page.type('#input_member_email', 'integracionesacs@gmail.com');
  await page.click('#btn_verify_login');
  await new Promise(r => setTimeout(r, 2000));

  const authState = await page.evaluate(() => {
    const chip = document.getElementById('user_profile_chip');
    const emailDisp = document.getElementById('user_email_display');
    const badgeDisp = document.getElementById('user_badge_display');
    return {
      chipVisible: chip && chip.style.display === 'flex',
      email: emailDisp ? emailDisp.textContent : '',
      badge: badgeDisp ? badgeDisp.textContent : ''
    };
  });
  console.log('Estado de Sesión Miembro tras login:', authState);

  console.log('\n==================================================');
  console.log('TEST 2: NAVEGACIÓN Y BOTONES DEL CREADOR DE PROMPTS');
  console.log('==================================================');

  await page.goto(BASE_URL + '/prompts/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const promptsTitle = await page.title();
  console.log('✅ Página Prompts cargada. Título:', promptsTitle);

  // Verificar que el app esté desbloqueado
  const appVisible = await page.evaluate(() => {
    const app = document.getElementById('app-prompts');
    const loader = document.getElementById('auth-loading');
    const login = document.getElementById('login-screen');
    return {
      appPrompts: app ? app.style.display : '',
      authLoading: loader ? loader.style.display : '',
      loginScreen: login ? login.style.display : ''
    };
  });
  console.log('Visibilidad de pantallas en /prompts/:', appVisible);

  // 2.1 Probar clics en los Presets
  console.log('\n--- Probando Clic en Presets Estratégicos ---');

  // Clic en Producto E-comm
  await page.click('#btn_preset_product_image');
  await new Promise(r => setTimeout(r, 500));
  let promptData = await page.evaluate(() => {
    return {
      action: document.getElementById('mainAction').value,
      output: document.getElementById('outputBox').innerText,
      metrics: document.getElementById('charCount').textContent
    };
  });
  console.log('Preset 1 (Producto E-comm) -> Generó:');
  console.log('Acción inyectada:', promptData.action);
  console.log('Prompt generado:', promptData.output.substring(0, 100) + '...');
  console.log('Métricas:', promptData.metrics);

  // Clic en Cine Hollywood
  await page.click('#btn_preset_hollywood');
  await new Promise(r => setTimeout(r, 500));
  promptData = await page.evaluate(() => {
    return {
      action: document.getElementById('mainAction').value,
      output: document.getElementById('outputBox').innerText
    };
  });
  console.log('\nPreset 2 (Cine Hollywood 35mm) -> Generó:');
  console.log('Prompt generado:', promptData.output.substring(0, 120) + '...');

  // Clic en Cyberpunk
  await page.click('#btn_preset_cyberpunk');
  await new Promise(r => setTimeout(r, 500));
  promptData = await page.evaluate(() => {
    return {
      action: document.getElementById('mainAction').value,
      output: document.getElementById('outputBox').innerText
    };
  });
  console.log('\nPreset 3 (Cyberpunk Neón) -> Generó:');
  console.log('Prompt generado:', promptData.output.substring(0, 120) + '...');

  // 2.2 Probar cambio de modo (Video <-> Imagen)
  console.log('\n--- Probando Botones de Modo (Video vs Imagen) ---');
  await page.click('#btn_mode_image');
  await new Promise(r => setTimeout(r, 400));
  let modeState = await page.evaluate(() => {
    return {
      cat2Hidden: document.getElementById('card_cat2').classList.contains('hidden'),
      output: document.getElementById('outputBox').innerText.substring(0, 60)
    };
  });
  console.log('Modo Imagen activado -> ¿Cat2 oculta?:', modeState.cat2Hidden, '| Salida:', modeState.output);

  await page.click('#btn_mode_video');
  await new Promise(r => setTimeout(r, 400));
  modeState = await page.evaluate(() => {
    return {
      cat2Hidden: document.getElementById('card_cat2').classList.contains('hidden'),
      output: document.getElementById('outputBox').innerText.substring(0, 60)
    };
  });
  console.log('Modo Video activado -> ¿Cat2 visible?:', !modeState.cat2Hidden, '| Salida:', modeState.output);

  // 2.3 Probar interacción con los 9 dropdowns (que antes tenían el bug de skipPrompt)
  console.log('\n--- Probando Dropdowns de Categorías (onCategorySelectChange) ---');
  await page.select('#val_cat1', 'Close-Up Shot');
  await page.select('#val_cat3', '85mm Portrait Lens');
  await new Promise(r => setTimeout(r, 400));
  const dropdownPrompt = await page.evaluate(() => document.getElementById('outputBox').innerText);
  console.log('Prompt tras modificar selectores:', dropdownPrompt.substring(0, 130) + '...');

  // 2.4 Probar Botón Copiar Prompt
  console.log('\n--- Probando Botón Copiar Prompt ---');
  await page.click('#copyBtn');
  await new Promise(r => setTimeout(r, 500));
  const copyLabel = await page.evaluate(() => document.getElementById('copyLabel').textContent);
  console.log('Estado del botón copiar tras clic:', copyLabel);

  // 2.5 Resumen de Errores de Consola
  console.log('\n==================================================');
  console.log('RESULTADO FINAL DE ERRORES DE CONSOLA');
  console.log('==================================================');
  if (consoleErrors.length === 0) {
    console.log('🎉 ¡PERFECTO! 0 ERRORES DE JAVASCRIPT EN TODAS LAS PRUEBAS.');
  } else {
    console.log(`⚠️ Se detectaron ${consoleErrors.length} errores:`, consoleErrors);
  }

  await browser.close();
  console.log('✅ Navegador cerrado exitosamente.');
}

runValidation().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
