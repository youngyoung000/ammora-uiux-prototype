# Ammora Product Design System

This system is for Ammora’s functional product pages. It organizes the protocol around user jobs, keeps each screen focused on one primary task, and uses a quiet, readable visual language in both light and dark themes.

## Foundations

- Display type: **Nunito Sans**, weights 600–800
- Product copy: **Manrope**, weights 400–700
- Minimum functional copy: **14px**; 12–13px is reserved for tertiary metadata only
- Default body copy: **16px / 1.6**
- Page headings: **34–48px**
- Section headings: **26–34px**
- Grid: 4px base with 8, 12, 16, 20, 24, 32, 40, 48 and 64px steps
- Content width: 1380px maximum
- Borders: neutral 1px dividers replace decorative shadows
- Radius: 10px fields, 16px primary panels, pill-shaped CTAs and compact navigation controls

## Color roles

- Primary key: `#111318` in light mode and `#F5F7FB` in dark mode
- Strong ink: `#151823`
- Body ink: `#303746`
- Secondary ink: `#626B7D`
- Muted ink: `#8791A4`
- Canvas: `#F8F9FB`
- Surface: `#FFFFFF`
- Border: `#E3E6EB`
- Positive: `#0A9F75`
- Negative: `#D85162`

Primary calls to action and active navigation use a monochrome black/white key color. The Ammora symbol and high-emphasis chips such as `Recommended` and `Powered by ALMM/ARL` use the CSS `--brand-gradient` in both themes; raster chip assets are not used.

Light and dark modes use the same semantic roles (`canvas`, `surface`, `text`, `line`, `positive`, `negative`) rather than page-specific colors. Theme selection follows the system preference on first visit and is then remembered locally.

## Product architecture

- Primary navigation is action-based: **Trade / Liquidity / Launch / Portfolio**.
- Protocol names such as ALMM and ARL are supporting metadata. The user-facing choices are **Dynamic liquidity** and **Range liquidity**, followed by `Powered by ALMM/ARL`.
- Secondary capabilities live in context: Create Pool under Liquidity, Fees & Claims under Portfolio, Saved Pools and Alerts near discovery/detail, and Token Directory in secondary navigation.
- Every product area repeats the same structure: **Discovery → Detail → Action**.
- Each page has one primary job. Explanatory copy is limited to a short instruction; controls, states, steps, and empty-state actions teach the flow.
- Technical details such as route adapters, runtime hashes, dynamic fee settings, bin steps, and graduation thresholds are disclosed only when needed through Details or Advanced sections.

## Shared components

- `Button`: primary, secondary and ghost variants; 40px or 46px height
- `Badge`: brand, neutral and success status variants
- `Panel`: the standard bordered product surface
- `PageIntro`: shared page title, description, actions and contextual aside
- `WorkspaceHeader`: compact task title, live state and primary actions for functional pages
- `PageTabs`: stable page-level sections such as market views or creation modes
- `SectionHeading`: section hierarchy and optional trailing action
- `Metric`: label, value and contextual note
- `SearchField`: accessible product search input
- `SegmentedControl`: filters and view switching
- `StatusDot`: network and lifecycle status
- `TokenIcon` / `TokenPair`: consistent asset identification; symbols are never shown without an identifying mark in transaction inputs
- `TokenSelectorModal`: searchable token selection with common assets, balances, contract evidence and a clear selected state
- `QuickSelect`: independent outcome cards reserved for decisions that materially change strategy, lifecycle or risk
- `ThemeToggle`: persistent light/dark mode control using semantic design tokens

## Interaction rules

- All interactive elements expose a visible keyboard focus ring.
- Primary actions use the monochrome key color; secondary actions use a neutral border.
- Hovered and selected cards use the CSS `--interaction-gradient` tint with a 1px black/white key-color stroke. Quick-select options remain separate cards so the active outline never collides with a neighboring radius.
- Fields, token selectors, rows, cards, tabs, and disclosure controls share the same hover, focus, selected, and placeholder transitions.
- Tables preserve full data on desktop and collapse to task-critical fields on mobile.
- Wallet-gated pages retain a readable preview and an action-oriented empty state instead of hiding the page behind a modal.
- Quick routes are used only in pool creation and token launch. Search, swap, portfolio and read-only catalogs use direct controls instead.
- Quick routes change only safe defaults; every amount, setting and transaction remains editable and reviewable.
- Transaction inputs use icon-led token buttons and a modal instead of native selects. Focus is applied to the field container, without an additional inner input border.
- Launch discovery uses comparable market cards; selecting a token opens a Market Detail workspace with current state, next action, decision-useful chart/activity and Buy/Sell controls.
- Lifecycle state appears once in its decision context. Launch detail uses the market-progress card beside the Buy/Sell action instead of repeating the same state in the page header and a separate lifecycle bar.
- Charts appear only where they support a decision: price on Market Detail, distribution/range on Pool Detail, and compact comparison signals in discovery.
- Pool Detail keeps `Liquidity` as the primary workspace: distribution preset → draggable price range → token amounts → review. Range handles support pointer drag, keyboard arrows and synchronized numeric inputs. Create Launch follows setup → token details → opening market → review, with curve settings kept under Advanced.
- Product navigation and page state use hash routes so the same build works locally and in a shared artifact.

## Responsive behavior

- Desktop: compact single-row action navigation and task-focused data tables
- Tablet: condensed network controls, wrapping toolbars and reduced table columns
- Mobile: menu overlay, stacked page intros, task-critical list rows and full-width actions

Source tokens live in `src/design-system/tokens.css`; reusable React primitives live in `src/design-system/index.jsx`.
