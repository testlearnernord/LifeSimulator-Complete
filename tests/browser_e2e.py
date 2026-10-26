"""End-to-end smoke test for Chromium mobile emulation on a normal GitHub runner.
Run with: npm run build && node scripts/serve.mjs & python tests/browser_e2e.py
It does not constitute physical iPhone/Safari validation.
"""
from playwright.sync_api import sync_playwright

URL = 'http://localhost:4173/'
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(URL, wait_until='networkidle')
    assert page.get_by_role('button', name='Neues Leben beginnen').is_visible()
    page.get_by_role('button', name='Neues Leben beginnen').click()
    page.locator('input[name=name]').fill('Testspieler')
    page.get_by_role('button', name='Leben beginnen', exact=True).click()
    assert page.locator('h1').first.inner_text() == 'Testspieler'
    page.get_by_role('button', name='＋ Ein Jahr älter').click()
    assert '1' in page.locator('.age-chip').inner_text()
    page.get_by_role('button', name='Karriere').click()
    assert page.get_by_text('Stellenangebote').is_visible()
    page.get_by_role('button', name='Aktivitäten').click()
    assert page.get_by_text('Fitnessstudio').is_visible()
    page.get_by_role('button', name='Menü').click()
    assert page.get_by_text('Spielstände verwalten').is_visible()
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Exportieren').click()
    download = download_info.value
    assert download.suggested_filename.endswith('.json')
    # Verify saved life survives reload, including browser-backed IndexedDB.
    page.reload(wait_until='networkidle')
    page.get_by_role('button', name='Leben').click()
    assert page.locator('h1').first.inner_text() == 'Testspieler'
    assert '1' in page.locator('.age-chip').inner_text()
    # Service worker must control the tab before testing network loss.
    page.evaluate('navigator.serviceWorker.ready')
    page.wait_for_function('Boolean(navigator.serviceWorker.controller)', timeout=15000)
    context.set_offline(True)
    page.reload(wait_until='domcontentloaded')
    assert page.locator('h1').first.inner_text() == 'Testspieler'
    page.get_by_role('button', name='＋ Ein Jahr älter').click()
    assert '2' in page.locator('.age-chip').inner_text()
    assert not errors, f'Browser JavaScript errors: {errors}'
    print('Mobile Chromium E2E + persistence + offline smoke: PASSED')
    context.close()
    browser.close()
