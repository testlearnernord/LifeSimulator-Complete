"""Mobile Chromium end-to-end smoke test, persistence, download and offline."""
from playwright.sync_api import sync_playwright, expect

URL = 'http://localhost:4173/'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(URL, wait_until='networkidle')

    start = page.get_by_role('button', name='Neues Leben beginnen', exact=True)
    expect(start).to_be_visible()
    start.click()
    page.locator('input[name=name]').fill('Testspieler')
    page.get_by_role('button', name='Leben beginnen', exact=True).click()
    # IndexedDB writes are async; wait for rendering instead of racing a click.
    expect(page.locator('h1').first).to_have_text('Testspieler')
    page.get_by_role('button', name='＋ Ein Jahr älter', exact=True).click()
    expect(page.locator('.age-chip')).to_contain_text('1')

    # An annual random event may block future time progression.
    event_buttons = page.locator('[data-action="event"]')
    if event_buttons.count():
        event_buttons.first.click()
        expect(event_buttons).to_have_count(0)

    page.get_by_role('button', name='Karriere', exact=True).click()
    expect(page.get_by_text('Stellenangebote')).to_be_visible()
    page.get_by_role('button', name='Aktivitäten', exact=True).click()
    expect(page.get_by_text('Fitnessstudio')).to_be_visible()
    page.get_by_role('button', name='Menü', exact=True).click()
    expect(page.get_by_text('Spielstände verwalten')).to_be_visible()
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Exportieren', exact=True).click()
    assert download_info.value.suggested_filename.endswith('.json')

    # Saved life persists across reloads through IndexedDB.
    page.reload(wait_until='networkidle')
    page.get_by_role('button', name='Leben', exact=True).click()
    expect(page.locator('h1').first).to_have_text('Testspieler')
    expect(page.locator('.age-chip')).to_contain_text('1')
    page.evaluate('navigator.serviceWorker.ready')
    page.wait_for_function('Boolean(navigator.serviceWorker.controller)', timeout=15000)

    # The second year and persistence remain functional without network access.
    context.set_offline(True)
    page.reload(wait_until='domcontentloaded')
    expect(page.locator('h1').first).to_have_text('Testspieler')
    page.get_by_role('button', name='＋ Ein Jahr älter', exact=True).click()
    expect(page.locator('.age-chip')).to_contain_text('2')
    assert not errors, f'Browser JavaScript errors: {errors}'
    print('Mobile Chromium E2E + persistence + offline smoke: PASSED')
    context.close()
    browser.close()
