# Ammora Product UI

Frontend-only redesign of Ammora’s functional product experience. The product is organized around user actions—Trade, Liquidity, Launch, and Portfolio—and presented through a shared, accessibility-minded light/dark design system.

## Live preview

[Open the public UI/UX prototype](https://youngyoung000.github.io/ammora-uiux-prototype/#/swap)

## Preview routes

- `#/swap`
- `#/explore`
- `#/pool/eth-usdc`
- `#/portfolio`
- `#/fees`
- `#/create`
- `#/launch`
- `#/launch/eth` (selected ETH / GIWA launch market detail)
- `#/currencies`
- `#/currency/usdc` (token deployments and related markets)
- `#/position/8420` (position performance and management)

## Design system

Foundations and component usage are documented in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Tokens live in `src/design-system/tokens.css`, component styles in `src/design-system/components.css`, and shared React primitives in `src/design-system/index.jsx`.

Brand gradients are rendered only through CSS semantic surfaces. `Recommended`, `Powered by ALMM/ARL`, selected states, chart emphasis, and current-price labels are guarded by `npm run check:design-system`; rasterized badge and gradient UI assets are not allowed.

The live reference-site audit and complete public feature mapping are documented in [`REFERENCE_FEATURE_INVENTORY.md`](./REFERENCE_FEATURE_INVENTORY.md).

Frontend-only Ammora protocol interface, built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to create the production bundle and `node scripts/build_share_preview.mjs` to create the self-contained external preview.

## Quality checks

```bash
npm run verify
```

This runs ESLint, design-system guardrails, and the production build.
