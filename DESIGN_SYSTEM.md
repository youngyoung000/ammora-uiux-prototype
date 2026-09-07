# Ammora Product Design System

Version 1.0 · September 2026

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

Primary calls to action and active navigation use a monochrome black/white key color. The Ammora symbol and high-emphasis chips such as `Recommended` and `Powered by ALMM/ARL` use the semantic CSS surface `--surface-brand` in both themes. Raster badge, chip, gradient, or selected-state assets are prohibited.

Light and dark modes use the same semantic roles (`canvas`, `surface`, `text`, `line`, `positive`, `negative`) rather than page-specific colors. Light mode is the default on first visit. A user-selected theme is remembered locally when storage is available.

## Source of truth

| Layer | File | Responsibility |
| --- | --- | --- |
| Foundations | `src/design-system/tokens.css` | Color, type, spacing, radius, motion, theme, and semantic surface tokens |
| Components | `src/design-system/components.css` | Shared visual behavior for product primitives |
| React API | `src/design-system/index.jsx` | Reusable accessible component markup and variants |
| Product layout | `src/styles.css` | Page-specific composition only; no raw gradient definitions |
| Guardrail | `scripts/check_design_system.mjs` | Prevents raster gradient UI and unscoped gradient implementations |

## Brand surface rules

The gradient has one implementation path:

```css
.ds-brand-surface {
  background-color: var(--brand-blue);
  background: var(--surface-brand) border-box;
}
```

Use the semantic surface according to intent:

| Token or class | Use | Examples |
| --- | --- | --- |
| `.ds-brand-surface` / `--surface-brand` | Compact, high-emphasis brand identity; fill the complete border box with no transparent rim | `Recommended`, `Powered by ALMM`, `Powered by ARL`, current-price labels |

### Dropdowns and uploads

- Use the shared `DropdownSelect` component instead of a native `select`. The trigger, chevron, open menu, selected option, hover, focus, and dark theme are controlled by the design system.
- File inputs remain visually hidden. A product-language `.file-upload` label presents `Choose image`, the selected filename, replacement guidance, and accepted formats without inheriting operating-system language.
- Dropdown triggers use a 54px control height by default and reserve fixed space for the chevron so long values never displace it.

### Transaction completion

Primary write actions open the shared `ActionDialog`. The normal prototype path is `Review → Prepare wallet transaction → Ready for wallet review → Done`; approval, target, network, and protection details remain visible before the final step.
| `--surface-brand-subtle` | Hover, focus, and selected backgrounds | Quick-select cards, strategy cards, fields, rows |
| `--surface-brand-vertical` | Data visualization emphasis | In-range liquidity bars |
| `--surface-neutral-gradient` | Neutral illustration stage only | Strategy graphic backgrounds |

Do not use screenshots, PNGs, WebPs, SVG backgrounds, inline `style` gradients, or page-level `linear-gradient(...)` declarations to reproduce these surfaces. Illustration assets may contain only the illustration itself; their UI background, badge, state, stroke, and radius are rendered by CSS.

## Product architecture

- Primary navigation is action-based: **Trade / Liquidity / Launch / Portfolio**.
- Protocol names such as ALMM and ARL are supporting metadata. The user-facing choices are **Dynamic liquidity** and **Range liquidity**, followed by `Powered by ALMM/ARL`.
- Secondary capabilities live in context: Create Pool under Liquidity, Fees & Claims under Portfolio, Saved Pools and Alerts near discovery/detail, and Token Directory in secondary navigation.
- Every product area repeats the same structure: **Discovery → Detail → Action**.
- Each page has one primary job. Explanatory copy is limited to a short instruction; controls, states, steps, and empty-state actions teach the flow.
- Technical details such as route adapters, runtime hashes, dynamic fee settings, bin steps, and graduation thresholds are disclosed only when needed through Details or Advanced sections.

## Shared components

- `Button`: primary, secondary and ghost variants; 40px or 46px height
- `BrandSurface`: low-level semantic gradient surface for non-badge brand marks
- `Badge`: brand, neutral and success status variants; `brand` automatically uses `BrandSurface`
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

## Component usage

```jsx
import { Badge, BrandSurface } from './design-system/index.jsx'

<Badge>Powered by ALMM</Badge>
<Badge size="sm">Recommended</Badge>
<Badge tone="neutral">Preview</Badge>
<Badge tone="success">Live</Badge>
<BrandSurface className="current-price-label">Current price</BrandSurface>
```

- Use `Badge` for compact labels. Brand badges are borderless so the CSS gradient fills the complete pill; do not add transparent borders or a page-specific gradient class.
- Use `BrandSurface` only when the semantic brand surface is not a badge.
- Status meaning uses `neutral`, `success`, warning, or error colors—not the brand gradient.
- Selected cards use a monochrome 1px border plus `--surface-brand-subtle`; they do not use the strong brand gradient.
- Buttons remain monochrome. The brand gradient is not a primary CTA style.

## Contribution guardrails

Run the full UI verification before committing:

```bash
npm run verify
```

`npm run check:design-system` fails when:

- a page stylesheet declares its own `linear-gradient(...)`;
- a page uses raw `--brand-gradient` or `--interaction-gradient` instead of semantic surfaces;
- a badge, chip, or gradient UI is implemented with a raster image;
- the ALMM/ARL badges, Recommended badge, current-price label, or launch review mark leave the shared system.

When adding a new branded surface, add or reuse a semantic token first, implement it in `components.css`, document its purpose here, and then consume the shared class or component.

## Responsive behavior

- Desktop: compact single-row action navigation and task-focused data tables
- Tablet: condensed network controls, wrapping toolbars and reduced table columns
- Mobile: menu overlay, stacked page intros, task-critical list rows and full-width actions

Tokens, component CSS, React primitives, and automated guardrails together form the design system. Page styles should only compose those primitives into product-specific layouts.
