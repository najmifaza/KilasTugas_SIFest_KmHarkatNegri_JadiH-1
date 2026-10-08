const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://kilastugas.vercel.app';
const OUT_DIR = path.resolve(__dirname, '../public/real_captures');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Type into a React-controlled input by clicking it first,
 * then using page.keyboard to dispatch real key events.
 */
async function reactType(page, selector, text, clearFirst = true) {
  await page.waitForSelector(selector, { visible: true, timeout: 8000 });
  await page.click(selector, { clickCount: clearFirst ? 3 : 1 });
  if (clearFirst) await page.keyboard.press('Backspace');
  await page.type(selector, text, { delay: 30 });
}

async function capture() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=430,932',
      '--no-sandbox',
      '--disable-gpu',
    ],
    defaultViewport: {
      width: 430,
      height: 932,
      deviceScaleFactor: 2.5,
      isMobile: true,
      hasTouch: true,
    },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true });
  page.on('dialog', async (dialog) => {
    console.log('Dialog auto-dismissed:', dialog.message());
    await dialog.accept();
  });

  console.log('Navigating to', APP_URL);
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);

  // ─────────────────────────────────────────────
  // 01. Clean dashboard (scroll to top first)
  // ─────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  console.log('[01] Capturing dashboard_initial...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_dashboard_initial.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 02. Open "Add New Task" modal
  // ─────────────────────────────────────────────
  console.log('[02] Opening Add Task modal...');
  const opened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const trigger = btns.find((b) =>
      b.textContent.includes('Pecah Tugas') ||
      b.textContent.includes('Tambah Tugas') ||
      b.textContent.includes('Add') ||
      (b.getAttribute('aria-label') || '').toLowerCase().includes('tambah') ||
      (b.getAttribute('aria-label') || '').toLowerCase().includes('add')
    );
    if (trigger) { trigger.click(); return true; }
    return false;
  });
  if (!opened) {
    await page.evaluate(() => {
      const headerBtns = document.querySelectorAll('header button, nav button');
      if (headerBtns.length) headerBtns[headerBtns.length - 1].click();
    });
  }
  await sleep(1200);

  console.log('[02] Capturing modal_open...');
  await page.screenshot({ path: path.join(OUT_DIR, '02_modal_open.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 03. Fill form
  // ─────────────────────────────────────────────
  console.log('[03] Filling Task Title...');
  await reactType(page, 'input[placeholder="Finish landing page design"]',
    'Laporan Praktikum Routing OSPF & Subnetting VLSM');

  console.log('[03] Filling Description...');
  await reactType(page, 'textarea[placeholder="Design the new landing page for the product launch."]',
    'Susun laporan 5 bab: topologi jaringan, subnetting VLSM 4 subnet, routing OSPF di Cisco Packet Tracer, analisis konvergensi, dan kesimpulan.');

  console.log('[03] Selecting category Laporan Praktikum...');
  await page.select('select', 'laporan_lab');
  await sleep(300);

  console.log('[03] Selecting 5 Langkah manually...');
  await page.evaluate(() => {
    // Toggle off Otomatis AI
    const aiBtn = Array.from(document.querySelectorAll('button')).find((x) =>
      x.textContent.includes('Otomatis AI')
    );
    if (aiBtn) aiBtn.click();

    // Increment to 5 Langkah
    const plusBtn = document.querySelector('button[aria-label="Tambah jumlah langkah"]');
    const container = plusBtn?.parentElement;
    for (let i = 0; i < 10; i++) {
      if (container && container.textContent.includes('5')) break;
      if (plusBtn) plusBtn.click();
    }
  });
  await sleep(600);

  console.log('[03] Capturing modal_filled...');
  await page.screenshot({ path: path.join(OUT_DIR, '03_modal_filled.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 04. Submit → wait for AI breakdown → scroll to card → capture
  // ─────────────────────────────────────────────
  console.log('[04] Clicking "Create Task" button...');
  await page.evaluate(() => {
    const submitBtn = [...document.querySelectorAll('button[type="submit"]')]
      .find((b) => b.textContent.trim().includes('Create Task'));
    if (submitBtn) {
      submitBtn.click();
    } else {
      const saveBtn = document.querySelector('button[aria-label="Simpan tugas"]');
      if (saveBtn) saveBtn.click();
    }
  });

  console.log('[04] Waiting for modal to close (AI breakdown in progress)...');
  try {
    await page.waitForFunction(
      () => !document.querySelector('.fixed.inset-0.z-50'),
      { timeout: 30000 }
    );
    console.log('[04] Modal closed successfully!');
  } catch (e) {
    console.warn('[04] Modal did not close in 30s — continuing anyway');
  }
  await sleep(2000);

  console.log('[04] Scrolling to task card & trimming to 5 steps...');
  await page.evaluate(() => {
    const card = document.querySelector('article');
    if (card) {
      const expandBtn = card.querySelector('button[aria-label="Buka rincian"]') || card.querySelector('div.cursor-pointer');
      if (expandBtn) expandBtn.click();
    }
  });
  await sleep(1000);

  // Trim to exactly 5 steps
  await page.evaluate(() => {
    const trashBtns = Array.from(document.querySelectorAll('article button')).filter(
      (b) => b.getAttribute('aria-label') === 'Hapus langkah'
    );
    if (trashBtns.length > 5) {
      trashBtns[trashBtns.length - 1].click();
    }
  });
  await sleep(1200);

  // Collapse back for 04_dashboard_with_tasks
  await page.evaluate(() => {
    const card = document.querySelector('article');
    if (card) {
      const expandBtn = card.querySelector('button[aria-label="Buka rincian"]') || card.querySelector('div.cursor-pointer');
      if (expandBtn) expandBtn.click();
      const rect = card.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 80;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
    }
  });
  await sleep(600);

  console.log('[04] Capturing dashboard_with_tasks (full card visible, 5 steps)...');
  await page.screenshot({ path: path.join(OUT_DIR, '04_dashboard_with_tasks.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 05. Expand the task card, scroll down to see ALL subtasks
  // ─────────────────────────────────────────────
  console.log('[05] Expanding task card to show subtasks...');
  await page.evaluate(() => {
    const expandBtn = document.querySelector('button[aria-label="Buka rincian"]');
    if (expandBtn) { expandBtn.click(); return; }
    const card = document.querySelector('article');
    if (card) { card.querySelector('div.cursor-pointer')?.click(); }
  });
  await sleep(1000);

  // Ensure exactly 5 subtasks remain (matching user request of 5 steps)
  console.log('[05] Trimming subtasks to exactly 5...');
  await page.evaluate(() => {
    const trashBtns = Array.from(document.querySelectorAll('article button')).filter(
      (b) => b.getAttribute('aria-label') === 'Hapus langkah'
    );
    if (trashBtns.length > 5) {
      trashBtns[trashBtns.length - 1].click();
    }
  });
  await sleep(1500);

  // Scroll so the expanded card (with all subtasks) fills the viewport
  console.log('[05] Scrolling to center expanded card with all subtasks visible...');
  await page.evaluate(() => {
    const card = document.querySelector('article');
    if (card) {
      const rect = card.getBoundingClientRect();
      // If card is taller than viewport, scroll to show the top of card + as many subtasks as possible
      const targetY = window.scrollY + rect.top - 30;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
    }
  });
  await sleep(500);

  console.log('[05] Capturing task card with subtask list expanded...');
  await page.screenshot({ path: path.join(OUT_DIR, '05_subtask_list.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 06. Check one subtask → progress bar updates
  // ─────────────────────────────────────────────
  console.log('[06] Checking first subtask...');
  await page.evaluate(() => {
    const card = document.querySelector('article');
    const btn = card ? (card.querySelector('button[aria-label*="selesai"]') || card.querySelector('button[aria-label*="Tandai"]')) : null;
    if (btn) {
      btn.scrollIntoView({ block: 'center' });
      btn.click();
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((evt) => {
        btn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
      });
    }
  });
  await sleep(2500);

  // Stay scrolled to card position so progress bar is visible
  await page.evaluate(() => {
    const card = document.querySelector('article');
    if (card) {
      const rect = card.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 30;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
    }
  });
  await sleep(400);

  console.log('[06] Capturing progress_updated...');
  await page.screenshot({ path: path.join(OUT_DIR, '06_progress_updated.png'), fullPage: false });

  // ─────────────────────────────────────────────
  // 07. Click a subtask row to open detail/timer modal
  // ─────────────────────────────────────────────
  console.log('[07] Opening subtask detail (timer)...');
  await page.evaluate(() => {
    // Click the 2nd subtask row (first one is now checked/completed, use second)
    const rows = [...document.querySelectorAll('article div[class*="rounded-2xl"][class*="border"]')]
      .filter((el) => el.querySelector('button[aria-label^="Tandai"]'));
    const target = rows.length >= 2 ? rows[1] : rows[0];
    if (target) target.click();
  });
  await sleep(1500);

  console.log('[07] Capturing timer_running...');
  await page.screenshot({ path: path.join(OUT_DIR, '07_timer_running.png'), fullPage: false });

  await page.keyboard.press('Escape');
  await sleep(500);

  // ─────────────────────────────────────────────
  // 08. Capture mobile cockpit overview with progress
  // ─────────────────────────────────────────────
  console.log('[08] Scrolling to top to capture mobile cockpit...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(1000);

  console.log('[08] Capturing mobile_cockpit...');
  await page.screenshot({ path: path.join(OUT_DIR, '08_mobile_cockpit.png'), fullPage: false });

  await browser.close();
  console.log('\n✅ All screenshots saved to:', OUT_DIR);
  console.log('Files:');
  fs.readdirSync(OUT_DIR).forEach((f) => console.log('  •', f));
}

capture().catch((err) => {
  console.error('❌ Capture failed:', err.message || err);
  process.exit(1);
});
