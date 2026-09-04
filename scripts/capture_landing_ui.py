from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "landing-liquidity-ui-4k-mockup-ratio.png"
ETH_GIWA_OUTPUT = ROOT / "public" / "landing-eth-giwa-ui-4k-mockup-ratio.png"
BASE_URL = "http://127.0.0.1:5190/#/"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        # The existing landing mockup uses a wide 19:9 UI frame. Rendering the
        # frame at 3x produces a crisp 4104 x 1944 asset without stretching it.
        viewport={"width": 1368, "height": 648},
        device_scale_factor=3,
    )
    page = context.new_page()
    page.goto(f"{BASE_URL}explore", wait_until="networkidle")
    page.add_style_tag(
        content="""
        html, body, #root, .app-shell {
          width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
          margin: 0 !important;
          background: transparent !important;
        }
        body {
          overflow: hidden !important;
        }
        .app-header, .page-intro, .app-footer {
          display: none !important;
        }
        .service-main {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          display: block !important;
        }
        .market-panel {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          border-radius: 14px !important;
          box-shadow: none !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .metrics-row {
          min-height: 70px !important;
        }
        .market-toolbar {
          min-height: 62px !important;
        }
        .data-table {
          min-height: 0 !important;
          flex: 1 1 auto !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .data-head {
          flex: 0 0 42px !important;
        }
        .data-table > .data-row:not(.data-head) {
          min-height: 0 !important;
          flex: 1 1 0 !important;
        }
        .table-footer {
          min-height: 44px !important;
        }
        """
    )
    page.locator(".market-panel").screenshot(
        path=str(OUTPUT),
        animations="disabled",
        omit_background=True,
    )

    detail = context.new_page()
    detail.goto(f"{BASE_URL}launch/eth", wait_until="networkidle")
    detail.add_style_tag(
        content="""
        html, body, #root, .app-shell {
          width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
          margin: 0 !important;
          background: transparent !important;
        }
        body { overflow: hidden !important; }
        .app-header, .back-link, .workspace-header, .detail-metrics, .app-footer {
          display: none !important;
        }
        .service-main {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .market-detail-grid {
          width: 1368px !important;
          height: 648px !important;
          padding: 12px !important;
          border: 1px solid #e3e6eb !important;
          border-radius: 14px !important;
          grid-template-columns: 230px minmax(0, 1fr) 330px !important;
          gap: 12px !important;
          overflow: hidden !important;
          background: #f8f9fb !important;
        }
        .market-sidebar, .market-detail-main, .trade-sidebar {
          gap: 12px !important;
        }
        .market-sidebar {
          grid-template-rows: 204px 166px 230px !important;
        }
        .market-sidebar > .ds-panel { min-height: 0 !important; }
        .trade-sidebar { position: static !important; }
        .token-summary-card, .graduation-card, .market-facts-card, .token-trade-card {
          padding: 16px !important;
        }
        .token-summary-card > p {
          margin-top: 11px !important;
          font-size: 13px !important;
          line-height: 1.45 !important;
        }
        .address-row { min-height: 34px !important; margin-top: 10px !important; }
        .graduation-card > strong { margin-top: 10px !important; }
        .graduation-track { margin-top: 12px !important; }
        .market-facts-card dl { margin: 6px 0 !important; }
        .market-facts-card dl div { min-height: 28px !important; }
        .price-chart-panel {
          height: 350px !important;
          padding: 18px !important;
        }
        .chart-heading h2 { font-size: 23px !important; }
        .chart-meta { min-height: 42px !important; }
        .market-chart { height: 220px !important; }
        .market-activity-panel {
          min-height: 0 !important;
          height: 262px !important;
        }
        .market-activity-panel .page-tabs { min-height: 46px !important; }
        .trade-row { min-height: 40px !important; }
        .trade-head { min-height: 38px !important; }
        .token-trade-card > .ds-segmented { margin-top: 12px !important; }
        .trade-amount-field {
          min-height: 104px !important;
          margin-top: 10px !important;
          padding: 12px !important;
        }
        .trade-amount-field input { font-size: 27px !important; }
        .amount-presets { margin-top: 6px !important; }
        .amount-presets button { min-height: 31px !important; }
        .trade-estimate { margin-top: 11px !important; padding: 10px 0 !important; }
        .trade-review { margin: 7px 0 11px !important; }
        .trade-review div { min-height: 29px !important; }
        .token-trade-card .ds-button { min-height: 42px !important; }
        .trade-notice { margin-top: 8px !important; }
        .market-freshness { display: none !important; }
        """
    )
    detail.locator(".market-detail-grid").screenshot(
        path=str(ETH_GIWA_OUTPUT),
        animations="disabled",
        omit_background=True,
    )
    browser.close()

print(OUTPUT)
print(ETH_GIWA_OUTPUT)
