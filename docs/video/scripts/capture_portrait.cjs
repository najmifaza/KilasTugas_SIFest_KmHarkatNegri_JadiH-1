const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://kilastugas.vercel.app';
const OUT_DIR = path.resolve(__dirname, '../public/real_captures');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function reactType(page, selector, text, clearFirst = true) {
  await page.waitForSelector(selector, { visible: true, timeout: 8000 });
  await page.click(selector, { clickCount: clearFirst ? 3 : 1 });
  if (clearFirst) await page.keyboard.press('Backspace');
  await page.type(selector, text, { delay: 25 });
}

async function capturePortrait() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching Chrome in Portrait Mobile Mode (430x932 @ 2.5x -> 1075x2330)...');
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
  page.on('dialog', async (dialog) => {
    console.log('Dialog dismissed:', dialog.message());
    await dialog.accept();
  });

  console.log('Navigating to', APP_URL);
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await sleep(2000);

  // Clear existing tasks for fresh clean state
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(1500);

  // 01. Initial empty dashboard
  console.log('[01] Capturing 01_dashboard_initial.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_dashboard_initial.png') });

  // 02. Open Add Task Modal
  console.log('[02] Opening Add Task modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find((x) => x.textContent.includes('Tambah') || x.textContent.includes('+') || x.getAttribute('aria-label')?.includes('Tambah'));
    if (b) b.click();
  });
  await sleep(1500);
  console.log('[02] Capturing 02_modal_open.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '02_modal_open.png') });

  // 03. Fill modal form
  console.log('[03] Filling Form...');
  await page.evaluate(() => {
    const titleInput = document.querySelector('input[type="text"]');
    if (titleInput) {
      titleInput.value = 'Laporan Praktikum Jaringan Komputer';
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = 'Modul 4: Konfigurasi Routing Dinamis OSPF Multi-Area dan Alokasi Subnet VLSM pada 5 Router Cisco.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await sleep(800);
  console.log('[03] Capturing 03_modal_filled.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '03_modal_filled.png') });

  // 04. Submit and wait for AI breakdown
  console.log('[04] Submitting Task...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submit = btns.find((b) => b.textContent.includes('Pecah') || b.textContent.includes('Simpan') || b.textContent.includes('Buat'));
    if (submit) submit.click();
  });
  await sleep(4000); // Wait for API response

  console.log('[04] Capturing 04_dashboard_with_tasks.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '04_dashboard_with_tasks.png') });

  // 05. Subtask list view
  console.log('[05] Capturing 05_subtask_list.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '05_subtask_list.png') });

  // 06. Check first subtask
  console.log('[06] Checking first subtask...');
  await page.evaluate(() => {
    const checkBtns = document.querySelectorAll('button[aria-label*="Tandai"], button[aria-label*="Selesai"]');
    if (checkBtns.length > 0) checkBtns[0].click();
  });
  await sleep(1000);
  console.log('[06] Capturing 06_progress_updated.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '06_progress_updated.png') });

  // 07. Timer running modal
  console.log('[07] Opening Pomodoro Timer...');
  await page.evaluate(() => {
    const playBtns = Array.from(document.querySelectorAll('button'));
    const play = playBtns.find((b) => b.innerHTML.includes('lucide-play') || b.querySelector('svg') && b.getAttribute('aria-label')?.includes('Mulai'));
    if (play) play.click();
  });
  await sleep(1200);
  console.log('[07] Capturing 07_timer_running.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '07_timer_running.png') });

  // 08. Mobile cockpit complete
  await page.keyboard.press('Escape');
  await sleep(600);
  console.log('[08] Capturing 08_mobile_cockpit.png (Mobile)...');
  await page.screenshot({ path: path.join(OUT_DIR, '08_mobile_cockpit.png') });

  await browser.close();
  console.log('\n✅ All portrait screenshots captured successfully in 9:16 mobile resolution!');
}

capturePortrait().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
