from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5190/#/"
OUTPUT = Path("/private/tmp/ammora-quick-select")
OUTPUT.mkdir(parents=True, exist_ok=True)


def assert_text(page, selector, expected):
    value = page.locator(selector).inner_text()
    assert expected in value, f"Expected {expected!r} in {selector}, got {value!r}"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1512, "height": 1050}, device_scale_factor=1)
    page_errors = []
    console_errors = []
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

    checks = {
        "explore": 0,
        "swap": 0,
        "portfolio": 0,
        "create": 3,
        "launch": 0,
        "currencies": 0,
        "fees": 0,
        "pool/eth-usdc": 0,
    }
    for route, count in checks.items():
        page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
        assert page.locator(".quick-select__options > button").count() == count
        assert page.locator(".workspace-header .section-eyebrow").count() == 0

    page.goto(f"{BASE_URL}explore", wait_until="networkidle")
    assert "Updated" not in page.locator("body").inner_text()
    primary_style = page.get_by_role("button", name="Create pool").evaluate("el => ({ image: getComputedStyle(el).backgroundImage, color: getComputedStyle(el).backgroundColor })")
    assert primary_style["image"] == "none"
    page.get_by_role("button", name="Top yield").click()
    assert page.locator(".page-tabs button.active").inner_text() == "Top yield"
    assert_text(page, ".data-row:nth-child(2)", "GIWA / USDC")
    assert_text(page, ".liquidity-overview", "At least $0.38")
    assert page.locator(".saved-filter .lucide-bookmark").count() == 1
    assert page.locator('.table-actions button[aria-label="Save"] .lucide-bookmark').first.count() == 1
    page.locator(".data-row:not(.data-head)").first.hover()
    assert "gradient" in page.locator(".data-row:not(.data-head)").first.evaluate("el => getComputedStyle(el).backgroundImage")
    page.screenshot(path=OUTPUT / "explore-desktop.png", full_page=True)
    page.locator(".data-row").nth(1).click()
    page.wait_for_url("**/#/pool/giwa-usdc")
    assert_text(page, ".add-liquidity-card", "Add liquidity")
    assert "Guided" not in page.locator(".add-liquidity-card").inner_text()
    assert "gradient" in page.locator(".range-bars i.in-range").first.evaluate("el => getComputedStyle(el).backgroundImage")
    min_handle = page.get_by_role("slider", name="Minimum price range")
    before_range = int(min_handle.get_attribute("aria-valuenow"))
    handle_box = min_handle.bounding_box()
    page.mouse.move(handle_box["x"] + handle_box["width"] / 2, handle_box["y"] + handle_box["height"] / 2)
    page.mouse.down()
    page.mouse.move(handle_box["x"] + 70, handle_box["y"] + handle_box["height"] / 2, steps=8)
    page.mouse.up()
    assert int(min_handle.get_attribute("aria-valuenow")) > before_range
    marker_x = page.locator(".current-range-marker").evaluate("el => el.getBoundingClientRect().left")
    marker_label = page.locator(".current-range-marker span").bounding_box()
    axis_label = page.locator(".distribution-axis .axis-current").bounding_box()
    marker_center = marker_x + 1
    assert abs(marker_center - (marker_label["x"] + marker_label["width"] / 2)) < 2, (marker_center, marker_label)
    assert abs(marker_center - (axis_label["x"] + axis_label["width"] / 2)) < 2, (marker_center, axis_label)
    page.screenshot(path=OUTPUT / "pool-detail-desktop.png", full_page=True)

    page.goto(f"{BASE_URL}swap", wait_until="networkidle")
    assert page.locator(".workspace-header").count() == 0
    assert page.locator(".giwa-network-mark img").get_attribute("src") == "/giwa-black.svg"
    assert page.locator(".swap-field select").count() == 0
    swap_fields = page.locator(".swap-field").evaluate_all("els => els.map(el => { const box = el.getBoundingClientRect(); return { y: box.y, height: box.height }; })")
    assert len(swap_fields) == 2 and swap_fields[1]["y"] > swap_fields[0]["y"] + swap_fields[0]["height"]
    page.get_by_role("button", name="Select you pay token").click()
    assert page.get_by_role("dialog").is_visible()
    page.screenshot(path=OUTPUT / "swap-token-modal.png", full_page=True)
    page.locator(".token-modal-search input").fill("GIWA")
    page.locator(".token-modal-list > button").click()
    assert_text(page, ".swap-field:first-of-type .token-select-button", "GIWA")
    page.locator("#swap-settings summary").click()
    page.get_by_role("button", name="Direct pool").click()
    assert_text(page, "#swap-settings .advanced-content", "1 verified pool")
    assert_text(page, ".quote-summary", "USDC")
    page.get_by_role("button", name="Connect wallet", exact=True).click()
    assert page.get_by_role("button", name="Swap", exact=True).is_visible()
    page.get_by_role("button", name="Swap", exact=True).click()
    assert page.locator(".action-dialog").count() == 0
    page.screenshot(path=OUTPUT / "swap-desktop.png", full_page=True)

    page.goto(f"{BASE_URL}create", wait_until="networkidle")
    page.get_by_role("button", name="Scheduled pool").click()
    assert page.locator(".quick-select__arrow").count() == 0
    assert page.locator(".quick-select__options > button").evaluate_all("els => els.every(el => getComputedStyle(el).borderRadius !== '0px')")
    assert_text(page, ".quick-select__options > button.selected", "Scheduled pool")
    assert "gradient" in page.locator(".quick-select__options > button.selected").evaluate("el => getComputedStyle(el).backgroundImage")
    assert "gradient" in page.get_by_text("Recommended", exact=True).evaluate("el => getComputedStyle(el).backgroundImage")
    assert_text(page, ".config-preview aside", "Opening\nSchedule")
    assert page.locator('[data-flow="quick"] .asset-mark').count() >= 2
    page.get_by_role("button", name="Select base token").click()
    assert page.locator('[role="listbox"] .asset-mark').count() == 4
    assert page.locator('[role="option"]').filter(has_text="ETH").locator(".asset-mark--eth").count() == 1
    page.get_by_role("button", name="Select base token").click()
    assert page.locator("#advanced-almm-flow, #advanced-arl-flow").count() == 0
    page.screenshot(path=OUTPUT / "create-desktop.png", full_page=True)
    page.get_by_role("button", name="Advanced", exact=True).click()
    assert_text(page, "#create-models", "Select Strategy")
    assert page.locator('[data-flow="quick"]').count() == 0
    assert page.locator("#advanced-almm-flow").is_visible()
    assert page.locator("#advanced-almm-flow .asset-mark").count() >= 4
    assert page.locator("#advanced-almm-flow .creation-section").count() == 4
    assert page.locator(".model-card__heading .ds-badge").count() == 2
    assert page.locator("#advanced-almm-flow .creation-preview .ds-badge").count() == 0
    assert page.locator("#advanced-almm-flow .creation-sequence").count() == 0
    assert page.locator("#advanced-almm-flow .builder-input-suffix strong").evaluate("el => getComputedStyle(el).whiteSpace") == "nowrap"
    assert page.locator(".strategy-image img").first.evaluate("el => getComputedStyle(el).objectFit") == "contain"
    assert page.locator(".strategy-image img").first.evaluate("el => getComputedStyle(el).transform") == "none"
    for visual in page.locator(".strategy-image").all():
        visual_box = visual.bounding_box()
        image_box = visual.locator("img").bounding_box()
        assert visual_box and image_box
        assert image_box["width"] < visual_box["width"] * .8
        assert 215 <= image_box["height"] <= 217
        assert image_box["height"] < visual_box["height"]
        visual_center_x = visual_box["x"] + visual_box["width"] / 2
        visual_center_y = visual_box["y"] + visual_box["height"] / 2
        image_center_x = image_box["x"] + image_box["width"] / 2
        image_center_y = image_box["y"] + image_box["height"] / 2
        assert abs(visual_center_x - image_center_x) < 1
        assert abs(visual_center_y - image_center_y) < 1
    for heading in page.locator(".model-card__heading").all():
        title_box = heading.locator("h3").bounding_box()
        badge_box = heading.locator(".ds-badge").bounding_box()
        assert title_box and badge_box and badge_box["x"] >= title_box["x"] + title_box["width"]
    for label in ["Powered by ALMM", "Powered by ARL"]:
        badge = page.get_by_text(label, exact=True)
        assert "linear-gradient" in badge.evaluate("el => getComputedStyle(el).backgroundImage")
        assert badge.evaluate("el => getComputedStyle(el).borderTopWidth") == "0px"
        assert badge.get_attribute("style") is None
        assert badge.locator("img").count() == 0
    page.evaluate("document.documentElement.dataset.theme = 'dark'")
    for label in ["Powered by ALMM", "Powered by ARL"]:
        assert "linear-gradient" in page.get_by_text(label, exact=True).evaluate("el => getComputedStyle(el).backgroundImage")
    page.evaluate("document.documentElement.dataset.theme = 'light'")
    balanced_bar_count = page.locator("#advanced-almm-flow .creation-chart i").count()
    assert page.locator("#advanced-almm-flow .creation-chart-axis span").count() == balanced_bar_count
    assert_text(page, "#advanced-almm-flow .creation-chart-axis", "OPEN")
    balanced_title = page.locator("#advanced-almm-flow .spacing-grid button").filter(has_text="Balanced").locator(".choice-card-title")
    balanced_label_box = balanced_title.locator("span").first.bounding_box()
    balanced_badge_box = balanced_title.locator(".ds-badge").bounding_box()
    assert balanced_label_box and balanced_badge_box and balanced_badge_box["x"] >= balanced_label_box["x"] + balanced_label_box["width"]
    assert abs(balanced_badge_box["y"] - balanced_label_box["y"]) < 3
    page.get_by_role("button", name="Wide 0.50%").click()
    assert_text(page, "#advanced-almm-flow .creation-preview", "50 bps")
    assert page.locator("#advanced-almm-flow .creation-chart").get_attribute("data-preview-variant") == "50 bps"
    assert page.locator("#advanced-almm-flow .creation-chart i").count() < balanced_bar_count
    assert_text(page, "#advanced-almm-flow .creation-chart-axis", "-2.0%")
    assert_text(page, "#advanced-almm-flow .creation-chart-axis", "+2.0%")
    page.locator("#create-models").screenshot(path=OUTPUT / "create-strategy-cards.png")
    page.locator("#advanced-almm-flow .creation-preview").screenshot(path=OUTPUT / "create-almm-preview-panel.png")
    page.screenshot(path=OUTPUT / "create-almm-preview.png", full_page=True)
    page.get_by_role("button", name="Review creation").click()
    assert_text(page, ".action-dialog", "Review ALMM creation")
    page.get_by_role("button", name="Prepare transactions").click()
    assert_text(page, ".action-success", "Ready for wallet review")
    page.get_by_role("button", name="Done").click()
    page.locator('.model-card').filter(has_text="Range liquidity").click()
    assert page.locator("#advanced-arl-flow").is_visible()
    assert page.locator("#advanced-arl-flow .creation-section").count() == 4
    assert page.locator("#advanced-arl-flow .creation-preview .ds-badge").count() == 0
    dual_title = page.locator("#advanced-arl-flow .choice-grid").first.locator("button").filter(has_text="Dual-sided").locator(".choice-card-title")
    dual_label_box = dual_title.locator("span").first.bounding_box()
    dual_badge_box = dual_title.locator(".ds-badge").bounding_box()
    assert dual_label_box and dual_badge_box and dual_badge_box["x"] >= dual_label_box["x"] + dual_label_box["width"]
    assert abs(dual_badge_box["y"] - dual_label_box["y"]) < 3
    page.get_by_role("button", name="Single-sided Deposit ETH only").click()
    assert page.locator("#advanced-arl-flow .creation-chart").get_attribute("data-preview-variant") == "Single-sided"
    assert page.locator("#advanced-arl-flow .creation-chart i.is-muted").count() == 6
    page.get_by_role("button", name="Dynamic", exact=True).click()
    assert_text(page, "#advanced-arl-flow", "Maximum fee")
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(200)
    page.screenshot(path=OUTPUT / "create-advanced-desktop.png", full_page=True)

    page.goto(f"{BASE_URL}fees", wait_until="networkidle")
    page.get_by_role("button", name="LP fees").click()
    assert page.locator(".claims-list article").count() == 1
    page.get_by_role("button", name="Create vault").click()
    assert_text(page, ".vault-builder", "Recipients")
    assert_text(page, ".vault-builder", "Total share")
    page.get_by_role("button", name="0x8F2…91A").click()

    page.goto(f"{BASE_URL}portfolio", wait_until="networkidle")
    assert page.locator(".connect-banner").count() == 0
    assert_text(page, ".portfolio-panel", "Connect wallet to open your portfolio")
    page.screenshot(path=OUTPUT / "portfolio-disconnected-desktop.png", full_page=True)
    page.get_by_role("button", name="Connect wallet", exact=True).click()
    page.get_by_role("button", name="Limit orders").click()
    assert_text(page, ".order-list", "Claimable")

    page.goto(f"{BASE_URL}position/8420", wait_until="networkidle")
    assert_text(page, ".workspace-header", "position #8420")
    page.get_by_role("button", name="Performance").click()
    assert_text(page, ".performance-grid", "Realized PnL")

    page.goto(f"{BASE_URL}currency/usdc", wait_until="networkidle")
    assert_text(page, ".workspace-header", "USD Coin")
    page.get_by_role("button", name="Deployments").click()
    assert_text(page, ".deployment-list", "Verified")

    page.goto(f"{BASE_URL}launch", wait_until="networkidle")
    page.get_by_role("button", name="Active", exact=True).click()
    assert page.locator(".launch-market-card").count() == 3
    page.get_by_role("button", name="Watch ETH", exact=True).click()
    page.get_by_role("button", name="Watching", exact=True).click()
    assert page.locator(".launch-market-card").count() == 1
    assert_text(page, ".launch-market-card", "ETH")
    page.reload(wait_until="networkidle")
    assert page.locator(".page-tabs button.active").inner_text() == "Watching"
    page.get_by_role("button", name="Markets", exact=True).click()
    page.screenshot(path=OUTPUT / "launch-discover-desktop.png", full_page=True)
    page.get_by_role("button", name="Create launch").first.click()
    assert page.locator(".quick-select__options > button").count() == 3
    assert page.locator(".launch-create-builder").is_visible()
    page.get_by_role("button", name="Launch with first buy").click()
    assert page.locator(".launch-full-field").is_visible()
    page.locator("#launch-token-image").set_input_files("public/ammora-logo-optimized.webp")
    assert_text(page, ".file-upload", "ammora-logo-optimized.webp")
    quote_asset_button = page.get_by_role("button", name="Select quote asset")
    quote_asset_button.scroll_into_view_if_needed()
    page.wait_for_timeout(100)
    review_before_dropdown = page.locator(".launch-create-review").bounding_box()
    quote_asset_button.click()
    assert page.locator('[role="listbox"] .asset-mark').count() == 3
    review_after_dropdown = page.locator(".launch-create-review").bounding_box()
    assert review_before_dropdown and review_after_dropdown
    assert abs(review_before_dropdown["x"] - review_after_dropdown["x"]) < 1
    assert abs(review_before_dropdown["y"] - review_after_dropdown["y"]) < 1
    assert page.locator(".launch-create-builder").evaluate("el => getComputedStyle(el).overflow") == "visible"
    page.screenshot(path=OUTPUT / "launch-quote-dropdown.png", full_page=False)
    page.get_by_role("option", name="USDC").click()
    assert page.get_by_role("button", name="Select quote asset").locator(".asset-mark--usdc").count() == 1
    page.get_by_role("button", name="Review transactions").click()
    assert_text(page, ".action-dialog", "Review launch transactions")
    page.get_by_role("button", name="Close").click()
    page.locator("#launch-lifecycle summary").click()
    assert_text(page, "#launch-lifecycle", "Launch with first buy")
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(200)
    page.screenshot(path=OUTPUT / "launch-desktop.png", full_page=True)

    page.goto(f"{BASE_URL}launch/create", wait_until="networkidle")
    assert page.locator(".launch-create-builder").is_visible()
    assert page.locator(".quick-select__options > button").count() == 3

    page.get_by_role("button", name="Markets", exact=True).click()
    page.locator(".launch-market-card").first.click()
    page.wait_for_url("**/#/launch/eth")
    assert_text(page, ".workspace-header h1", "ETH / GIWA")
    assert page.get_by_role("button", name="Watching", exact=True).is_visible()
    assert page.locator(".market-state-bar").count() == 0
    assert "Trade now and follow progress toward permanent liquidity." not in page.locator("body").inner_text()
    assert page.locator(".workspace-header__meta").count() == 0
    assert page.locator("#price-line-gradient stop").count() == 3
    assert page.locator("#price-area-gradient stop").count() == 3
    assert "price-line-gradient" in page.locator(".chart-line").evaluate("el => getComputedStyle(el).stroke")
    assert "price-area-gradient" in page.locator(".chart-area").evaluate("el => getComputedStyle(el).fill")
    page.get_by_role("button", name="Creator tools").click()
    assert_text(page, ".creator-tools", "Transfer creator")
    if page.locator(".token-trade-card").get_by_role("button", name="Connect wallet", exact=True).count():
        page.locator(".token-trade-card").get_by_role("button", name="Connect wallet", exact=True).click()
    page.get_by_role("button", name="Sell").click()
    assert_text(page, ".trade-amount-field", "Sell ETH")
    assert page.get_by_role("button", name="Sell ETH", exact=True).is_visible()
    page.get_by_role("button", name="Sell ETH", exact=True).click()
    assert page.locator(".action-dialog").count() == 0
    page.screenshot(path=OUTPUT / "launch-token-desktop.png", full_page=True)

    page.get_by_role("button", name="Switch to dark mode").click()
    assert page.locator("html").get_attribute("data-theme") == "dark"
    page.wait_for_timeout(350)
    logo_style = page.locator(".brand-original").evaluate("el => getComputedStyle(el).filter")
    wordmark_style = page.locator(".brand-wordmark").evaluate("el => getComputedStyle(el).display")
    assert logo_style == "none"
    assert wordmark_style == "block"
    page.screenshot(path=OUTPUT / "launch-token-dark.png", full_page=True)
    page.get_by_role("button", name="Switch to light mode").click()

    page.goto(f"{BASE_URL}currencies", wait_until="networkidle")
    page.get_by_role("button", name="Major assets").first.click()
    assert page.locator(".currency-row:not(.currency-head)").count() == 3

    page.goto(f"{BASE_URL}pool/eth-usdc", wait_until="networkidle")
    page.get_by_role("button", name="Activity", exact=True).click()
    page.get_by_role("button", name="Liquidity", exact=True).last.click()
    assert_text(page, ".activity-table", "Add liquidity")
    page.get_by_role("button", name="Manage pool").click()
    assert_text(page, ".manage-action-grid", "Zap in")
    page.get_by_role("button", name="Limit order").click()
    assert page.get_by_role("dialog").is_visible()
    page.get_by_role("button", name="Close").click()

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile.goto(f"{BASE_URL}create", wait_until="networkidle")
    assert mobile.locator(".quick-select__options > button").count() == 3
    mobile.screenshot(path=OUTPUT / "create-mobile.png", full_page=True)
    mobile.goto(f"{BASE_URL}launch/eth", wait_until="networkidle")
    assert_text(mobile, ".token-trade-card", "Trade ETH")
    mobile.screenshot(path=OUTPUT / "launch-token-mobile.png", full_page=True)

    assert not page_errors, page_errors
    assert not console_errors, console_errors
    browser.close()

print(OUTPUT)
