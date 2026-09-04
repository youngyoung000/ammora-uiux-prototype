from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5190/#/"
ROUTES = ["explore", "pool/eth-usdc", "swap", "portfolio", "create", "launch", "launch/eth", "currencies", "fees"]
VIEWPORTS = [320, 360, 390, 768, 1024, 1440]
OUTPUT = Path("/private/tmp/ammora-layout-check")
OUTPUT.mkdir(parents=True, exist_ok=True)


def visible_layout_issues(page):
    return page.evaluate(
        """
        () => {
          const viewport = document.documentElement.clientWidth;
          const issues = [];
          if (document.documentElement.scrollWidth > viewport + 1) {
            issues.push(`document:${document.documentElement.scrollWidth}>${viewport}`);
          }
          for (const badge of document.querySelectorAll('.ds-badge')) {
            if (badge.scrollWidth > badge.clientWidth + 1 || badge.scrollHeight > badge.clientHeight + 1) {
              issues.push(`badge:${badge.textContent.trim()}`);
            }
          }
          for (const row of document.querySelectorAll('.card-label-row')) {
            if (row.scrollWidth > row.clientWidth + 1) {
              issues.push(`card-label-row:${row.scrollWidth}>${row.clientWidth}`);
            }
          }
          return [...new Set(issues)].slice(0, 20);
        }
        """
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    failures = []
    for width in VIEWPORTS:
        page = browser.new_page(viewport={"width": width, "height": 900})
        for route in ROUTES:
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            issues = visible_layout_issues(page)
            if issues:
                failures.append((width, route, issues))
                page.screenshot(path=OUTPUT / f"{route.replace('/', '-')}-{width}.png", full_page=True)
            page.evaluate("document.documentElement.dataset.theme = 'dark'")
            dark_issues = visible_layout_issues(page)
            if dark_issues:
                failures.append((width, f"{route} (dark)", dark_issues))
        page.close()
    browser.close()

if failures:
    for width, route, issues in failures:
        print(f"[{width}px] {route}")
        for issue in issues:
            print(f"  {issue}")
    raise SystemExit(1)

print(f"Layout checks passed at {', '.join(f'{width}px' for width in VIEWPORTS)}: {OUTPUT}")
