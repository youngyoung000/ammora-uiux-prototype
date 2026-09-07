from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5190/#/"
OUTPUT = Path("/private/tmp/ammora-quick-select")
OUTPUT.mkdir(parents=True, exist_ok=True)


def assert_text(page, selector, expected):
    value = page.locator(selector).inner_text()
    assert expected in value, f"Expected {expected!r} in {selector}, got {value!r}"


def assert_no_page_overflow(page, label):
    sizes = page.evaluate("""() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
    })""")
    assert sizes["scrollWidth"] <= sizes["clientWidth"] + 1, f"{label}: document overflow {sizes}"
    assert sizes["bodyScrollWidth"] <= sizes["clientWidth"] + 1, f"{label}: body overflow {sizes}"


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
    for visual in page.locator(".strategy-image").all():
        visual_box = visual.bounding_box()
        image_box = visual.locator("img").bounding_box()
        assert visual_box and image_box
        assert image_box["width"] < visual_box["width"] * .8
        assert 258 <= image_box["height"] <= 260
        assert image_box["height"] > visual_box["height"]
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

    page.locator(".theme-toggle").click()
    assert page.locator("html").get_attribute("data-theme") == "dark"
    page.wait_for_timeout(350)
    logo_style = page.locator(".brand-original").evaluate("el => getComputedStyle(el).filter")
    wordmark_style = page.locator(".brand-wordmark").evaluate("el => getComputedStyle(el).display")
    assert logo_style == "none"
    assert wordmark_style == "block"
    page.screenshot(path=OUTPUT / "launch-token-dark.png", full_page=True)
    page.locator(".theme-toggle").click()

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
    mobile_errors = []
    mobile_console_errors = []
    mobile.on("pageerror", lambda error: mobile_errors.append(str(error)))
    mobile.on("console", lambda message: mobile_console_errors.append(message.text) if message.type == "error" else None)
    mobile.goto(f"{BASE_URL}create", wait_until="networkidle")
    mobile_header = mobile.locator(".header-main").bounding_box()
    assert mobile_header and mobile_header["x"] < 1 and mobile_header["width"] >= 389
    assert mobile.locator(".header-main").evaluate("el => getComputedStyle(el).paddingLeft") == "8px"
    assert mobile.locator(".quick-select__options > button").count() == 3
    mobile.screenshot(path=OUTPUT / "create-mobile.png", full_page=True)
    assert_no_page_overflow(mobile, "390/create-quick")

    mobile.get_by_role("button", name="Advanced", exact=True).click()
    mobile_visual = mobile.locator(".model-visual").first.bounding_box()
    mobile_image = mobile.locator(".strategy-image img").first.bounding_box()
    assert mobile_visual and mobile_image
    assert 114 <= mobile_visual["height"] <= 116
    assert 229 <= mobile_image["height"] <= 231
    assert abs((mobile_visual["y"] + mobile_visual["height"] / 2) - (mobile_image["y"] + mobile_image["height"] / 2)) < 1
    mobile.screenshot(path=OUTPUT / "create-advanced-mobile.png", full_page=True)
    mobile.locator(".model-card").filter(has_text="Range liquidity").click()
    assert mobile.locator("#advanced-arl-flow .funding-grid").evaluate("el => getComputedStyle(el).gridTemplateColumns.split(' ').length") == 1
    funding_title = mobile.locator("#advanced-arl-flow .funding-grid button").filter(has_text="Dual-sided").locator(".choice-card-title")
    funding_label = funding_title.locator("span").first.bounding_box()
    funding_badge = funding_title.locator(".ds-badge").bounding_box()
    assert funding_label and funding_badge
    assert funding_badge["x"] >= funding_label["x"] + funding_label["width"]
    mobile.get_by_role("button", name="Schedule", exact=True).last.click()
    date_field = mobile.locator("#advanced-arl-flow input[type='datetime-local']")
    date_box = date_field.bounding_box()
    date_parent = date_field.locator("xpath=..").bounding_box()
    assert date_box and date_parent and date_box["x"] >= date_parent["x"] and date_box["x"] + date_box["width"] <= date_parent["x"] + date_parent["width"] + 1
    assert_no_page_overflow(mobile, "390/create-advanced-arl")
    mobile.screenshot(path=OUTPUT / "create-advanced-arl-mobile.png", full_page=True)

    mobile.goto(f"{BASE_URL}swap", wait_until="networkidle")
    mobile.get_by_role("button", name="Select you pay token").click()
    modal_box = mobile.locator(".token-modal").bounding_box()
    assert modal_box and modal_box["x"] < 1 and modal_box["y"] < 1
    assert modal_box["width"] >= 389 and modal_box["height"] >= 843
    assert mobile.locator(".token-modal-backdrop").evaluate("el => getComputedStyle(el).backdropFilter") == "none"
    shortcut_box = mobile.locator(".token-shortcuts button").first.bounding_box()
    tokens_label_box = mobile.locator(".token-list-label").bounding_box()
    assert shortcut_box and tokens_label_box and shortcut_box["height"] >= 95
    assert shortcut_box["y"] + shortcut_box["height"] <= tokens_label_box["y"]
    mobile.screenshot(path=OUTPUT / "swap-token-mobile.png", full_page=False)
    mobile.get_by_role("button", name="Close token selector").click()

    mobile.goto(f"{BASE_URL}explore", wait_until="networkidle")
    liquidity_categories = mobile.get_by_role("group", name="Liquidity strategy")
    assert liquidity_categories.evaluate("el => el.scrollWidth > el.clientWidth")
    assert liquidity_categories.locator("button").first.evaluate("el => getComputedStyle(el).whiteSpace") == "nowrap"
    liquidity_categories.evaluate("el => { el.scrollLeft = 100 }")
    assert liquidity_categories.evaluate("el => el.scrollLeft") > 0
    mobile.screenshot(path=OUTPUT / "liquidity-list-mobile.png", full_page=False)

    mobile.goto(f"{BASE_URL}currencies", wait_until="networkidle")
    currency_categories = mobile.get_by_role("group", name="Currency group")
    assert currency_categories.locator("button").first.evaluate("el => getComputedStyle(el).whiteSpace") == "nowrap"
    assert mobile.locator(".currency-row").nth(1).evaluate("el => el.getBoundingClientRect().height") >= 87
    mobile.screenshot(path=OUTPUT / "currencies-mobile.png", full_page=True)

    mobile.goto(f"{BASE_URL}pool/eth-usdc", wait_until="networkidle")
    mobile.get_by_role("button", name="Activity", exact=True).click()
    activity_categories = mobile.get_by_role("group", name="Activity type")
    assert activity_categories.evaluate("el => el.scrollWidth > el.clientWidth")
    activity_categories.evaluate("el => { el.scrollLeft = 140 }")
    assert activity_categories.evaluate("el => el.scrollLeft") > 0
    activity_title = mobile.locator(".activity-workspace .panel-title-row h2").bounding_box()
    activity_filters = mobile.locator(".activity-workspace .panel-title-row .ds-segmented").bounding_box()
    activity_table = mobile.locator(".activity-workspace .activity-table").bounding_box()
    assert activity_title and activity_filters and activity_table
    assert abs(activity_title["x"] - activity_filters["x"]) < 1
    assert abs(activity_filters["x"] - activity_table["x"]) < 1
    mobile.screenshot(path=OUTPUT / "pool-activity-mobile.png", full_page=False)
    mobile.get_by_role("button", name="Manage pool", exact=True).click()
    tools_panel = mobile.locator(".pool-tools-panel")
    tools_title = tools_panel.locator(".panel-title-row").bounding_box()
    tools_grid = tools_panel.locator(".manage-action-grid").bounding_box()
    tools_details = tools_panel.locator(".pool-advanced").bounding_box()
    assert tools_title and tools_grid and tools_details
    assert abs(tools_title["x"] - tools_grid["x"]) < 1
    assert abs(tools_grid["x"] - tools_details["x"]) < 1
    assert tools_panel.evaluate("el => getComputedStyle(el).paddingLeft") == "16px"
    mobile.screenshot(path=OUTPUT / "pool-tools-mobile.png", full_page=True)

    mobile.goto(f"{BASE_URL}portfolio", wait_until="networkidle")
    if mobile.get_by_role("button", name="Connect wallet", exact=True).count():
        mobile.get_by_role("button", name="Connect wallet", exact=True).click()
    mobile.get_by_role("button", name="Saved & alerts", exact=True).click()
    saved_card = mobile.locator(".portfolio-panel > .context-actions article").first
    assert saved_card.evaluate("el => getComputedStyle(el).display") == "grid"
    saved_copy = saved_card.locator("div").bounding_box()
    saved_action = saved_card.locator(".ds-button, .ds-badge").bounding_box()
    assert saved_copy and saved_action and saved_action["y"] >= saved_copy["y"] + saved_copy["height"]
    mobile.screenshot(path=OUTPUT / "portfolio-saved-mobile.png", full_page=True)
    mobile.get_by_role("button", name="Creator", exact=True).click()
    assert_no_page_overflow(mobile, "390/portfolio-creator")
    mobile.screenshot(path=OUTPUT / "portfolio-creator-mobile.png", full_page=True)

    mobile.goto(f"{BASE_URL}launch/create", wait_until="networkidle")
    mobile.get_by_role("button", name="Scheduled activation").click()
    launch_date = mobile.locator(".launch-create-form .ds-date-time")
    launch_form = mobile.locator(".launch-create-form")
    launch_date_box = launch_date.bounding_box()
    launch_form_box = launch_form.bounding_box()
    assert launch_date_box and launch_form_box
    assert launch_date_box["x"] >= launch_form_box["x"]
    assert launch_date_box["x"] + launch_date_box["width"] <= launch_form_box["x"] + launch_form_box["width"] + 1
    assert launch_date.locator("input[type='datetime-local']").count() == 1
    assert_no_page_overflow(mobile, "390/launch-create-scheduled")
    mobile.screenshot(path=OUTPUT / "launch-create-scheduled-mobile.png", full_page=True)

    mobile.goto(f"{BASE_URL}launch/eth", wait_until="networkidle")
    mobile.wait_for_selector(".market-detail-grid")
    assert_text(mobile, ".token-trade-card", "Trade ETH")
    progress_box = mobile.locator(".graduation-card").bounding_box()
    trade_box = mobile.locator(".trade-sidebar").bounding_box()
    assert progress_box and trade_box and progress_box["y"] + progress_box["height"] <= trade_box["y"] + 2, (progress_box, trade_box)
    mobile.screenshot(path=OUTPUT / "launch-token-mobile.png", full_page=True)

    footer_theme = mobile.locator(".footer-theme-toggle")
    assert footer_theme.is_visible()
    assert footer_theme.evaluate("el => getComputedStyle(el).width") == "354px"
    theme_before = mobile.locator("html").get_attribute("data-theme")
    footer_theme.click()
    assert mobile.locator("html").get_attribute("data-theme") != theme_before
    footer_theme.click()

    mobile_routes = [
        "explore", "swap", "portfolio", "create", "launch", "launch/create",
        "launch/eth", "currencies", "currency/usdc", "fees", "pool/eth-usdc", "position/8420",
    ]
    for width in [390, 320]:
        audit = browser.new_page(viewport={"width": width, "height": 844}, device_scale_factor=1)
        audit.on("pageerror", lambda error: mobile_errors.append(str(error)))
        audit.on("console", lambda message: mobile_console_errors.append(message.text) if message.type == "error" else None)
        for route in mobile_routes:
            audit.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            assert_no_page_overflow(audit, f"{width}/{route}")
            if width == 390:
                audit.screenshot(path=OUTPUT / f"mobile-audit-{route.replace('/', '-')}.png", full_page=True)
        audit.goto(f"{BASE_URL}create", wait_until="networkidle")
        audit.get_by_role("button", name="Advanced", exact=True).click()
        assert_no_page_overflow(audit, f"{width}/create-advanced-almm")
        audit.locator(".model-card").filter(has_text="Range liquidity").click()
        audit.get_by_role("button", name="Schedule", exact=True).last.click()
        assert_no_page_overflow(audit, f"{width}/create-advanced-arl-scheduled")
        audit.screenshot(path=OUTPUT / f"mobile-audit-{width}-create-arl.png", full_page=True)
        audit.close()

    assert not page_errors, page_errors
    assert not console_errors, console_errors
    assert not mobile_errors, mobile_errors
    assert not mobile_console_errors, mobile_console_errors
    browser.close()

print(OUTPUT)
